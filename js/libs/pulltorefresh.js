var pullToRefresh = function(options){
	var _this = this;
	this.el = options.container;
	this.onRefresh = options.onRefresh;
	this.app = options.app;
	this.bind = function(){
		this.el.off('refresh');
		this.el.on('refresh',function(e){
			_this.onRefresh(_this.app);
		});
	}
}

var infiniteScroll = function(options){
	var _this = this;
	this.el = options.container;
	this.onInfiniteScroll = options.onInfiniteScroll;
	this.app = options.app;
	this.loading = false;
	this.bind = function(){
		this.el.off('infinite');
		this.el.on('infinite',function(e){
			_this.onInfiniteScroll(_this.app);
		});
	}
}