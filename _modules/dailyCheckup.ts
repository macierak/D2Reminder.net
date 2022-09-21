import { WithId } from "mongodb";
import { IGuardian } from "../_interfaces/IGuardian";
import { IReminder } from "../_interfaces/IReminder";
import { database } from "../_services/databaseService";
import { getItemDetails, getVendorInfo } from "./BungieAPI";
import { sendMess } from "./FacebookAPI";
import Guardian from "./Guardian";
import Reminder from "./Reminder";

export let vendorInfo:any
export async function refreshVendorInfo(defaultGuardian:IGuardian){
    vendorInfo = await getVendorInfo(defaultGuardian)
}

export async function searchRemindersFor(hashIdentifier:string, vendor:string){
    let regex = new RegExp(hashIdentifier);
    let remindersList = await database.reminders?.find({ "itemHash": regex }).toArray() as unknown as Array<Reminder>
    remindersList.forEach(async element => {
        //let guardian = await database.guardians?.findOne({"FB_ID": element.fbId}) as unknown as Guardian
        let message = `One of your items is currently sold in game by ${vendor}`
        sendMess(element.fbId, message)
    });
}
