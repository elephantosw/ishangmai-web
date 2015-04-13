
function likebiz(bid,liketag,completion)
{
	var param = {
		'uid': 1,
		'bid': bid,
		'liketag': liketag,
		'token': token
	};
	ajaxRequestJSONP(API_BUSINESS_LIKE,"GET",param,function(responseData,err){
		if(err == null)
		{
			alert('like success');
			completion(bid,liketag);
		}
		else
		{
			myApp.alert('网络不给力');
		}
	});
}
