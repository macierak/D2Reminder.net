const
	express = require('express'),
	bodyParser = require('body-parser'),
	axios = require("axios"),
    env = require("dotenv")

export const messengerRouter = express.Router()
messengerRouter.use(bodyParser.urlencoded({ extended: true }))
messengerRouter.use(bodyParser.json())
messengerRouter.use(express.static('public'))
messengerRouter.use(express.json())

messengerRouter.post('/webhook', (req, res) => {  
	let body = req.body;
	console.log(body);
	console.log(body.entry[0].messaging[0].message.text);
	/*
	if (body.object === 'page') {
		body.entry.forEach( (entry:any) => {
            //sample: dimwishlist:item=821154603&perks=3250034553,2420895100,3523296417			
			let webhook_event = entry.messaging[0];
			let sender_psid = webhook_event.sender.id;

			let data = {
				headers: {
					'content-Type': 'messengerRouterlication/json'
				},
				'recipient':{
					'id':sender_psid
				},
				'message': {
					'text': newRegisterMessage 
                   }   
		    }   
		    axios.post(`https://graph.facebook.com/v12.0/me/messages?access_token=${env.mess_token}`, data)
               .then(res => { })
               .catch(err =>{console.log(err.response)}) 
		});
		
		res.status(200).send('EVENT_RECEIVED');
		
	} else {
		res.sendStatus(404);
	}
	*/
	res.sendStatus(200)
})

messengerRouter.get('/webhook', (req, res) => {
		console.log("INCOMING GET REQUEST")
		let VERIFY_TOKEN = "43256233"
		let mode = req.query['hub.mode'];
		let token = req.query['hub.verify_token'];
		let challenge = req.query['hub.challenge'];
		if (mode && token) {
			if (mode === 'subscribe' && token === VERIFY_TOKEN) {
				console.log('WEBHOOK_VERIFIED');
				res.status(200).send(challenge);			
			} else {
				res.sendStatus(403);      
			}
		}
});

function validate(text:string){
    let regex1:RegExp = /dimwishlist:item=\d+&perks=(\d+(,\d+)+)/
    let regex2:RegExp = /dimwishlist:item=\d/
    if(regex1.test(text) && regex2.test(text)){
        return true
    }
    return false
}

let newRegisterMessage = (sender_psid:string) => {
return `Welcome to D2Reminder! `
}