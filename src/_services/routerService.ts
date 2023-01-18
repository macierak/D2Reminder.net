import Reminder from "../_modules/Reminder"
import { database } from "./databaseService"


export function addReminder(req) {
//sample: dimwishlist:item=821154603&perks=3250034553,2420895100,3523296417			
    if (validate(req.message) === reminderType.MULTI) {
        let weaponID = req.message.split("&")[0].split("=")[1]
        let perks = req.message.split("&")[1].split("=")[1].split(",")
        let perksHashTable = {1: perks[0], 2: perks[1], 3: perks[2], 4: perks[3]}
        let reminder = new Reminder(weaponID, perksHashTable, req.guardian)
        database.reminders?.insertOne(reminder)

    } else if(validate(req.message) === reminderType.SINGLE) {
        let itemID = req.message.split("&")[0].split("=")[1]
        let reminder = new Reminder(itemID, {1: "", 2: "", 3: "", 4: ""}, req.guardian)
        database.reminders?.insertOne(reminder)

    }
}

function validate(text: string) {
	let regex1: RegExp = /dimwishlist:item=\d+&perks=(\d+(,\d+)+)/
	let regex2: RegExp = /dimwishlist:item=\d+&/
	if(regex1.test(text)) return reminderType.MULTI
	if(regex2.test(text)) return reminderType.SINGLE
	return reminderType.NONE
}

enum reminderType {
	SINGLE,
	MULTI,
	NONE
}

type addReminderRequest = {
    guardian:any,
    message: string,

}