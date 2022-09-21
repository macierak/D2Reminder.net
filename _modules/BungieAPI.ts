import axios from "axios";
import { WithId } from "mongodb";
import fs from 'fs';
import path from 'path';
import { IGuardian } from "../_interfaces/IGuardian";
import { database } from "../_services/databaseService";
import Guardian from "./Guardian"
let manifestLink:String = ""
export let itemManifest: any

async function ada(guardian: IGuardian) {
    let fullItemTable:any = [{
        itemHash : "" ,
        perks : {}
    }]
    fullItemTable.pop()
    await axios.get('https://www.bungie.net/platform/Destiny2/' + guardian.platform + '/Profile/' + guardian.BNG_ID + '/Character/' + guardian.CHAR_ID[1] + '/Vendors/350061650/?components=305,302,402', guardian.cred).then(res => {
        let keys:any = Object.keys(res.data.Response.sales.data)        
        keys.forEach(function put(element, index) {
                fullItemTable.push({
                    itemHash: res.data.Response.sales.data[element].itemHash,
                    perks : res.data.Response.itemComponents.perks.data[element]
                })
                      
        });
        console.log(fullItemTable)
        return fullItemTable
    }).catch(err => {  
        console.log("Ada Error")
        //console.error(err)
     })
    return fullItemTable
}

async function banshee(guardian: IGuardian) {
    let fullItemTable:any = [{
        itemHash : "" ,
        perks : {}
    }]
    fullItemTable.pop()
    await axios.get('https://www.bungie.net/platform/Destiny2/' + guardian.platform + '/Profile/' + guardian.BNG_ID + '/Character/' + guardian.CHAR_ID[1] + '/Vendors/672118013/?components=305,302,402', guardian.cred).then(res => {
        let keys:any = Object.keys(res.data.Response.sales.data)
        keys.forEach(function put(element, index) {
            if(res.data.Response.itemComponents.perks.data[element]){
                fullItemTable.push({
                    itemHash: res.data.Response.sales.data[element].itemHash,
                    perks : res.data.Response.itemComponents.perks.data[element]
                })
            }         
        });
        return fullItemTable
    }).catch(err => { 
        console.log(err)
        console.log("Banshee Error") 
    })
    return fullItemTable
}

export async function getVendorInfo(guardian:IGuardian){
    let vendorData = {
        ada : await ada(guardian),
        banshee : await banshee(guardian)
    }
    //console.log(vendorData.ada);
    
    return vendorData
    
}
export async function loadManifest(guardian:IGuardian){ 
    let raw = fs.readFileSync(path.resolve('/app/public/manifest.json')) as unknown as string
    itemManifest = JSON.parse(raw)
    
}
export async function downloadManifest(guardian:IGuardian) {
    await axios.get(`https://www.bungie.net/platform/Destiny2/Manifest/`, guardian.cred).then(res => {
    manifestLink = res.data.Response.jsonWorldContentPaths.en
    })
    await axios.get(`https://www.bungie.net${manifestLink}`).then(res => {
        itemManifest = Object.entries(res.data.DestinyInventoryItemDefinition)
        fs.writeFileSync('manifest.json', JSON.stringify(itemManifest))
})
}

export function getItemDetails(hashIdentifier:string){
    return itemManifest.find(item => item[0] == hashIdentifier)
     
}

export async function getToken(guardian: IGuardian, authorization_code: string):Promise<IGuardian> {
    let data = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW',
        'client_id': process.env.app_ID as string,
        'grant_type': 'authorization_code',
        'code': `${authorization_code}`,
        'client_secret': process.env.secret as string
    }
    let content = new URLSearchParams(Object.entries(data)).toString();
    axios.post('https://www.bungie.net/platform/app/oauth/token/', content).then(async res => {
        guardian.token = res.data.access_token
        guardian.rToken = res.data.refresh_token        
        guardian.cred = {
            headers: {
                'X-API-Key': process.env.key,
                'Authorization': `Bearer ${guardian.token}`
            },
        }
        await getchar(guardian)
        return guardian
    }).catch(err => { 
        console.error(err) 
        return guardian
    })
    return guardian

}

export async function getchar(guardian: IGuardian) {
    console.log("Commencing")
    console.log(guardian.rToken)
    let data = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'client_id': process.env.app_ID as string,
        'client_secret': process.env.secret as string,
        'Authorization': 'Bearer mF_9.B5f-4.1JqM',
        'grant_type': 'refresh_token',
        'refresh_token': guardian.rToken as unknown as string,
        'X-API-Key': process.env.key as string
    }
    let content = new URLSearchParams(Object.entries(data)).toString();
    axios.post('https://www.bungie.net/Platform/App/OAuth/token/', content).then(res => {
        let memberID = res.data.membership_id
        axios.get(`https://www.bungie.net/Platform/User/GetMembershipsById/${memberID}/${guardian.platform}/`, guardian.cred).then(res => {
            guardian.BNG_ID = res.data.Response.destinyMemberships[0].membershipId
            axios.get(`https://www.bungie.net/Platform/Destiny2/${guardian.platform}/Profile/${guardian.BNG_ID}/?components=100`, guardian.cred).then(res => {
                for (let index = 0; index < 3; index++) {
                    const element = res.data.Response.profile.data.characterIds[index];
                    if (element) {
                        guardian.CHAR_ID[index] = element
                        console.log(element)
                    }
                }
            }).catch(err => { console.log(err); console.log("1.1") })
        }).catch(err => { console.log(err); console.log("1.2") })
    }).catch(err => { console.log("-"); console.log("1.3") })
}

export async function refresh(guardian: IGuardian) {
    let data = {
        'Authorization': 'Bearer mF_9.B5f-4.1JqM',
        'client_id': process.env.app_ID as string,
        'client_secret': process.env.secret as string,
        'Content-Type': 'application/x-www-form-urlencoded',
        'grant_type': 'refresh_token',
        'refresh_token': guardian.rToken as unknown as string,
        'X-API-Key': process.env.key as string
    }
    let content = new URLSearchParams(Object.entries(data)).toString();

    axios.post('https://www.bungie.net/Platform/App/OAuth/token/', content).then(res => {
        guardian.rToken = res.data.refresh_token
        guardian.token = res.data.access_token
        guardian.cred.headers.Authorization = `Bearer ${guardian.token}`
        let BNG_ID = guardian.BNG_ID
        database.guardians?.findOneAndReplace({BNG_ID}, guardian)

    }).catch(err => { console.log(err) })

}