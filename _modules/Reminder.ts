import { ObjectId } from "mongodb";
import { IReminder } from "../_interfaces/IReminder"

export class Reminder implements IReminder{
    itemHash: string;
    secondaryHash: { 1: string; 2: string; 3: string; 4: string; };
    guardian: ObjectId
    constructor(itemHash:string, secondaryHash:{ 1: string; 2: string; 3: string; 4: string }, guardian:ObjectId){
        this.itemHash = itemHash
        this.secondaryHash = secondaryHash
        this.guardian = guardian
    }
    
    toJSON(){
        return {
            itemHash: this.itemHash,
            secondaryHash : this.secondaryHash,
            guardian: this.guardian
        }
    }
}

export default Reminder
//dimwishlist:item=2534546147 Single item 
//dimwishlist:item=1907698332,1467527085,1087426260,1570042021,438098033 single item with perks