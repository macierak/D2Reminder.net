import { checkReminders } from "../.."
import { IGuardian } from "../_interfaces/IGuardian"
import { IReminder } from "../_interfaces/IReminder"
import { getItemDetails } from "../_modules/BungieAPI"
import { sendMess } from "../_modules/FacebookAPI"
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

messengerRouter.post('/webhook', async (req, res) => {
	let body = req.body;
	console.log(body.entry[0].messaging[0].message.text);
	if (body.object === 'page') {
		body.entry.forEach(async (entry: any) => {
			//sample: dimwishlist:item=821154603&perks=3250034553,2420895100,3523296417			
			let webhookEvent = entry.messaging[0];
			let senderPsid = webhookEvent.sender.id;
			let senderMessage:string = webhookEvent.message.text

			if (validate(senderMessage) === reminderType.MULTI) {
				let itemID = senderMessage.split("&")[0].split("=")[1]
				let perks = senderMessage.split("&")[1].split("=")[1].split(",")
				let perksHashTable = {1: perks[0], 2: perks[1], 3: perks[2], 4: perks[3]}
				let reminder = new Reminder(itemID, perksHashTable, senderPsid)

				database.reminders?.insertOne(reminder)
				let itemName = (await getItemDetails(itemID)).Response.displayProperties.name
				await sendMess(senderPsid, `Item ${itemName} was added to reminders`)

			} else if(validate(senderMessage) === reminderType.SINGLE) {
				let itemID = senderMessage.split("&")[0].split("=")[1]
				let reminder = new Reminder(itemID, {1: "", 2: "", 3: "", 4: ""}, senderPsid)
				database.reminders?.insertOne(reminder)
				let itemName = (await getItemDetails(itemID)).Response.displayProperties.name
				await sendMess(senderPsid, `Item ${itemName} was added to reminders`)
				
			} else if(validate(senderMessage) === reminderType.MONO) {
				let itemID = senderMessage
				let reminder = new Reminder(itemID, {1: "", 2: "", 3: "", 4: ""}, senderPsid)
				database.reminders?.insertOne(reminder)
				let itemName = (await getItemDetails(itemID)).Response.displayProperties.name
				await sendMess(senderPsid, `Item ${itemName} was added to reminders`)

			} else if(senderMessage.toLowerCase() === `help`) {
				sendHelpResponse(senderPsid)

			} else if(senderMessage.toLowerCase() === `reminders`) {
				await sendMess(senderPsid, "List of active reminders:")
				const reminders = await database.reminders?.find({ fbId: senderPsid }).toArray();
				reminders?.forEach(async reminder => {
					await sendMess(senderPsid,  await reminderToString(reminder))
				})	
						
			} else if(senderMessage.toLowerCase() === "check") {
				checkReminders()
			} else {
				await sendMess(senderPsid, "Message was not validated properly. send 'help' for proper message format")
			}

		})
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

function validate(text: string) {
	let regex1: RegExp = /dimwishlist:item=\d+&perks=(\d+(,\d+)+)/
	let regex2: RegExp = /dimwishlist:item=\d+&/
	let regex3: RegExp = /dimwishlist:item=\d+/
	let regex4: RegExp = /^[0-9]+$/
	if(regex1.test(text)) return reminderType.MULTI
	if(regex2.test(text)) return reminderType.SINGLE
	if(regex3.test(text)) return reminderType.SINGLE
	if(regex4.test(text)) return reminderType.MONO
	return reminderType.NONE
}

async function sendHelpResponse(id:string) {
	await sendMess(id, "Welcome to D2Reminder!")
	await sendMess(id, "Send message to be notified about item availability by vendors like Banshee-44")
	await sendMess(id, "http://d2gunsmith.com can generate dimwishlist queries, example:")
	await sendMess(id, "dimwishlist:item=821154603&perks=3250034553,2420895100,3523296417")
	await sendMess(id, "or dimwishlist:item=821154603")
}

enum reminderType {
	SINGLE,
	MULTI,
	MONO,
	NONE
}

async function reminderToString(reminder:IReminder) {
	console.log(reminder)
	let returnVal = await getItemDetails(reminder.itemHash)
	return returnVal.Response.displayProperties.name
}