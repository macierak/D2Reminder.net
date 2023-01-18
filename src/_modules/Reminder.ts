import { ObjectId } from "mongodb";
import { IReminder } from "../_interfaces/IReminder"

export class Reminder implements IReminder{
    itemHash: string;
    secondaryHash: { 1: string; 2: string; 3: string; 4: string; };
    fbId:string
    constructor(itemHash:string, secondaryHash:{ 1: string; 2: string; 3: string; 4: string }, fbId:string){
        this.itemHash = itemHash
        this.secondaryHash = secondaryHash
        this.fbId = fbId
    }

    toJSON(){
        return {
            itemHash: this.itemHash,
            secondaryHash : this.secondaryHash,
            fbId: this.fbId
        }
    }
    toString() {
        return `${this.itemHash} - ${this.secondaryHash} - ${this.fbId}`
    }

}

export default Reminder
//dimwishlist:item=2534546147& Single item 
//dimwishlist:item=1907698332&perks=1467527085,1087426260,1570042021,438098033 single item with perks