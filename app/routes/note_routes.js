

module.exports = function(app,io) {
	var request = require('request');
	const session = require('express-session');
	app.use(session({secret: 'automationRPA#sample',saveUninitialized: true,resave: true}));
	var thisSession;//global variable


var Message = require('../models/Message');
app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})




app.post('/messages', (req, res) => {
  //var dat=JSON.stringify(req.body);
  console.log('req.body')
  console.log(req.body)
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    // io.sockets.emit("message", req.body);
    // io.emit('message', req.body);
    res.sendStatus(200);
  })
})

app.get('/dllExample', (req, res) => {

    console.log("inside DLL Example");
 
   res.send({"status":"Data returned NodeJS"});
  });


app.post('/countries', (req, res) => {
    
    console.log("inside countries");

   console.log(req.body.outputVariables);
   res.send({"countries":"United States"});
  });

app.post('/srchPolicyDetails', (req, res) => {
    
    console.log("srchPolicyDetails");

   console.log(req.body.outputVariables);
   //res.send({"countries":"United States"});
  });

  app.post('/notes', (req, res) => {
  

    console.log(req.body);
   res.send(req.body.title);
  });


//search OF BOT
  app.post('/searchBot', (req, res) => {
    var botDetails={ 
"filter": 
{ 
"operator":"eq", "value":req.body.botName, "field":"fileName" 
} 
}

   console.log(botDetails);
   request(
   
    {headers: {
    
      'Content-Type': 'application/json',
      //'X-Authorization':thisSession.token
       'X-Authorization':global.thisSessionToken
    },
  
    url: global.gConfig.controlRoom_URL+'/v2/repository/file/list',
    body: JSON.stringify(botDetails),
    method: 'POST'},
    function (error, response, body) {
    
        if (!error && response.statusCode == 200) {
          
           console.log(response.body);
            var toObj=JSON.parse(response.body)
           global.searchedBotID=toObj.list[0].id;
           console.log("searchedbotID"+global.searchedBotID);
            res.send({status:response.body});
      
        }
        else if(response.statusCode == 404 )
          res.send({status:"bot not found"});
         else if(response.statusCode == 401 )
          res.send({status:"Token Expired.Login again before deploying the bot"});
        else  if (body.code=="UM1110" && response.statusCode != 200 )
          res.send({status:"Deployment Failed"});
        else
          console.log(error);
    }
    )
  },function(){

   console.log("after deployment");

    
  });


//search OF device 82936 87232
  app.post('/searchDevice', (req, res) => {
    var botDetails={ 
"filter": 
{ 
"operator":"eq", "value":req.body.deviceHostName, "field":"hostName" 
} 
}

   console.log(botDetails);
   console.log( global.gConfig.controlRoom_URL+'/v2/devices/list');
   request(
   
    {headers: {
    
      'Content-Type': 'application/json',
      'X-Authorization':thisSession.token
    },
  
    url: global.gConfig.controlRoom_URL+'/v2/devices/list',
    body: JSON.stringify(botDetails),
    method: 'POST'},
    function (error, response, body) {
    
        if (!error && response.statusCode == 200) {
          
           console.log(response.body);
            var toObj=JSON.parse(response.body)

          
            var connectedDevice = toObj.list.filter(function(device, i) {
  return (device.status=="CONNECTED" && device.type=="BOT_RUNNER");
});
            if(connectedDevice.length > 0)
            global.searchedDeviceID= connectedDevice[0].id;
           console.log("searcheddevice"+global.searchedDeviceID);
            res.send({status:response.body});
      
        }
        else if(response.statusCode == 404 )
          res.send({status:"device not found"});
         else if(response.statusCode == 401 )
          res.send({status:"Token Expired.Login again before deploying the bot"});
        else  if (body.code=="UM1110" && response.statusCode != 200 )
          res.send({status:"Deployment Failed"});
        else
          console.log(error);
    }
    )
  },function(){

   console.log("after deployment");

    
  });

//DEPLOYMENT OF BOT
  app.post('/deployBot', (req, res) => {

  /*"fileId": "9",
  "deviceIds": [
    "2"]

req.body.deviceHostName*/

var status=require('../lib/controlRoomAPIs').deployBot( req.body.botID,req.body.deviceIDs,{});
console.log(status);

  });


//AUTHENTICATION
  app.post('/loginToControlRooom', (req, res) => {
   console.log(req.body);
   var userCred={ Username:req.body.loginID, Password:req.body.password};
   request(
   // 'http://aablr0195.aaspl-brd.com:81/v1/authentication',
   // { json: { Username:req.body.loginID, Password:req.body.password } },
    {headers: {
      //'Content-Length': contentLength,
      'Content-Type': 'application/json'
    },
    url: global.gConfig.controlRoom_URL+'/v1/authentication',
    //url: 'localhost:8000/v1/authentication',
    body: JSON.stringify(userCred),
    method: 'POST'},
    function (error, response, body) {
    	/*console.log("inside res")
    	console.log(response);
    	//body: Response body
    	console.log(body.code +"  "+response.statusCode )*/;
        if (!error && response.statusCode == 200) {
        	//console.log("inside loop")
            //console.log(body);
            res.send({status:"Login success", token:body.token});
            thisSession = req.session;
            console.log("results");
            var parsedBody=JSON.parse(body);
            console.log(parsedBody);
    		thisSession.token = parsedBody.token;
       global.thisSessionToken=parsedBody.token;
    		console.log(thisSession.token)
            
           /* if(body.token)
             res.send({status:"Login success"});
           else
           	res.send({status:"Login Failed"});*/
        }
        else  if (body.code=="UM1110" && response.statusCode != 200 )
        	res.send({status:"Login Failed"});
    }
);
  })


// Talk to Dialogflow Conversational AI
//Run the bot in attended mode and return results

  app.post('/getClaim', (req, res) => {
    

    console.log("Get Claim URL");
    console.log(req.body.userName);
    console.log(req.body.policyNumber);
    

   // console.log(thisSession.token);
res.send({
         "fulfillmentText": "response text",
         "fulfillmentMessages": [{"simpleResponses": {"simpleResponses": [   {
            "textToSpeech": "Love is that condition in which the happiness of another person is essential to your own",
            "displayText": "Love is that condition in which the happiness of another person is essential to your own"
         }]}}]
         }
       )

   
  });





};