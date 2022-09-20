"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reminder = void 0;
class Reminder {
    constructor(itemHash, secondaryHash, guardian) {
        this.itemHash = itemHash;
        this.secondaryHash = secondaryHash;
        this.guardian = guardian;
    }
    toJSON() {
        return {
            itemHash: this.itemHash,
            secondaryHash: this.secondaryHash,
            guardian: this.guardian
        };
    }
}
exports.Reminder = Reminder;
exports.default = Reminder;
//dimwishlist:item=2534546147 Single item 
//dimwishlist:item=1907698332,1467527085,1087426260,1570042021,438098033 single item with perks
