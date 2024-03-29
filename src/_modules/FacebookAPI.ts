import axios from "axios";

export async function sendMess(fb_id:string, textMess:string){
    let data = {
        headers: {'content-Type': 'application/json'},
        'recipient':{'id':fb_id},
        'message': {'text': textMess },
        'messaging_type': 'MESSAGE_TAG',
        'tag': "CONFIRMED_EVENT_UPDATE"  
    }   
    await axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${process.env.mess_token}`, data)
    .then(res => { })
    .catch(err =>{
        //console.error(err.response) 
        console.log("Messaging Error")
    }) 
}
