var request = require('request');
module.exports.deployBot=function(botID,deviceIDs,botVariableObj,io){
	console.log('deployBot');
	//io.emit('chat message', "about to deploy bot");
	var botDetails={
 /* "fileId": req.body.botID,
  "deviceIds": req.body.deviceIDs,*/
  "fileId":botID,
  "deviceIds":deviceIDs,
  "runWithRdp": false,
  "callbackInfo": {
  // "url": "http://aablr0195.aaspl-brd.com:8000/countries",
  "url": global.gConfig.thirdParty_URL+"/srchPolicyDetails",
 
   //"url":"https://httpbin.org/get",
  /*  "headers": {
      "X-Authorization":"mnb"
    }*/
  },
   /*"botVariables": {
    "Country": {
      "string": "India"
    }
		 }
    */
    "botVariables": botVariableObj
  
};

    console.log(botDetails);
    console.log( global.gConfig.controlRoom_URL+'/v2/automations/deploy');
   console.log(global.gConfig.thirdParty_URL+"/srchPolicyDetails");
   request(
   // 'http://aablr0195.aaspl-brd.com:81/v1/authentication',
   // { json: { Username:req.body.loginID, Password:req.body.password } },
    {headers: {
      //'Content-Length': contentLength,
      'Content-Type': 'application/json',
      'X-Authorization':global.thisSessionToken
    },
   // url: global.gConfig.controlRoom_URL+'/v1/schedule/automations/deploy',
    url: global.gConfig.controlRoom_URL+'/v2/automations/deploy',
    body: JSON.stringify(botDetails),
    method: 'POST'},
    function (error, response, body) {
    console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
        	
            //res.send({status:"Deployment success"});
            return ({status:"Deployment success"}); 
            //-----------------------------------------------
        
  //-----------------------------------------         
        }
        else if(response.statusCode == 404 )
        	 return ({status:"Device not found"});
        else if(response.statusCode == 400 )
        	 return ({status:"Device not active"})
        	//res.send({status:"Device not found"});
         else if(response.statusCode == 401 )
         	return({status:"Token Expired.Login again before deploying the bot"});
        	//res.send({status:"Token Expired.Login again before deploying the bot"});
        else  if (body.code=="UM1110" && response.statusCode != 200 )
        	return({status:"Deployment Failed"});
        	//res.send({status:"Deployment Failed"});
        else{
        	console.log("Error details")
        	console.log(error);
        }
    }
    )
}