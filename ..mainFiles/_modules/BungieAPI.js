"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.getchar = exports.getToken = exports.getItemDetails = exports.downloadManifest = exports.loadManifest = exports.getVendorInfo = exports.itemManifest = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const databaseService_1 = require("../_services/databaseService");
let manifestLink = "";
async function ada(guardian) {
    let fullItemTable = [{
            itemHash: "",
            perks: {}
        }];
    fullItemTable.pop();
    await axios_1.default.get('https://www.bungie.net/platform/Destiny2/' + guardian.platform + '/Profile/' + guardian.BNG_ID + '/Character/' + guardian.CHAR_ID[1] + '/Vendors/350061650/?components=305,302,402', guardian.cred).then(res => {
        let keys = Object.keys(res.data.Response.sales.data);
        keys.forEach(function put(element, index) {
            fullItemTable.push({
                itemHash: res.data.Response.sales.data[element].itemHash,
                perks: res.data.Response.itemComponents.perks.data[element]
            });
        });
        console.log(fullItemTable);
        return fullItemTable;
    }).catch(err => {
        console.log("Ada Error");
        //console.error(err)
    });
    return fullItemTable;
}
async function banshee(guardian) {
    let fullItemTable = [{
            itemHash: "",
            perks: {}
        }];
    fullItemTable.pop();
    await axios_1.default.get('https://www.bungie.net/platform/Destiny2/' + guardian.platform + '/Profile/' + guardian.BNG_ID + '/Character/' + guardian.CHAR_ID[1] + '/Vendors/672118013/?components=305,302,402', guardian.cred).then(res => {
        let keys = Object.keys(res.data.Response.sales.data);
        keys.forEach(function put(element, index) {
            if (res.data.Response.itemComponents.perks.data[element]) {
                fullItemTable.push({
                    itemHash: res.data.Response.sales.data[element].itemHash,
                    perks: res.data.Response.itemComponents.perks.data[element]
                });
            }
        });
        return fullItemTable;
    }).catch(err => {
        console.log(err);
        console.log("Banshee Error");
    });
    return fullItemTable;
}
async function getVendorInfo(guardian) {
    let vendorData = {
        ada: await ada(guardian),
        banshee: await banshee(guardian)
    };
    //console.log(vendorData.ada);
    return vendorData;
}
exports.getVendorInfo = getVendorInfo;
async function loadManifest(guardian) {
    let raw = fs_1.default.readFileSync(path_1.default.resolve('./manifest.json'));
    exports.itemManifest = JSON.parse(raw);
}
exports.loadManifest = loadManifest;
async function downloadManifest(guardian) {
    await axios_1.default.get(`https://www.bungie.net/platform/Destiny2/Manifest/`, guardian.cred).then(res => {
        manifestLink = res.data.Response.jsonWorldContentPaths.en;
    });
    await axios_1.default.get(`https://www.bungie.net${manifestLink}`).then(res => {
        exports.itemManifest = Object.entries(res.data.DestinyInventoryItemDefinition);
        fs_1.default.writeFileSync('manifest.json', JSON.stringify(exports.itemManifest));
    });
}
exports.downloadManifest = downloadManifest;
function getItemDetails(hashIdentifier) {
    return exports.itemManifest.find(item => item[0] == hashIdentifier);
}
exports.getItemDetails = getItemDetails;
async function getToken(guardian, authorization_code) {
    let data = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW',
        'client_id': process.env.app_ID,
        'grant_type': 'authorization_code',
        'code': `${authorization_code}`,
        'client_secret': process.env.secret
    };
    let content = new URLSearchParams(Object.entries(data)).toString();
    axios_1.default.post('https://www.bungie.net/platform/app/oauth/token/', content).then(async (res) => {
        guardian.token = res.data.access_token;
        guardian.rToken = res.data.refresh_token;
        guardian.cred = {
            headers: {
                'X-API-Key': process.env.key,
                'Authorization': `Bearer ${guardian.token}`
            },
        };
        await getchar(guardian);
        return guardian;
    }).catch(err => {
        console.error(err);
        return guardian;
    });
    return guardian;
}
exports.getToken = getToken;
async function getchar(guardian) {
    console.log("Commencing");
    console.log(guardian.rToken);
    let data = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'client_id': process.env.app_ID,
        'client_secret': process.env.secret,
        'Authorization': 'Bearer mF_9.B5f-4.1JqM',
        'grant_type': 'refresh_token',
        'refresh_token': guardian.rToken,
        'X-API-Key': process.env.key
    };
    let content = new URLSearchParams(Object.entries(data)).toString();
    axios_1.default.post('https://www.bungie.net/Platform/App/OAuth/token/', content).then(res => {
        let memberID = res.data.membership_id;
        axios_1.default.get(`https://www.bungie.net/Platform/User/GetMembershipsById/${memberID}/${guardian.platform}/`, guardian.cred).then(res => {
            guardian.BNG_ID = res.data.Response.destinyMemberships[0].membershipId;
            axios_1.default.get(`https://www.bungie.net/Platform/Destiny2/${guardian.platform}/Profile/${guardian.BNG_ID}/?components=100`, guardian.cred).then(res => {
                for (let index = 0; index < 3; index++) {
                    const element = res.data.Response.profile.data.characterIds[index];
                    if (element) {
                        guardian.CHAR_ID[index] = element;
                        console.log(element);
                    }
                }
            }).catch(err => { console.log(err); console.log("1.1"); });
        }).catch(err => { console.log(err); console.log("1.2"); });
    }).catch(err => { console.log("-"); console.log("1.3"); });
}
exports.getchar = getchar;
async function refresh(guardian) {
    let data = {
        'Authorization': 'Bearer mF_9.B5f-4.1JqM',
        'client_id': process.env.app_ID,
        'client_secret': process.env.secret,
        'Content-Type': 'application/x-www-form-urlencoded',
        'grant_type': 'refresh_token',
        'refresh_token': guardian.rToken,
        'X-API-Key': process.env.key
    };
    let content = new URLSearchParams(Object.entries(data)).toString();
    axios_1.default.post('https://www.bungie.net/Platform/App/OAuth/token/', content).then(res => {
        var _a;
        guardian.rToken = res.data.refresh_token;
        guardian.token = res.data.access_token;
        guardian.cred.headers.Authorization = `Bearer ${guardian.token}`;
        let BNG_ID = guardian.BNG_ID;
        (_a = databaseService_1.database.guardians) === null || _a === void 0 ? void 0 : _a.findOneAndReplace({ BNG_ID }, guardian);
    }).catch(err => { console.log(err); });
}
exports.refresh = refresh;
