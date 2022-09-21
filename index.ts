import express from "express";
import { schedule } from "node-cron";
import { vendorInfo, refreshVendorInfo, searchRemindersFor } from "./_modules/dailyCheckup";
import { IGuardian } from "./_interfaces/IGuardian";
import { database, connectToDB } from "./_services/databaseService";
import { app } from "./_services/router";
import { messengerRouter } from "./_services/messengerRouter"
import {  refresh } from "./_modules/BungieAPI";

const server = express()
const port = process.env.PORT || 3000

connectToDB().then(async () => {
    console.log("Connection to db successfull");
    //TODO: Use endpoints in fronend app
    server.use("/", app)
    server.use("/", messengerRouter)
    
    console.log("Initializing default variables...");
    let defaultGuardian:IGuardian = null as unknown as IGuardian
    let test = await database.guardians?.findOne({})     
    defaultGuardian = test as IGuardian

    await refresh(defaultGuardian)
    await refreshVendorInfo(defaultGuardian)

    //TODO: Download manifest to read precise data
    //await downloadManifest(defaultGuardian).then(() => { console.log("Manifest ready")  })
    let bansheeItems:any = Object.values(vendorInfo.banshee) 
    let adaItems:any = Object.values(vendorInfo.ada)
    
    console.log("Initialization successfull");
    

    /* 
    * --------------- Daily tasks ---------------
    */
        
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
    

    server.listen(port)
    console.log(`Server listening on port ${port}`);
    
    console.log("Ready");
    
})










    

 



