"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMess = void 0;
const axios_1 = __importDefault(require("axios"));
async function sendMess(fb_id, textMess) {
    let data = {
        headers: { 'content-Type': 'application/json' },
        'recipient': { 'id': fb_id },
        'message': { 'text': textMess }
    };
    axios_1.default.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${process.env.mess_token}`, data).then(res => { }).catch(err => { console.log(err.response); console.log("Messaging Error"); });
}
exports.sendMess = sendMess;
