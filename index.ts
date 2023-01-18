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

server.use(cors({origin:"*"}))
server.use("/", messengerRouter)
let defaultGuardian:IGuardian
let bansheeItems:any
let adaItems:any

async function main() {
    await connectToDB()
    
    console.log("Connection to db successfull");
    
    await initializeInMemoryVariables()
    await initializeScheduler()
    
    server.listen(port)
    console.log(`Server is listening on port ${port}`);

    console.log("D2Reminder is ready");
    
}

async function initializeInMemoryVariables() {
    console.log("Initializing default variables...");

    let test = await database.guardians?.findOne({})     
    defaultGuardian = test as IGuardian

    await refresh(defaultGuardian)
    await refreshVendorInfo(defaultGuardian)

    bansheeItems = Object.values(vendorInfo.banshee) 
    adaItems = Object.values(vendorInfo.ada)
    
    console.log("Initialization successfull");
}


async function initializeScheduler() {
    //  O godzinie 18:00+00:00 - Odświeżenie informacji o sprzedawcach
    schedule('* 18 * * *', async () => {
        await refresh(defaultGuardian)
        await refreshVendorInfo(defaultGuardian)
        bansheeItems = Object.values(vendorInfo.banshee)
        adaItems = Object.values(vendorInfo.ada)
        bansheeItems.forEach(async element => { 
            await searchRemindersFor(element.itemHash, "Banshee-44")
        });
        adaItems.forEach(async element => {
            await searchRemindersFor(element.itemHash, "Ada-1")
        });
    } )

    console.log("Cron set up properly");
}


main()







    

 



