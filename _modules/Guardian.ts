import Reminder from "./Reminder";
import {getToken, getchar} from "./BungieAPI"
import {IGuardian} from "../_interfaces/IGuardian"
const axios = require("axios");
type plat = 1|2|3
export class Guardian implements IGuardian{

    FB_ID:string
    BNG_ID:number
    token:number
    rToken:number
    CHAR_ID= {
        1 : 0,
        2 : 0,
        3 : 0
    }

    platform:plat
    cred = {
        headers : { 
            'X-API-Key' : process.env.key ,
            'Authorization': ""
         },
    }
    reminders = {}

    constructor(){  
        
        this.FB_ID = ""
        this.BNG_ID = 0
        this.token = 0
        this.rToken = 0
        this.CHAR_ID = {
            1 : 0,
            2 : 0,
            3 : 0
        }
        this.platform = 3
        this.cred = {
            headers : {
                'X-API-Key' : process.env.key, 
                'Authorization': `Bearer ${this.token}`
            },
        },
        this.reminders = {}
    }  
    

    async setToken(code:string){
        getToken(this, code).then(()=> getchar(this))
    }
    toJSON(){
        return {
 
            FB_ID: this.FB_ID,
            BNG_ID: this.BNG_ID, 
            token: this.token,
            rToken:this.rToken,
            CHAR_ID: {
                1 : this.CHAR_ID[1],
                2 : this.CHAR_ID[2],
                3 : this.CHAR_ID[3]
            },
            platform: this.platform, 
            cred: {
                headers : {
                    'X-API-Key' : process.env.key,
                    'Authorization': `Bearer ${this.token}`
                },
            },
            reminders: this.reminders
        }
    }
}

export default Guardian
