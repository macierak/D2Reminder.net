import { Guardian } from "./Guardian";
import axios from "axios";

export async function sendMess(fb_id:string, textMess:string){
    let data = {
        headers: {'content-Type': 'application/json'},
        'recipient':{'id':fb_id},
        'message': {'text': textMess }   
    }   
    axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${process.env.mess_token}`, data).then(res => { }).catch(err =>{console.log(err.response); console.log("Messaging Error")}) 
}
