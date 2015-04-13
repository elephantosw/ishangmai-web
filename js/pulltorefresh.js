
// 	function sam()
// {
// 	ajaxRequest(API_TOKEN,"GET",{},function(resposeData,err){
		
// 	});
// }

<!--....... 下拉加载 .......-->
 
// 下拉刷新页面

var articles = [];
var page = 0;
var pageSize = 20;

fakeData();
function fakeData() {
	for (var i = 0; i < 3; i++)
		articles.push({
			'ID': i,
			'title': "商讯标题" + i,
			'summary': "摘要" + i,
			'content': "fweofjweoifhweofw",
			'publisher': {
				'wechat_name': '微信名字'+i
			},
			'publish_status': 0,
			'view_permission': 2,
			'timetag': '2013-07-07'
		});
}

function refreshIndexContents(completion) {
	/*$.ajax({
		url: home + '/api/business',
		type: 'GET',
	    dataType: "jsonp",
		data:{token:token,page:0,pageSize:20}, 
		success: function (data) {
			articles.push(data);
			render(data);
			completion(e);
		}
	});	*/
data = [{
		'ID': 5,
		'title': "business new",
		'summary': "摘要",
		'content': "fweofjweoifhweofw",
		'publisher': {
			'wechat_name': '微信名字'
		},
		'publish_status': 0,
		'view_permission': 2,
		'timetag': '2013-07-07'
	}];
	for (var i = 0; i < data.length; i++) {
		articles.push(data[i]);	
	};

	render(data,$$('.pull-to-refresh-content.business').find('ul'));
}

function render(data,el) {
	$.each(data, function(i, item) {
		// 原文链接
		var url = null;
		// 图片
		var picURL = '';//home + item.images[0].ori_image_url;
		//标题
		var title = item.title;
		//作者
		var author = item.publisher.wechat_name;
		//随机数
		var number1 = Math.round(Math.random() * 100);
		var number2 = Math.round(Math.random() * 100);
		// 内容
		var content = item.summary;
		var time = item.timetag;
		// 列表元素的HTML字符串
		var itemHTML = '<li class="swipeout">' +
			'<div class="swipeout-content"><a href="{0}" class="item-link item-content">' +
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
						'<a href="#" onclick=didLikeBiz({1},$(this))><i class="fa fa-thumbs-o-up"></i>' + number1 + '</a>' +
						'<a href="#"><i class="fa fa-share-alt"></i><span style="font-size:14px">转发</span></a>' +
						'<a href="#"><i class="fa fa-comments-o"></i>' + number2 + '</a>' +
					'</div>' +
			'</div>' +
			'<div class="swipeout-actions-left"><a href="#" class="bg-green swipeout-overswipe demo-reply">Reply</a><a href="#" class="demo-forward bg-blue">Forward</a></div>' +
			'<div class="swipeout-actions-right"><a href="#" class="demo-actions">More</a><a href="#" class="demo-mark bg-orange">Mark</a><a href="#" data-confirm="Are you sure you want to delete this item?" class="swipeout-delete swipeout-overswipe">Delete</a></div>' +
			'</li>';

		var index = indexOfObjectInArray(item, articles);
		itemHTML = itemHTML.format(urlAtArticleIndex(index), index);
		// 前插新列表元素
		el.prepend(itemHTML);
	});
}

function urlAtArticleIndex(index){
	var article = articles[index];
	var jsonObj = JSON.stringify(article);
	var base64Str = base64Encode(jsonObj);
	return "business-detail.html?article={0}".format(base64Str);
}

function didLikeBiz(index,par) {
	var article = articles[index];
	if(!par.hasClass('like'))
	{
		likebiz(article.ID, true, function(_bid, _liketag) {
			par.addClass('like');
			var num = parseInt(par.text())+1
			par.html('<i class="fa fa-thumbs-o-up"></i>' + num);
		});
	} else {
		likebiz(article.ID, true, function(_bid, _liketag) {
			par.removeClass('like');
			var num = parseInt(par.text())-1
			par.html('<i class="fa fa-thumbs-o-up"></i>' + num);
		});
	}
}

<!--....... 初始化加载 .......-->
function showExistbusiness()
{
	render(articles,$$('.pull-to-refresh-content.business').find('ul'));
}