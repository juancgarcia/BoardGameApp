var Helper = {}; 

Helper.addInConfig = function(_context, _config) {		
	for(prop in _config){
		_context[prop] = _config[prop];
	}
};

Helper.objToArr = function(_obj) {
	var arr = [];
	Helper.addInConfig(arr, _obj);
	return arr;
};
