import express, { Express } from "express";
import { database } from "./databaseService";
import Guardian from "../_modules/Guardian";
import { refreshVendorInfo, vendorInfo } from "../_modules/dailyCheckup";
import Reminder from "../_modules/Reminder";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
import { getchar, getToken } from "../_modules/BungieAPI";
import { ObjectId } from "mongodb";
export const app = express.Router()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public')); 
app.use(cookieParser())
app.use(express.json())

//   --------------------------------------------------------- Api Endpoints ---------------------------------------------------------
  
//logowanie
app.post("/login", async function(req, res){
    let guardianinfo = await database.guardians?.findOne({BNG_ID: req.cookies.BNG_ID})
    if(!guardianinfo) return res.status(307).send({action:"redirect", text:"Nie ma takiego konta - Przekierowanie do strony z połączeniem konta bungie"}) 
    return res.status(200).send(guardianinfo)
})

app.post("/new/user", async function(req, res){
    let newGuardian = new Guardian()
    await getToken(newGuardian, req.body.authCode)
    setTimeout(() => {
        getchar(newGuardian)
    }, 1000)
    setTimeout(() => {
        console.log(newGuardian.toJSON())
        database.guardians?.insertOne(newGuardian.toJSON())
    return res.status(200).send({message: "Pomyślnie dodano konto"})
    }, 10000);
    
})

app.post("/new/reminder", async function(req, res){
    console.log(req.body.weaponID);
    console.log(req.body.weaponPerks);
    console.log(req.body.guardianID)
    let id = req.body.guardianID
    console.log(id);
    
    let guardian = new ObjectId(id)
    let perks:string = req.body.weaponPerks
    let perkTable = perks.split(",")
    let perkJSON = {1:perkTable[0], 2:perkTable[1], 3:perkTable[2], 4:perkTable[3]}
     
    let newReminder = new Reminder(req.body.weaponID, perkJSON, guardian)
    await database.reminders?.insertOne(newReminder.toJSON())
    return res.status(200).send({message: "Pomyślnie dodano nową subskrypcję"})
})

app.get("/reminders/list/:user", async function(req, res){
    let Guardian = (await database.guardians?.findOne({ID:req.params.user}))
    return res.status(200).send(Guardian?.reminders)
})

app.get("/get/vendorinfo", async function(req, res) {
    if(vendorInfo) return res.status(200).send(vendorInfo)
    return res.status(404).send({message: "No vendor info avaliable"})
})
