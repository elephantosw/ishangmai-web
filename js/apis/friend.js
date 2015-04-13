var friends = [];
var blacklist = [];
$(document).ready(function(){
	loadFriendList(function(){
		
	});
});

function loadFriendList(completion)
{
	var param = {
		'token': token,
		'uid': user.ID
	};
	ajaxRequestJSONP(API_FRIEND,"GET",param,function(responseData,err){
		if(err == null)
		{
			friends = responseData.friend_list;
			if(responseData.black_list != 'error')
			{
				blacklist = responseData.black_list;
				completion();
			}
			else
			{
				alert('获取黑名单错误');
				alert(responseData.black_list);
			}
		}
		else
		{
			alert(err);
		}
	});
}

function SetFriendCronyState(friid,cronyflag,completion)
{
	var param = {
		'uid':user.ID,
		'friid':friid,
		'cronyFlag':cronyflag,
		'token':token
	};
	ajaxRequestJSONP(API_FRIEND,"POST",param,function(responseData,err){
		if(err == null)
		{
			alert('crony state set success');
			completion(friid,cronyflag);
		}
		else
		{
			alert(err);
		}
	});
}

function DeleteFriend(friid,completion)
{
	var param = {
		'uid':user.ID,
		'friid':friid,
		'token':token
	};
	ajaxRequestJSONP(API_FRIEND,"POST",param,function(responseData,err){
		if(err == null)
		{
			alert('delete friend success');
			completion(friid);
		}
		else
		{
			alert(err);
		}
	});
}

function AddFriend(uid,friid,content,completion)
{
	var param = {
		'uid':user.ID,
		'friid':friid,
		'content':content,
		'token':token
	};
	ajaxRequestJSONP(API_FRIEND,"POST",param,function(responseData,err){
		if(err == null)
		{
			alert('send add friend request success');
			completion(friid);
		}
		else
		{
			alert(err);
		}
	});
}

function ComfirmFriend(friend_request_id,completion)
{
	var param = {
		'friend_request_id':friend_request_id,
		'comfirmed_by':user.ID, 
		'token': token
	};
	ajaxRequestJSONP(API_FRIEND,"POST",param,function(responseData,err){
		if(err == null)
		{
			alert('send add friend request success');
			completion(friend_request_id);
		}
		else
		{
			alert(err);
		}
	});
}
