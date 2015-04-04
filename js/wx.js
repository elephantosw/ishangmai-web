var API_OAUTH2 = "../api/oauth2";
var user,wed_id,layer;
$(document).ready(function() {
	var now = new Date();
	var _nonce = now.format("yyyyMMddHHmmss");
	var _timestamp = Math.round(new Date().getTime() / 1000);
	var code = getUrlParameter("code");
	var state = getUrlParameter("state");
	 wed_id = state.split('_')[0];
	 layer = state.split('_')[1];
	if(code != null)
	{
		ajaxRequest(API_OAUTH2,"GET",{'code':code,'state':state},function(responseData,err){
			if(err == null)
			{
				user = responseData;
				var ticket = user.ticket;
				var url = window.location.href;
				var sig = computeSignature(ticket,_nonce,_timestamp,url);
				init_wx(_timestamp,_nonce,sig);
			}
			else
			{
				alert(err);
			}
		});
	}
	else
	{
		alert('no code here');
		return;
	}
});

function computeSignature(ticket, nonce, timestamp, url) {
	var str = "jsapi_ticket={0}&noncestr={1}&timestamp={2}&url={3}".format(ticket, nonce, timestamp, url);
	return $.sha1(str)
}

function getNextShareUrl()
{
	var baseUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc5ab249aafdc8ae5&redirect_uri=http%3a%2f%2fwww.opush.mobi%2fwedding%2fwedding_ads.html&response_type=code&scope=snsapi_userinfo&state={0}_{1}#wechat_redirect".format(wed_id,parseInt(layer)+1);
	alert('will redirect to ' + baseUrl)
	return baseUrl;
}

function init_wx(timestamp,nonce,sig) {
	getNextShareUrl();
	wx.config({
		debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: 'wxc5ab249aafdc8ae5', // 必填，公众号的唯一标识
		timestamp: timestamp, // 必填，生成签名的时间戳
		nonceStr: nonce, // 必填，生成签名的随机串
		signature: sig, // 必填，签名，
		jsApiList: [
			'checkJsApi',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'hideMenuItems',
			'showMenuItems',
			'hideAllNonBaseMenuItem',
			'showAllNonBaseMenuItem',
			'translateVoice',
			'startRecord',
			'stopRecord',
			'onRecordEnd',
			'playVoice',
			'pauseVoice',
			'stopVoice',
			'uploadVoice',
			'downloadVoice',
			'chooseImage',
			'previewImage',
			'uploadImage',
			'downloadImage',
			'getNetworkType',
			'openLocation',
			'getLocation',
			'hideOptionMenu',
			'showOptionMenu',
			'closeWindow',
			'scanQRCode',
			'chooseWXPay',
			'openProductSpecificView',
			'addCard',
			'chooseCard',
			'openCard'
		]
	});

	wx.error(function(res) {
		alert(res.errMsg);
	});
	wx.ready(function() {
		wx.onMenuShareAppMessage({
			title: document.title,
			desc: "由 {0} 分享的非常呆萌的内容".format(user.wechat_name),
			link: getNextShareUrl(),
			imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
			trigger: function(res) {
				alert('用户点击发送给朋友');
			},
			success: function(res) {
				alert('已分享');
			},
			cancel: function(res) {
				alert('已取消');
			},
			fail: function(res) {
				alert(JSON.stringify(res));
			}
		});
	});
}