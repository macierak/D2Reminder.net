type plat = 1|2|3

export interface IGuardian{

    FB_ID:string
    BNG_ID:number
    token:number
    rToken:number
    CHAR_ID: {
        1 : number,
        2 : number,
        3 : number
    }

    platform:plat
    cred : {
        headers : { 
            'X-API-Key' : string | undefined
            'Authorization': string
         },
    }
    reminders:{}

}