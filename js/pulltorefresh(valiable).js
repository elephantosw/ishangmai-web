
// 	function sam()
// {
// 	ajaxRequest(API_TOKEN,"GET",{},function(resposeData,err){
		
// 	});
// }

<!--....... 下拉加载 .......-->
 
// 下拉刷新页面
var ptrContent = $$('.pull-to-refresh-content');


 
// 添加'refresh'监听器
ptrContent.on('refresh', function (e) {
    // 加载过程
	$.ajax({
		url: 'http://192.168.0.103/api/business',
		type: 'GET',
	    dataType: "jsonp",
		data:{token:token,page:0,pageSize:20}, 
		success: function (data) {
			$.each(data.userinfo,function(i,item){			
			    // 原文链接
				var url = null;
		        // 图片
		        var picURL = 'http://192.168.0.103/' + item.images[0].ori_image_url;
		    	//标题
		    	var title=item.title;
		    	//作者
		        var author = item.publisher.wechat_name;
		    	//随机数
		    	var number1 = Math.round(Math.random() * 100);
		    	var number2 = Math.round(Math.random() * 100);
		        // 内容
		        var content = item.summury;
		        var time = item.timetag;
		        // 列表元素的HTML字符串
		        var itemHTML =  '<li class="swipeout">' +
				                    '<div class="swipeout-content"><a href="'+ url +'" class="item-link item-content">' +
				                        '<div class="item-media"><img src="' + picURL + '" width="80"/></div>' +
				                        '<div class="item-inner">' +
				                          '<div class="item-title-row">' +
				                            '<div class="item-title">' + title + '</div>' +
				                            '<div class="item-after"></div>' +
				                          '</div>' +
				                          '<div class="item-subtitle">' + author + '</div>' +
				                          '<div class="item-text">' + content + '</div>' +
				                        '</div></a>' +
						                   '<div class="item-func-linker-group">' +
				                            '<a href="#"><i class="fa fa-thumbs-o-up"></i>' + number1 + '</a>'+
				                            '<a href="#"><i class="fa fa-share-alt"></i><span style="font-size:14px">转发</span></a>' +
				                            '<a href="#"><i class="fa fa-comments-o"></i>' + number2 + '</a>' +
				                          '</div>' +
				                        '</div>' +
				                    '<div class="swipeout-actions-left"><a href="#" class="bg-green swipeout-overswipe demo-reply">Reply</a><a href="#" class="demo-forward bg-blue">Forward</a></div>' +
				                    '<div class="swipeout-actions-right"><a href="#" class="demo-actions">More</a><a href="#" class="demo-mark bg-orange">Mark</a><a href="#" data-confirm="Are you sure you want to delete this item?" class="swipeout-delete swipeout-overswipe">Delete</a></div>' +
				                '</li>';
		        // 前插新列表元素
		        ptrContent.find('ul').prepend(itemHTML);
			});	
		}
	})
	// 加载完毕需要重置
	setTimeout(myApp.pullToRefreshDone,300);
});