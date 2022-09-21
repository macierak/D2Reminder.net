import express, { Router } from "express";
import { schedule } from "node-cron";
import { vendorInfo, refreshVendorInfo, searchRemindersFor } from "./_modules/dailyCheckup";
import { IGuardian } from "./_interfaces/IGuardian";
import { database, connectToDB } from "./_services/databaseService";
import { app } from "./_services/router";
import { messengerRouter }from "./_services/messengerRouter"
import Guardian from "./_modules/Guardian";
import { downloadManifest, getItemDetails, itemManifest, refresh } from "./_modules/BungieAPI";
import { Filter, ObjectId } from "mongodb";
const server = express()
const port = process.env.PORT || 3000
connectToDB().then(async () => {
    server.use("/", app)
    server.use("/", messengerRouter)
    
    let defaultGuardian:IGuardian = null as unknown as IGuardian
    let test = await database.guardians?.findOne({})     
    defaultGuardian = test as IGuardian
    await refresh(defaultGuardian)
    await refreshVendorInfo(defaultGuardian)
    //await downloadManifest(defaultGuardian).then(() => { console.log("Manifest ready")  })
    let bansheeItems:any = Object.values(vendorInfo.banshee) 
    let adaItems:any = Object.values(vendorInfo.ada)
    
    /***
     * 
     * ---------------------------------------------------------- Daily tasks ----------------------------------------------------------
     */
        
    //  O godzinie 18:00+00:00 - Odświeżenie informacji o sprzedawcach
    schedule('* 18 * * *', async () => {
        console.log("Zaczynam skan");
        
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
    server.listen(port)
})










    

 



