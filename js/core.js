var $$ = Framework7.$;

var home = 'http://192.168.0.116';

var token;
var socket_token;
var updatingtokenflag = false;
var CookieExpiresHours = 7 * 24;

var Code = GetQueryString('code');
var State = GetQueryString('code');
var originItems = [];

//global variable
var articles = null;
var acts = null

var myApp = new Framework7({
	pushState: true,
	init: false
});


// Add view
var mainView = myApp.addView('.view-main', {
	// Because we want to use dynamic navbar, we need to enable it for this view:
	dynamicNavbar: true,
});

myApp.onPageInit('index', function(page) {
	//  showExistbusiness(); //加载缓存原有
	//  registerPullToRefreshOnIndexPage(); //下拉刷新
	businessHelper = new business();
	businessHelper.registerPullToRefresh({
		'container': $$('.pull-to-refresh-content.business'),
		'app': myApp,
		'onRefresh': function(app) {
			var data = businessHelper.fakeData();  //fakeData()连接时替换
			data = data.concat(articles);
			articles = data;
			$$('.pull-to-refresh-content.business').find('ul').html('');
			businessHelper.init($$('.pull-to-refresh-content.business').find('ul'), articles);
			app.pullToRefreshDone();
		}
	});
	businessHelper.registerInfiniteScroll({
		'container': $$('.infinite-scroll.business'),
		'app': myApp,
		'onInfiniteScroll': function(app){
			var _this = this;
			if(this.loading == true) return;
			this.loading = true;
			setTimeout(function(){
				_this.loading = false;
				var data = businessHelper.fakeData();
				articles = articles.concat(data);
				$$('.infinite-scroll.business').find('ul').html('');
				businessHelper.init($$('.infinite-scroll.business').find('ul'), articles);
				},500);
		}
	})
	if (articles == null)
	{
		articles = businessHelper.fakeData();
	}

	businessHelper.init($$('.pull-to-refresh-content.business').find('ul'), articles);

});

myApp.onPageInit('activities', function(page) {
	var actHelper = new activitie();
	actHelper.registerPullToRefresh({
		'container': $$('.pull-to-refresh-content.activitie'),
		'app': myApp,
		'onRefresh': function(app) {
			var data = actHelper.fakeData();
			data = data.concat(acts);
			acts = data;
			actHelper.clear();
			actHelper.init($$('.pull-to-refresh-content.activitie').find('ul'),acts);
			app.pullToRefreshDone();
		}
	});
	actHelper.registerInfiniteScroll({
		'container': $$('.infinite-scroll.activitie'),
		'app': myApp,
		'onInfiniteScroll': function(app){
			var _this = this;
			if(this.loading == true) return;
			this.loading = true;
			setTimeout(function(){
				_this.loading = false;
				var data = actHelper.fakeData();
				acts = acts.concat(data);
				$$('.infinite-scroll.activitie').find('ul').html('');
				actHelper.init($$('.infinite-scroll.activitie').find('ul'), acts);
				},500);
		}
	})
	if (acts == null)
	{
		acts = actHelper.fakeData();
	}
	actHelper.init($$('.pull-to-refresh-content.activitie').find('ul'),acts);
});

myApp.onPageInit('business-detail', function(page) {
	//getfrinds(function(token,err){});
	var base64 = getUrlParameter('article');
	var jsonStr = base64Decode(base64);
	var article = JSON.parse(jsonStr);
	$(page.container).find('.ks-facebook-name').html(article.publisher.wechat_name);
	$(page.container).find('.ks-facebook-date').html(article.timetag);
	$(page.container).find('h2').html(article.title);
});

myApp.onPageInit('renmai-list', function(page) {
	//getfrinds();
	//名字分组
	originItems.sort(function(a, b) {
		return a.name.localeCompare(b.name);
	});

	var items = [];
	for (var i = 0; i < originItems.length; i++) {
		if (originItems[i].type != 2)
			items.push(originItems[i]);
	};

	//类别分组
	items.sort(function(a, b) {
		return a.type > b.type ? 1 : -1;
	});

	//插入分组名称
	for (var i = 0; i < 2; i++) {
		if ((indexOfKeyValue(items, "type", i)) >= 0)
			items.splice((indexOfKeyValue(items, "type", i)), 0, {
				'Classify': i
			});
	}


	// Create virtual list
	var myList = myApp.virtualList($$(page.container).find('.virtual-list'), {
		// Pass array with items
		items: items,
		// Custom search function for searchbar
		searchAll: function(query, items) {
			var found = [];
			var queryletter = getFirstLetterArray(query);
			var typeexist = -1;
			for (var i = 0; i < items.length; i++) {
				if (items[i].Classify == undefined) {
					var exist = -1;
					var nameletter = getFirstLetterArray(items[i].name);
					var nameArray = getLetterArray(items[i].name);
					// if (items[i].name.indexOf(query) >= 0 || query.trim() === '') found.push(i);
					if (query.charCodeAt() >= 65 && query.charCodeAt() <= 122) {
						for (var j = 0; j < queryletter.length; j++) {
							if (nameletter.indexOf(queryletter[j]) >= exist && nameletter.indexOf(queryletter[j]) != -1) {
								exist = nameletter.indexOf(queryletter[j]);
								nameletter.splice(exist, 1);
							} else {
								exist = -1;
								break;
							};
						};
					} else {
						for (var j = 0; j < query.length; j++) {
							if (nameArray.indexOf(query[j]) >= exist && nameArray.indexOf(query[j]) != -1) {
								exist = nameArray.indexOf(query[j]);
								nameArray.splice(exist, 1);
							} else {
								exist = -1;
								break;
							};
						};
					};
					if (typeexist < items[i].type && exist > -1) {
						typeexist = items[i].type;
						found.push(indexOfKeyValue(items, "type", typeexist) - 1);
					};
					if (exist > -1) found.push(i);
				};
			}
			return found; //return array with mathced indexes
		},
		// List item Template7 template
		renderItem: function(index, item) {
			if (item.Classify == 0)
				return '<li class="list-group-title">密友</li>';
			if (item.Classify == 1)
				return '<li class="list-group-title">好友</li>';
			if (item.type == 0)
				return '<li class="swipeout" id=' + item.id + '>' +
					'<div class="swipeout-content item-content">' +
					'<div class="item-media"><i class="icon icon-people2"></i></div>' +
					'<div class="item-inner">' +
					'<div class="item-title">' + item.name + '</div>' +
					'</div>' +
					'</div>' +
					'<div class="swipeout-actions-right">' +
					'<a href="#" class="toNF bg-orange">移至好友</a>' +
					'<a href="#" class="swipeout-delete" data-confirm="确定删除此好友?" data-confirm-title="删除密友" onclick="deleteItem(' + item.id + ')">删除</a>' +
					'</div>' +
					'<div class="swipeout-actions-left">' +
					'<a href="#" class="toBL bg-black">移至黑名单</a>' +
					'</div>' +
					'</li>';
			if (item.type == 1)
				return '<li class="swipeout" id=' + item.id + '>' +
					'<div class="swipeout-content item-content">' +
					'<div class="item-media"><i class="icon icon-people2"></i></div>' +
					'<div class="item-inner">' +
					'<div class="item-title">' + item.name + '</div>' +
					'</div>' +
					'</div>' +
					'<div class="swipeout-actions-right">' +
					'<a href="#" class="toSF bg-orange">移至密友</a>' +
					'<a href="#" class="swipeout-delete" data-confirm="确定删除此好友?" data-confirm-title="删除好友" onclick="deleteItem(' + item.id + ')">删除</a>' +
					'</div>' +
					'<div class="swipeout-actions-left">' +
					'<a href="#" class="toBL bg-black">移至黑名单</a>' +
					'</div>' +
					'</li>';
		},
		// Item height
		height: function(item) {
			if (item.Classify != undefined) return 31; //item with picture is 100px height
			else return 50; //item without picture is 44px height
		}
	});
	$(document).on('click', '.toNF.bg-orange', function(e) {
		var index = indexOfKeyValue(originItems, 'id', $(this).parent().parent().attr('id'));
		originItems[index].type = '1';
		items = [];
		for (var i = 0; i < originItems.length; i++) {
			if (originItems[i].type != 2)
				items.push(originItems[i]);
		};
		//类别分组
		items.sort(function(a, b) {
			return a.type > b.type ? 1 : -1;
		});
		//插入分组名称
		for (var i = 0; i < 2; i++) {
			if ((indexOfKeyValue(items, "type", i)) >= 0)
				items.splice((indexOfKeyValue(items, "type", i)), 0, {
					'Classify': i
				});
		}
		//myList.items = items;
		myApp.swipeoutDelete($(e.target).parent().parent());
		myList.replaceAllItems(items);
	});

	$(document).on('click', '.toSF.bg-orange', function(e) {
		var index = indexOfKeyValue(originItems, 'id', $(this).parent().parent().attr('id'));
		originItems[index].type = '0';
		items = [];
		for (var i = 0; i < originItems.length; i++) {
			if (originItems[i].type != 2)
				items.push(originItems[i]);
		};
		//类别分组
		items.sort(function(a, b) {
			return a.type > b.type ? 1 : -1;
		});

		//插入分组名称
		for (var i = 0; i < 2; i++) {
			if ((indexOfKeyValue(items, "type", i)) >= 0)
				items.splice((indexOfKeyValue(items, "type", i)), 0, {
					'Classify': i
				});
		}
		//myList.items = items;
		myApp.swipeoutDelete($(e.target).parent().parent());
		myList.replaceAllItems(items);
	});

	$(document).on('click', '.toBL.bg-black', function(e) {
		var index = indexOfKeyValue(originItems, 'id', $(this).parent().parent().attr('id'));
		originItems[index].type = '2';
		items = [];
		for (var i = 0; i < originItems.length; i++) {
			if (originItems[i].type != 2)
				items.push(originItems[i]);
		};
		//类别分组
		items.sort(function(a, b) {
			return a.type > b.type ? 1 : -1;
		});

		//插入分组名称
		for (var i = 0; i < 2; i++) {
			if ((indexOfKeyValue(items, "type", i)) >= 0)
				items.splice((indexOfKeyValue(items, "type", i)), 0, {
					'Classify': i
				});
		}
		//myList.items = items;
		myApp.swipeoutDelete($(e.target).parent().parent());
		myList.replaceAllItems(items);
	});

	$(document).on('click', '.outOfBL.bg-black', function(e) {
		var index = indexOfKeyValue(originItems, 'id', $(this).parent().parent().attr('id'));
		originItems[index].type = '1';
		items = [];
		for (var i = 0; i < originItems.length; i++) {
			if (originItems[i].type != 2)
				items.push(originItems[i]);
		};
		//类别分组
		items.sort(function(a, b) {
			return a.type > b.type ? 1 : -1;
		});

		//插入分组名称
		for (var i = 0; i < 3; i++) {
			if ((indexOfKeyValue(items, "type", i)) >= 0)
				items.splice((indexOfKeyValue(items, "type", i)), 0, {
					'Classify': i
				});
		}
		//myList.items = items;
		myApp.swipeoutDelete($(e.target).parent().parent());
		myList.replaceAllItems(items);
	});

});

$(document).on('click', '.swipeout-content', function() {
	//alert($(this).attr('id'));
	ShangxunId = $(this).attr('id');
}); // 获取整个网页文档对象来指定(商讯detial)

/* ===== Demo Popover ===== */
$('.popover a').on('click', function(e) {
	// e.preventDefault(); 
	myApp.closeModal('.popover');
});

getfrinds();


// Create virtual list
myApp.onPageInit('black-list', function(page) {
	// Create virtual list
	var items = [];
	for (var i = 0; i < originItems.length; i++) {
		if (originItems[i].type == 2)
			items.push(originItems[i]);
	};

	var myBlackList = myApp.virtualList($$(page.container).find('.virtual-black-list'), {
		// Pass array with items
		items: items,
		// List item Template7 template
		renderItem: function(index, item) {
			console.log(item);
			if (item.type == 2)
				return '<li class="swipeout" id=' + item.id + '>' +
					'<div class="swipeout-content item-content">' +
					'<div class="item-media"><i class="icon icon-people2"></i></div>' +
					'<div class="item-inner">' +
					'<div class="item-title">' + item.name + '</div>' +
					'</div>' +
					'</div>' +
					'<div class="swipeout-actions-left">' +
					'<a href="#" class="outOfBL bg-black" onclick="movefriend ($(this))">移出黑名单</a>' +
					'</div>' +
					'</li>';
		},
		// Item height
		height: function(item) {
			return 50; //item without picture is 44px height
		}
	});

	$(document).on('click', '.outOfBL.bg-black', function(e) {
		var index = indexOfKeyValue(originItems, 'id', $(this).parent().parent().attr('id'));
		originItems[index].type = '1';
		items = [];
		for (var i = 0; i < originItems.length; i++) {
			if (originItems[i].type == 2)
				items.push(originItems[i]);
		};
		//myBlackList.items = items;
		myApp.swipeoutDelete($(e.target).parent().parent());
		myBlackList.replaceAllItems(items);
	});

});

myApp.init();


function deleteItem(id) {
	originItems.splice(indexOfKeyValue(originItems, "id", id), 1);
};


function getfrinds(completion) {
	// $.ajax({
	//     url: home + '/api/people',
	//     type: 'GET',
	//     dataType: 'jsonp',
	//     data:{"token":token,"uid":1}, 
	//     //jsonp:'callback', 
	//     success: function (data) {
	//         console.log(data);
	//         var response = data;
	//         if(response.isProcessSuccess)
	//         {
	//             console.log(response);
	//             completion(token,null);
	//         }
	//     }
	// });
	var fn = ['张', '李', '王', '孙', '郝'];
	var sn = ['亮', '小刚', '二', '四', '小红', '小明', '三']
		// Generate array with 10000 demo items:
	originItems = [];
	for (var i = 0; i < 10; i++) {
		originItems.push({
			name: fn[Math.floor(Math.random() * fn.length)] + sn[Math.floor(Math.random() * sn.length)],
			title: 'Item ' + Math.round(Math.random() * 100),
			type: '' + Math.floor(Math.random() * 3),
			id: '' + i
		});
	}
}


// Registering Pull Refresh Handler
function registerPullToRefreshOnIndexPage() {
	var ptrContent = $$('.pull-to-refresh-content.business');
	ptrContent.off('refresh');
	ptrContent.on('refresh', function(e) {
		setTimeout(myApp.pullToRefreshDone, 300);
		refreshIndexContents(function(err) {});
	});
}

function registerPullToRefreshOnActivitiesPage() {
	var ptrContent = $$('.pull-to-refresh-content.activities');
	ptrContent.off('refresh');
	ptrContent.on('refresh', function(e) {
		setTimeout(myApp.pullToRefreshDone, 300);
		refreshActivitiesContents(function(err) {});
	});
}


// addCookie('first','1',1);
// addCookie('sec','2',1);
// addCookie('third','3',1);
// deleteCookie('first');
// alert(document.cookie); 
// alert(getCookie('first')===null);


init_socket();

//获取应用的token
requestToken(function(token, err) {
	// 获取用户信息
	requestIdToken();
});

function requestToken(completion) {
	updateingtokenflag = true;
	$.ajax({
		url: home + '/api/token',
		type: 'GET',
		dataType: 'jsonp',
		//data:{token:""}, 
		//jsonp:'callback', 
		success: function(data) {
			var response = data;
			if (response.isProcessSuccess) {
				token = response.userinfo;
				alert(token);
				completion(token, null);
			}
			updateingtokenflag = false;
		}
	});
}

function requestIdToken() {
	$.ajax({
		url: home + '/api/oauth2?code={0}&state={1}&token={2}'.format(Code, State, token),
		type: 'GET',
		dataType: 'jsonp',
		success: function(data) {
			clearCookie();
			if (data.isProcessSuccess) {
				var response = data.userinfo;
				for (var x in response) {
					addCookie(x, response[x], CookieExpiresHours);
				}
				alert(document.cookie);
			};
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("出错了！，具体信息如下：\n" + " XMLHttpRequest:" + XMLHttpRequest.readyState + "\n  textStatus:" + textStatus + "\n errorThrown:" + errorThrown);
		}
	});
}