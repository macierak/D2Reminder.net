import { ObjectId } from "mongodb"

export interface IReminder{
    itemHash:string
    secondaryHash:{
        1:string
        2:string
        3:string
        4:string
    }
    fbId:string

}