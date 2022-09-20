"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guardian = void 0;
const BungieAPI_1 = require("./BungieAPI");
const axios = require("axios");
class Guardian {
    constructor() {
        this.CHAR_ID = {
            1: 0,
            2: 0,
            3: 0
        };
        this.cred = {
            headers: {
                'X-API-Key': process.env.key,
                'Authorization': ""
            },
        };
        this.reminders = {};
        this.FB_ID = "";
        this.BNG_ID = 0;
        this.token = 0;
        this.rToken = 0;
        this.CHAR_ID = {
            1: 0,
            2: 0,
            3: 0
        };
        this.platform = 3;
        this.cred = {
            headers: {
                'X-API-Key': process.env.key,
                'Authorization': `Bearer ${this.token}`
            },
        },
            this.reminders = {};
    }
    async setToken(code) {
        (0, BungieAPI_1.getToken)(this, code).then(() => (0, BungieAPI_1.getchar)(this));
    }
    toJSON() {
        return {
            FB_ID: this.FB_ID,
            BNG_ID: this.BNG_ID,
            token: this.token,
            rToken: this.rToken,
            CHAR_ID: {
                1: this.CHAR_ID[1],
                2: this.CHAR_ID[2],
                3: this.CHAR_ID[3]
            },
            platform: this.platform,
            cred: {
                headers: {
                    'X-API-Key': process.env.key,
                    'Authorization': `Bearer ${this.token}`
                },
            },
            reminders: this.reminders
        };
    }
}
exports.Guardian = Guardian;
exports.default = Guardian;
