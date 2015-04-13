function GetBlacklist(uid,completion)
{
	var param = {
		'uid':user.ID,
		'token':token
	};
	ajaxRequestJSONP(API_BLACKLIST,"GET",param,function(responseData,err){
		if(err == null)
		{
			blacklist = responseData;
			completion();
		}
		else
		{
			alert(err);
		}
	});
}

function setUserBlockStatus(blockid,blockStatus,completion)
{
	var param = {
		'owner':user.ID,
		'blockid':blockid,
		'setBlock':blockStatus,
		'token':token
	};
	ajaxRequestJSONP(API_BLACKLIST,"POST",param,function(responseData,err){
		if(err == null)
		{
			completion(blockid);	
		}
		else
		{
			alert(err);
		}
	});
}
