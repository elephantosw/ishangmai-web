var activitie = function() {
	var _this = this;
	this.fakeData = function() {
			var acts = [];
			for (var i = 0; i < parseInt((Math.random() * 5) % 5 + 1); i++)
				acts.push({
					'ID': i,
					'act_title': "活动标题" + i,
					'act_content': "fweofjweoifhweofw",
					'act_location': "fweiofjweifjwejiof",
					'act_time': '2015-09-03',
					'act_fee': 0,
					'act_limitation': parseInt(Math.abs((Math.random() * 300)) % 300 + 1),
					'act_sub_deadline': '2015-10-04',
					'act_subs': parseInt(Math.abs((Math.random() * 100)) % 20 + 1),
					'publisher': {
						'wechat_name': '微信名字' + i,
						'username': '微信名字' + i,
						'company': '天鸿集团',
						'occupation': 'CEO',
						'headimgurl': 'http://pic55.nipic.com/file/20141211/20181116_132442892425_2.jpg'
					},
					'publish_status': 0,
					'view_permission': 2,
					'timetag': '2013-{1}-{0}'.format((Math.random() * 100) % 30 + 1,(Math.random() * 100) % 12 + 1)
				});
			return acts;
		},
	this.init = function(renderContainer, acts) {
		this.acts = acts;
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
	this.urlForAct = function(act){
		var jsonObj = JSON.stringify(act);
		var base64Str = base64Encode(jsonObj);
		var URL = "activity-detail.html?act={0}".format(base64Str);
		return URL;
	},
	this.clear = function(){
		this.acts = [];
		this.el.html('');
	},
	this.render = function() {
		$.each(this.acts, function(i, item) {
			var act_title = item.act_title;
			var act_time = item.act_time;
			var act_loc = item.act_location;
			var act_subs = item.act_subs;
			var act_limitation = item.act_limitation;
			var headimgurl = item.publisher.headimgurl;
			var username = item.publisher.username;
			var company = item.publisher.company;
			var occupation = item.publisher.occupation;
			var publishTime = moment(item.timetag,"yyyy-MM-dd HH:mm:ss").fromNow();
			var itemHTML = '<li class="act">' + 
								'<a href="{8}">' +
									'<div class="act-container">' + 
										'<div class="act-header">' + 
											'<div class="title">{0}</div>' + 
										'</div>' +
										'<div class="act-content">' + 
											'<div class="wrapper">' + 
												'<div class="act-time">' + 
													'<i class="fa fa-clock-o"></i>' + 
													'<span>{1}</span>' +
												'</div>' + 
												'<div class="act-loc">' + 
													'<i class="fa fa-map-marker"></i>' + 
													'<span>{2}</span>' + 
												'</div>' + 
												'<div class="act-sub">' + 
													'<i class="fa fa-user"></i>' + 
													'<span>剩余名额 <code style="color:red">{3}</code> 人</span>' +
												'</div>' +
											'</div>' +
										'</div>' +
										'<div class="act-footer">' +
											'<div class="footer-container">' +
												'<img src="{4}" width="30px" height="30px">' +
												'<div>{5} |{6}</div>' +
												'<div class="right-align">{7}</div>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</a>' + 
							'</li>';
			itemHTML = itemHTML.format(act_title,act_time,act_loc,(act_limitation - act_subs),headimgurl,username,company + ' ' + occupation,publishTime,_this.urlForAct(item));
			_this.el.append(itemHTML);
		});
	}
}