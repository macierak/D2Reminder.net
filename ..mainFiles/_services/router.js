"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const databaseService_1 = require("./databaseService");
const Guardian_1 = __importDefault(require("../_modules/Guardian"));
const dailyCheckup_1 = require("../_modules/dailyCheckup");
const Reminder_1 = __importDefault(require("../_modules/Reminder"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const BungieAPI_1 = require("../_modules/BungieAPI");
const mongodb_1 = require("mongodb");
exports.app = express_1.default.Router();
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
exports.app.use(body_parser_1.default.json());
exports.app.use(express_1.default.static('public'));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
//   --------------------------------------------------------- Api Endpoints ---------------------------------------------------------
//logowanie
exports.app.post("/login", async function (req, res) {
    var _a;
    let guardianinfo = await ((_a = databaseService_1.database.guardians) === null || _a === void 0 ? void 0 : _a.findOne({ BNG_ID: req.cookies.BNG_ID }));
    if (!guardianinfo)
        return res.status(307).send({ action: "redirect", text: "Nie ma takiego konta - Przekierowanie do strony z połączeniem konta bungie" });
    return res.status(200).send(guardianinfo);
});
exports.app.post("/new/user", async function (req, res) {
    let newGuardian;
    await (0, BungieAPI_1.getToken)(new Guardian_1.default(), req.body.authCode).then(guard => {
        newGuardian = guard;
        console.log(guard);
    });
    //console.log(newGuardian.toJSON());
    //await database.guardians?.insertOne(newGuardian.toJSON())
    return res.status(200).send({ message: "Pomyślnie dodano konto" });
});
exports.app.post("/new/reminder", async function (req, res) {
    var _a;
    let id = req.body.guardianID;
    let guardian = new mongodb_1.ObjectId(id);
    let perks = req.body.weaponPerks;
    let perkTable = perks.split(",");
    let perkJSON = { 1: perkTable[0], 2: perkTable[1], 3: perkTable[2], 4: perkTable[3] };
    let newReminder = new Reminder_1.default(req.body.weaponID, perkJSON, guardian);
    await ((_a = databaseService_1.database.reminders) === null || _a === void 0 ? void 0 : _a.insertOne(newReminder.toJSON()));
    return res.status(200).send({ message: "Pomyślnie dodano nową subskrypcję" });
});
exports.app.get("/reminders/list/:user", async function (req, res) {
    var _a;
    let Guardian = (await ((_a = databaseService_1.database.guardians) === null || _a === void 0 ? void 0 : _a.findOne({ ID: req.params.user })));
    return res.status(200).send(Guardian === null || Guardian === void 0 ? void 0 : Guardian.reminders);
});
exports.app.get("/get/vendorinfo", async function (req, res) {
    if (dailyCheckup_1.vendorInfo)
        return res.status(200).send(dailyCheckup_1.vendorInfo);
    return res.status(404).send({ message: "No vendor info avaliable" });
});
exports.app.put("/manifest/update", async (req, res) => {
    var _a;
    if (req.body.superdupersercetkey != process.env.superdupersecretkey)
        return res.status(401);
    let defaultGuardian = null;
    let test = await ((_a = databaseService_1.database.guardians) === null || _a === void 0 ? void 0 : _a.findOne({}));
    defaultGuardian = test;
    (0, BungieAPI_1.downloadManifest)(defaultGuardian);
});
