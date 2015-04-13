var business = function() {
	var _this = this;
	this.fakeData = function() {
			var articles = [];
			for (var i = 0; i < 3; i++)
				articles.push({
					'ID': i,
					'title': "商讯标题" + i,
					'summary': "摘要" + i,
					'content': "fweofjweoifhweofw",
					'publisher': {
						'wechat_name': '微信名字' + Math.round(Math.random() * 100)
					},
					'publish_status': 0,
					'view_permission': 2,
					'timetag': '2013-07-07'
				});
			return articles;
		},
	this.init = function(renderContainer, articles) {
		this.articles = articles;
		this.el = renderContainer;
		this.render();
	},
	this.registerPullToRefresh = function(refreshOptions) {
		var puller = new pullToRefresh(refreshOptions);
		puller.bind();
	},
	this.registerInfiniteScroll = function(infiniteScrollOptions){
		var Scroller = new infiniteScroll(infiniteScrollOptions);
		Scroller.bind();
	},
	this.urlForArticle = function(article){
		var jsonObj = JSON.stringify(article);
		var base64Str = base64Encode(jsonObj);
		var URL = "business-detail.html?article={0}".format(base64Str);
		return URL;
	},
	this.render = function() {
		$.each(this.articles, function(i, item) {
			// 原文链接
			var url = null;
			// 图片
			var picURL = ''; //home + item.images[0].ori_image_url;
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
				'<a href="#" id="biz-like-{1}"><i class="fa fa-thumbs-o-up"></i>' + number1 + '</a>' +
				'<a href="#"><i class="fa fa-share-alt"></i><span style="font-size:14px">转发</span></a>' +
				'<a href="#" data-picker=".picker-1" class="open-picker"><i class="fa fa-comments-o"></i>' + number2 + '</a>' +
				'</div>' +
				'</div>' +
				'<div class="swipeout-actions-left"><a href="#" class="bg-green swipeout-overswipe demo-reply">Reply</a><a href="#" class="demo-forward bg-blue">Forward</a></div>' +
				'<div class="swipeout-actions-right"><a href="#" class="demo-actions">More</a><a href="#" class="demo-mark bg-orange">Mark</a><a href="#" data-confirm="Are you sure you want to delete this item?" class="swipeout-delete swipeout-overswipe">Delete</a></div>' +
				'</li>';
			// 前插新列表元素
			itemHTML = itemHTML.format(_this.urlForArticle(item),i);
			_this.el.append(itemHTML);
			_this.onLike(i);
		});
	},
	this.onLike = function(index){
		var likeEl = this.el.find('#biz-like-{0}'.format(index));
		likeEl.off('click');
		likeEl.on('click',function(){
			if (!$(this).hasClass('like')) {
				$(this).addClass('like');
				var num = parseInt($(this).text()) + 1
				$(this).html('<i class="fa fa-thumbs-o-up"></i>' + num);
			}
			else
			{
				$(this).removeClass('like');
				var num = parseInt($(this).text()) - 1
				$(this).html('<i class="fa fa-thumbs-o-up"></i>' + num);
			}
		});
	}
}