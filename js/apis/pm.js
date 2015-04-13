function GetPM()
{
	var param = {
		'uid':user.ID,
		'token':token
	};
	ajaxRequestJSONP(API_PRIVATE_MSG,"GET",param,function(responseData,err){
		if(err == null)
		{
			
		}
		else
		{
			
		}
	});
}

function SendPM(sendToid,context,completion)
{
	var message = {
		'from' : user.ID,
		'to' : sendToid,
		'context' : context,
		'type' : 0,
		'isReceived' : false
	};
	var param = {
		'message' : message,
		'token' : token
	};
	ajaxRequestJSONP(API_PRIVATE_MSG,"POST",param,function(responseData,err){
		if(err == null)
		{
			completion(sendToid);
		}
		else
		{
			alert(err);
		}
	});
}
