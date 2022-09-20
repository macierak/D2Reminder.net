"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRemindersFor = exports.run = exports.refreshVendorInfo = exports.vendorInfo = void 0;
const databaseService_1 = require("../_services/databaseService");
const BungieAPI_1 = require("./BungieAPI");
const FacebookAPI_1 = require("./FacebookAPI");
async function refreshVendorInfo(defaultGuardian) {
    exports.vendorInfo = await (0, BungieAPI_1.getVendorInfo)(defaultGuardian);
}
exports.refreshVendorInfo = refreshVendorInfo;
function run() {
    let bansheeItems = Object.values(exports.vendorInfo.banshee);
    bansheeItems.forEach(element => {
        searchRemindersFor(element.itemHash);
    });
}
exports.run = run;
async function searchRemindersFor(hashIdentifier) {
    var _a;
    let regex = new RegExp(hashIdentifier);
    let remindersList = await ((_a = databaseService_1.database.reminders) === null || _a === void 0 ? void 0 : _a.find({ "itemHash": regex }).toArray());
    remindersList.forEach(async (element) => {
        var _a;
        let guardian = await ((_a = databaseService_1.database.guardians) === null || _a === void 0 ? void 0 : _a.findOne({ "_id": element.guardian }));
        let itemdata = await (0, BungieAPI_1.getItemDetails)(element.itemHash);
        let message = `Your item "${itemdata[1].displayProperties.name}" is currently being sold in game`;
        (0, FacebookAPI_1.sendMess)(guardian.FB_ID, message);
    });
}
exports.searchRemindersFor = searchRemindersFor;
