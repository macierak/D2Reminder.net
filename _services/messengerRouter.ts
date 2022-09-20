import { IGuardian } from "../_interfaces/IGuardian"
import { sendMess } from "../_modules/FacebookAPI"
import Guardian from "../_modules/Guardian"
import Reminder from "../_modules/Reminder"
import { database } from "./databaseService"

const
	express = require('express'),
	bodyParser = require('body-parser'),
	axios = require("axios"),
	env = require("dotenv")

export const messengerRouter = express.Router()
messengerRouter.use(bodyParser.urlencoded({ extended: true }))
messengerRouter.use(bodyParser.json())
messengerRouter.use(express.static('public'))
messengerRouter.use(express.json())

messengerRouter.post('/webhook', (req, res) => {
	let body = req.body;
	console.log(body);
	console.log(body.entry[0].messaging[0].message.text);
	if (body.object === 'page') {
		body.entry.forEach((entry: any) => {
			//sample: dimwishlist:item=821154603&perks=3250034553,2420895100,3523296417			
			let webhookEvent = entry.messaging[0];
			let senderPsid = webhookEvent.sender.id;
			let senderMessage:string = webhookEvent.message.text
			if (validate(senderMessage)) {

				let weaponID = senderMessage.split("&")[0].split("=")[1]
				let perks = senderMessage.split("&")[1].split("=")[1].split(",")
				let perksHashTable = {1: perks[0], 2: perks[1], 3: perks[2], 4: perks[3]}
				let reminder = new Reminder(weaponID, perksHashTable, senderPsid)
				database.reminders?.insertOne(reminder)
				sendMessage(senderPsid, reminder.toString())
			} else if(senderMessage === `help`) {
				sendMessage(senderPsid, sendHelpResponse())
			} else {
				sendMessage(senderPsid, "Message was not validated properly. send 'help' for proper message format")
			}


		})
		res.status(200).send('EVENT_RECEIVED');
	} else {
		res.sendStatus(404);
	}

	res.sendStatus(200)
})

messengerRouter.get('/webhook', (req, res) => {
	console.log("INCOMING GET REQUEST")
	let VERIFY_TOKEN = "43256233"
	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];
	if (mode && token) {
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);
		} else {
			res.sendStatus(403);
		}
	}
});

function sendMessage(sender_psid: string, message: string) {
	let data = {
		headers: {
			'content-Type': 'messengerRouterlication/json'
		},
		'recipient': {
			'id': sender_psid
		},
		'message': {
			'text': message
		}
	}
	axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${process.env.mess_token}`, data)
		.then(res => { })
		.catch(err => { console.log(err.response) })
}

function validate(text: string) {
	let regex1: RegExp = /dimwishlist:item=\d+&perks=(\d+(,\d+)+)/
	let regex2: RegExp = /dimwishlist:item=\d+&/
	return regex1.test(text) || regex2.test(text)
}

function sendHelpResponse() {
	return "Welcome to D2Reminder! \nSend a message like 'dimwishlist:item=821154603&perks=3250034553,2420895100,3523296417' remember to use '&' after item ID to be notified when a vendor sells it. \nSend that message again to cancel notification."
}