"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_cron_1 = require("node-cron");
const dailyCheckup_1 = require("./_modules/dailyCheckup");
const databaseService_1 = require("./_services/databaseService");
const router_1 = require("./_services/router");
const messengerRouter_1 = require("./_services/messengerRouter");
const BungieAPI_1 = require("./_modules/BungieAPI");
const server = (0, express_1.default)();
(0, databaseService_1.connectToDB)().then(async () => {
    var _a;
    server.use("/", router_1.app);
    server.use("/", messengerRouter_1.messengerRouter);
    let defaultGuardian = null;
    let test = await ((_a = databaseService_1.database.guardians) === null || _a === void 0 ? void 0 : _a.findOne({}));
    defaultGuardian = test;
    await (0, BungieAPI_1.refresh)(defaultGuardian);
    await (0, dailyCheckup_1.refreshVendorInfo)(defaultGuardian);
    await (0, BungieAPI_1.loadManifest)(defaultGuardian).then(() => {
        console.log("Manifest ready");
    });
    let bansheeItems = Object.values(dailyCheckup_1.vendorInfo.banshee);
    let adaItems = Object.values(dailyCheckup_1.vendorInfo.ada);
    /***
     *
     * ---------------------------------------------------------- Daily tasks ----------------------------------------------------------
     */
    //  O godzinie 20 - Odświeżenie informacji o sprzedawcach
    (0, node_cron_1.schedule)('* 20 * * *', async () => {
        await (0, dailyCheckup_1.refreshVendorInfo)(defaultGuardian);
        bansheeItems = Object.values(dailyCheckup_1.vendorInfo.banshee);
        adaItems = Object.values(dailyCheckup_1.vendorInfo.ada);
        bansheeItems.forEach(async (element) => {
            await (0, dailyCheckup_1.searchRemindersFor)(element.itemHash);
        });
        adaItems.forEach(async (element) => {
            await (0, dailyCheckup_1.searchRemindersFor)(element.itemHash);
        });
    });
    server.listen(3321);
});
