import axios from "axios";
import { IGuardian } from "../_interfaces/IGuardian";
import { database } from "../_services/databaseService";
import { ItemDetailsResponse } from "../_Protocol/itemResponse";
const BUNGIE_URL = "https://www.bungie.net/platform"

function generateBaseVendorUrlForGuardian(guardian:IGuardian) {
    return `${BUNGIE_URL}/Destiny2/${guardian.platform}/Profile/${guardian.BNG_ID}/Character/${guardian.CHAR_ID[1]}/Vendors`
}

async function ada(guardian: IGuardian) {
    let fullItemTable:any = [{
        itemHash : "" ,
        perks : {}
    }]
    fullItemTable.pop()

    await axios.get(`${generateBaseVendorUrlForGuardian(guardian)}/350061650/?components=305,302,402`, guardian.cred).then(res => {
        let keys:any = Object.keys(res.data.Response.sales.data)        
        keys.forEach((element, index) => {
                fullItemTable.push({
                    itemHash: res.data.Response.sales.data[element].itemHash,
                    perks : res.data.Response.itemComponents.perks.data[element]
                })
        });
        return fullItemTable
    }).catch(err => {  
        console.error(err)
     })
    return fullItemTable
}

async function banshee(guardian: IGuardian) {
    let fullItemTable:any = [{
        itemHash : "" ,
        perks : {}
    }]
    fullItemTable.pop()
    await axios.get(`${generateBaseVendorUrlForGuardian(guardian)}/672118013/?components=305,302,402`, guardian.cred).then(res => {
        let keys:any = Object.keys(res.data.Response.sales.data)
        keys.forEach((element, index) => {
            if(res.data.Response.itemComponents.perks.data[element]){
                fullItemTable.push({
                    itemHash: res.data.Response.sales.data[element].itemHash,
                    perks : res.data.Response.itemComponents.perks.data[element]
                })
            }         
        });
        return fullItemTable
    }).catch(err => { 
        console.log("Banshee Error") 
    })
    return fullItemTable
}

async function xur(guardian: IGuardian) {
    let fullItemTable:any = [{
        itemHash : "" ,
        perks : {}
    }]
    fullItemTable.pop()
    await axios.get(`${generateBaseVendorUrlForGuardian(guardian)}/2190858386/?components=305,302,402`, guardian.cred).then(res => {
        console.log(Object.keys(res.data.Response.sales.data));
        
        let keys:any = Object.keys(res.data.Response.sales.data)
        keys.forEach((element, index) => {
            fullItemTable.push({
                itemHash: res.data.Response.sales.data[element].itemHash,
                perks : res.data.Response.itemComponents.perks.data[element]
            })
                    
        });
        return fullItemTable
    }).catch(err => { 
        console.log("Xur Error") 
    })
    return fullItemTable
}


export async function getVendorInfo(guardian:IGuardian){
    let vendorData = {
        ada : await ada(guardian),
        banshee : await banshee(guardian),
        xur: await xur(guardian)
    }    
    return vendorData
}

export async function getItemDetails(hashIdentifier:string){
    let defaultGuardian:IGuardian = null as unknown as IGuardian
    let test = await database.guardians?.findOne({})     
    defaultGuardian = test as IGuardian  
    let itemResponse:ItemDetailsResponse = await (await axios.get(`${BUNGIE_URL}/Destiny2/Manifest/DestinyInventoryItemDefinition/${hashIdentifier}`, defaultGuardian.cred)).data  
    return itemResponse
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
            }).catch(err => { console.log(err) })
        }).catch(err => { console.log(err) })
    }).catch(err => { console.log(err) })
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
