var images = {
	localIds = [],
	serverIds = []
};
function chooseImagesToUpload() {
	wx.chooseImage({
		success: function(res) {
			images.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
			for(var i =0;i<localIds.length;i++)
			{
				uploadImage(localIds[i],function(serverId){
					images.serverIds.push(serverId);
					if(images.serverIds.length == images.localIds.length)
					{
						
					}
				});
			}
		}
	});
}

function uploadImage(localid,completion)
{
	wx.uploadImage({
				localId: localid, // 需要上传的图片的本地ID，由chooseImage接口获得
				isShowProgressTips: 0 // 默认为1，显示进度提示
				success: function(res) {
					var serverId = res.serverId; // 返回图片的服务器端ID
					completion(serverId);
				}
			});
}
