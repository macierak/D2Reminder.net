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
export function run(){
    let bansheeItems:any = Object.values(vendorInfo.banshee)
    bansheeItems.forEach(element => {
        searchRemindersFor(element.itemHash)
    });

}

export async function searchRemindersFor(hashIdentifier:string){
    let regex = new RegExp(hashIdentifier);
    let remindersList = await database.reminders?.find({ "itemHash": regex }).toArray() as unknown as Array<Reminder>
    remindersList.forEach(async element => {
        let guardian = await database.guardians?.findOne({"_id": element.guardian}) as unknown as Guardian

        let itemdata = await getItemDetails(element.itemHash)

        
        let message = `Your item "${itemdata[1].displayProperties.name}" is currently being sold in game`
        sendMess(guardian.FB_ID, message)
    });
}
