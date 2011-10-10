Ti.include('/lib/helper.js');

var Grid = {};

(function() {
	Grid.defaults = {
        rows: 4,
        cols: 4,
        size: 500,
        subsize: 125
	};
	
	Grid.initDummyViewCell = function(_config) {
		var viewObj = Ti.UI.createView({
			height: _config.subSize,
			width: _config.subSize,
			/*right*/left: _config.subSize*_config.c,
			/*bottom*/top: _config.subSize*_config.r,
			borderColor:'#aaa',
			borderWidth:2,
			backgroundColor:'#fff'			
		});
		
		_config.containerObj.add(viewObj);
		
		viewObj.add(
			Ti.UI.createLabel({
				text: '('+_config.r+', '+_config.c+')',
				width:'auto',
				height:'auto',
				textAlign:'center',			
				color:'#333',
				font:{fontFamily:'Arial',fontSize:26},
				shadowColor:"#eee",
				shadowOffset:{x:1,y:1}			
			})
		);
		return viewObj;	
	};
	
	Grid.loop = function(_grid, _callback, _config) {
		
		var index, returned;
		//rows
		for (var r = _grid.config.rows - 1; r >= 0; r--){
			_config.r = r;
			//cols
			for (var c = _grid.config.cols - 1; c >= 0; c--){
				_config.c = c;
				index = r+','+c;
				_config.index = index;
				if(_grid.collection[index] == null)
					_grid.collection[index] = {};
				returned = _callback.call(_grid, _config);
				if(returned) _grid.collection[index] = returned;
			}; //end cols
		}; //end rows
		
	};
	
	Grid.createGrid = function(_config){
		this.config = {};
		
		Helper.addInConfig(this.config, Grid.defaults);
		
		if(_config){
			Helper.addInConfig(this.config, _config)
		}
		
		this.collection = [];
		Grid.loop(this, Grid.initDummyViewCell, this.config);
		
		return this;
	};
	
})()