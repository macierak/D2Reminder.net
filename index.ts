import express, { Router } from "express";
import { schedule } from "node-cron";
import { vendorInfo, refreshVendorInfo, searchRemindersFor } from "./_modules/dailyCheckup";
import { IGuardian } from "./_interfaces/IGuardian";
import { database, connectToDB } from "./_services/databaseService";
import { app } from "./_services/router";
import Guardian from "./_modules/Guardian";
import { getItemDetails, itemManifest, loadManifest, refresh } from "./_modules/BungieAPI";
import { Filter, ObjectId } from "mongodb";
const server = express()


connectToDB().then(async () => {
    server.use("/", app)
    console.log("Działa")
    
    let defaultGuardian:IGuardian = null as unknown as IGuardian
    let test = await database.guardians?.findOne({})     
    defaultGuardian = test as IGuardian
    await refresh(defaultGuardian)
    await refreshVendorInfo(defaultGuardian)
    await loadManifest(defaultGuardian).then(() => {
        console.log("Manifest ready");
    })
    let bansheeItems:any = Object.values(vendorInfo.banshee) 
    let adaItems:any = Object.values(vendorInfo.ada)

    //console.log(bansheeItems);
    //bansheeItems.forEach(async element => {
    //    console.log(await getItemDetails(element.itemHash)[1].displayProperties.name );
    //    
    //});
    
    ///*
    //    ---------------------------------------------------------- Daily tasks ----------------------------------------------------------
    //*/
    ////  O godzinie 20 - Odświeżenie informacji o sprzedawcach
    schedule('* 20 * * *', async () => {
        await refreshVendorInfo(defaultGuardian)
        bansheeItems = Object.values(vendorInfo.banshee)
        adaItems = Object.values(vendorInfo.ada)
        bansheeItems.forEach(async element => { 
            await searchRemindersFor(element.itemHash)
        });
        adaItems.forEach(async element => {
            await searchRemindersFor(element.itemHash)
        });
    } )
    server.listen(3321)
})








    

 



