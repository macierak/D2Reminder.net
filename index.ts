import express from "express";
import { schedule } from "node-cron";
import { vendorInfo, refreshVendorInfo, searchRemindersFor } from "./src/_modules/dailyCheckup";
import { IGuardian } from "./src/_interfaces/IGuardian";
import { database, connectToDB } from "./src/_services/databaseService";
import { refresh } from "./src/_modules/BungieAPI";
import cors from 'cors';
import { messengerRouter } from "./src/_services/messengerRouter";

const server = express()
const port = process.env.PORT || 3001


let defaultGuardian:IGuardian
let bansheeItems:any
let adaItems:any
let xurItems:any

async function main() {
    await connectToDB()

    console.log("Connection to db successfull");
    
    await initializeInMemoryVariables()
    await schedule('* 18 * * *', async () => checkReminders())
    
    server.listen(port)
    console.log(`Server is listening on port ${port}`);

    console.log("D2Reminder is ready");
    
}

async function initializeInMemoryVariables() {
    console.log("Initializing default variables...");

    server.use(cors({origin:"*"}))
    server.use("/", messengerRouter)

    let test = await database.guardians?.findOne({})     
    defaultGuardian = test as IGuardian

    await refresh(defaultGuardian)
    await refreshVendorInfo(defaultGuardian)

    bansheeItems = Object.values(vendorInfo.banshee) 
    adaItems = Object.values(vendorInfo.ada)
    
    console.log("Initialization successfull");
}

export async function checkReminders() {
    await refresh(defaultGuardian)
    await refreshVendorInfo(defaultGuardian)
    
    bansheeItems = Object.values(vendorInfo.banshee)
    adaItems = Object.values(vendorInfo.ada)
    xurItems = Object.values(vendorInfo.xur)
    
    bansheeItems.forEach(async element => { 
        await searchRemindersFor(element.itemHash, "Banshee-44")
    });
    adaItems.forEach(async element => {
        await searchRemindersFor(element.itemHash, "Ada-1")
    });
    xurItems.forEach(async element => {
        await searchRemindersFor(element.itemHash, "Xur")
    });
}

main()







    

 



