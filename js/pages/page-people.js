var people = function(options) {
	var _this = this;
	this.blacklist = options.blacklist;
	this.friendlist = options.friends;
	this.blacklistCompareKey = options.blacklistCompareKey;
	this.friendlistCompareKey = options.friendlistCompareKey;
	this.searchOptions = {'keys': options.searchKeys};
	this.init = function() {
		this.index();
	},
	this.index = function(){
		var blacklistWithPinYinCol = this.blacklist.concat();
		var friendlistWithPinYinCol = this.friendlist.concat();
		$.each(blacklistWithPinYinCol, function(item,i) {    
        	var property = item[this.blacklistCompareKey];
        	var pinyin = PinYin.toPinyinOnly(property);
        	item.pinyin = pinyin;
		});
		$.each(friendlistWithPinYinCol, function(item,i) {    
        	var property = item[this.friendlistCompareKey];
        	var pinyin = PinYin.toPinyinOnly(property);
        	item.pinyin = pinyin;
		});
		if(this.searchOptions.keys.indexOf('pinyin') == -1)
		{
			this.searchOptions.keys.push('pinyin');
		}
		var indexArray = friendlistWithPinYinCol.concat(blacklistWithPinYinCol);
		this.fuse = new Fuse(indexArray,this.searchOptions);
	},
	this.blacklistPinyinComparer = function(obj1,obj2){
		var property1 = obj1.pinyin;
		var property2 = obj2.pinyin;
		return property1 - property2;
	},
	this.friendlistPinyinComparer = function(obj1,obj2){
		var property1 = obj1.pinyin;
		var property2 = obj2.pinyin;
		return property1 - property2;
	},
	this.pinyinSort = function(){
		this.blacklist.sort(this.blacklistPinyinComparer);
		this.friendlist.sort(this.friendlistPinyinComparer);
	},
	this.search = function(keyword){
		this.fuse.search(keyword);
	}
}