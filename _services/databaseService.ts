import {MongoClient, Collection} from "mongodb";
import * as dotenv from "dotenv";
import { IGuardian } from "../_interfaces/IGuardian";
import { IReminder } from "../_interfaces/IReminder";

export const database : {
    guardians?: Collection<IGuardian> 
    reminders?: Collection<IReminder>
} = { }
export async function connectToDB(){
    dotenv.config()
    const client = new MongoClient(process.env.db_link as string);

    await client.connect()
    const db = client.db(process.env.db_name as string)
    database.guardians = db.collection<IGuardian>("Guardians")
    database.reminders = db.collection<IReminder>("Reminders")
}
