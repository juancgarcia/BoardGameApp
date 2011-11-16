/*
 * PanAndZoom Module
 * 
 * API to apply zoomable and pannable behaviours to a container.
 * Both Pan and Zoom require a container/view object and one or more
 * lists of events to assign the various action callbacks (zoomIn, panLeft, etc.)
 * 
 * config ={
 * 		container: ---,
 * 		zoom: {
 * 			multiplyer: decimal (ex: .5, 3) multi>1 for zoomIn; 0<multi<1 for zoomOut
 * 			state: {
 * 				zoomedIn: true/false, //optional, to set default zoom state
 * 				zoomedOut: true/false, //optional, to set default zoom state
 *			},
 * 			events: {
 * 				zoomIn: [],
 * 				zoomOut: []
 * 			},
 * 		},
 * 		pan: {
 * 			stepLength: ---,
 * 			pageLength: ---,
 * 			events: {
 * 				stepUp: [],
 * 				stepDown: [],
 * 				stepLeft: [],
 * 				stepRight: [],
 * 				pageUp: [],
 * 				pageDown: [],
 * 				pageLeft: [],
 * 				pageRight: []
 * 			} 	
 * 		}
 * }
 */

var exports = {}; var panAndZoomInternalNamespace = {};

(function(){
	
	panAndZoomInternalNamespace.defaultConfig = {
		container: null,
		zoom: {
			multiplyer: 3, //decimal (ex: .5, 3) multi>1 for zoomIn; 0<multi<1 for zoomOut
			state: {
				zoomedIn: false, //true/false, //optional, to set default zoom state
				zoomedOut: true, //true/false, //optional, to set default zoom state
			},
			events: {
				zoomIn: [],
				zoomOut: []
			},
			zoomTargetting: function(/*{x:num,y:num}*/point, /*object*/_extras){
				var target = {x:0, y:0};
				
				var zoomPane={
					width: _extras.continerWidth / (_extras.multiplyer*2),
					height: _extras.continerHeight / (_extras.multiplyer*2)
				};
				
				target.x = zoomPane.width - point.x;
				target.y = zoomPane.height - point.y;
				
				return target;
			}
		},
		pan: {
			stepLength: null,
			pageLength: null,
			events: {
				stepUp: [],
				stepDown: [],
				stepLeft: [],
				stepRight: [],
				pageUp: [],
				pageDown: [],
				pageLeft: [],
				pageRight: []
			} 	
		}
	};
	
	var addEvents = function(/*View*/ viewContainer, /*Array*/ events, /*Function*/ callback) {
		for (var i = events.length - 1; i >= 0; i--){
		  viewContainer.addEventListener(events[i], callback);
		};
	}; panAndZoomInternalNamespace.addEvents = addEvents;
	
	/*
	 * Default: zoomed out if no state given 
	 *
	 * Config State obj: {zoomedIn/zoomedOut: true/false}
	 */			
	var createZoomState = function(_config) {
		
		_in = false; //private
		_out = !this._in; //private
		
		set = function(/*bool*/ state) {
			var inState = false;
			if(state && (state.zoomedIn || !state.zoomedOut) ){
				inState = true;
			}
			_in = inState;
			_out = !_in;				
		};
		
		setFor = function(_dir, _val) {
			var setVal = (_dir == 'zoomedIn')? _in: _out,
				state = {};
			
			if(_val!=undefined && _val){
				setVal = _val;
				state[_dir]=setVal;
				set(state);
			}
			
			return (_dir == 'zoomedIn')? _in: _out;
		};
		
		zoomedIn = function(_val) {
			return setFor('zoomedIn', _val);
		};
		
		zoomedOut = function(_val) {
			return setFor('zoomedOut', _val);
		};
		
		toggle = function () {			  
			_out = !_out;
			_in = !_out;
			
			return {zoomedIn: _in, zoomedOut: _out};
		}
		
		if (_config)
			set(_config);
		
		return {zoomedIn:zoomedIn, zoomedOut:zoomedOut, toggle:toggle};				
	}; panAndZoomInternalNamespace.createZoomState = createZoomState;
	
	/*
	 * this = zoomable view container
	 */
	var zoomIn = function(_event, _extras)
	{
		var zoomInTrans, zoomInAnim;					
	
		zoomInTrans = Titanium.UI.create2DMatrix().scale(_extras.multiplyer);		
		zoomInAnim = Titanium.UI.createAnimation();
		zoomInAnim.transform = zoomInTrans;
		zoomInAnim.duration = ($$ && $$.animationDuration)? $$.animationDuration: 600;
			
		//var xUnits = _extras.x / 1; //var xUnits = _extras.x / gridConfig.subSize;
		//var yUnits = _extras.y / 1; //var yUnits = _extras.y / gridConfig.subSize;
		
		//var xTrans = 0; //var xTrans = -1 * gridConfig.subSize * getTransFromGridUnits(xUnits);
		//var yTrans = 0; //var yTrans = -1 * gridConfig.subSize * getTransFromGridUnits(yUnits);
		
		var target = _extras.targetting(
			{x:_extras.x, y:_extras.y},
			{multiplyer: _extras.multiplyer, continerWidth: this.width, continerHeight: this.height}
		);
		
    	var tempTrans = Titanium.UI.create2DMatrix().scale(2.0).translate( target.x/*xTrans*/, target.y/*yTrans*/);
    	var tempAnim = Titanium.UI.createAnimation();
		tempAnim.transform = tempTrans;
		tempAnim.duration = 600;
		
		this.animate(tempAnim);
	}; panAndZoomInternalNamespace.zoomIn = zoomIn;
	
	/*
	 * this = zoomable view container
	 */
	var zoomOut = function(_extras) {		
		var zoomTrans, zoomAnim;
		
		zoomTrans = Titanium.UI.create2DMatrix().scale(1.0);
		
		zoomAnim = Titanium.UI.createAnimation();
		zoomAnim.transform = zoomTrans;
		zoomAnim.duration = ($$ && $$.animationDuration)? $$.animationDuration: 600;
		
        this.animate(zoomAnim);
	}; panAndZoomInternalNamespace.zoomOut = zoomOut;

	var makeZoomable = function(_container, _config){
		if(!_config)
			throw new "_config missing";
		
		//Use _config.state or set default state as zoomed-out
		var zoomConfig = _config.state || {zoomedOut: true};
		var zoomState = panAndZoomInternalNamespace.createZoomState(zoomConfig); //panAndZoomInternalNamespace.createZoomState(zoomConfig);
		var multiplyer = 3; //arbitrary default zoom level 
		
		if(Math.min(_config.multiplyer, 1) == 1)
			multiplyer = _config.multiplyer;
		else if(_config.multiplyer>0)
			multiplyer = 1/_config.multiplyer;
		
		// Assign Zoom In
		panAndZoomInternalNamespace.addEvents(_container, _config.events.zoomIn, function(_event) {
		  if(!_event.consumed && zoomState.zoomedOut()){
			var point = _event.source.convertPointToView({x: _event.x, y: _event.y}, this);
		  	panAndZoomInternalNamespace.zoomIn.call(_container, _event, {multiplyer: multiplyer, x: point.x, y: point.y, targetting: _config.zoomTargetting});
		  	zoomState.toggle();
			_event.consumed = true;
		  }		  
		});
		
		// Assign Zoom Out
		panAndZoomInternalNamespace.addEvents(_container, _config.events.zoomOut, function(_event) {
		  if(!_event.consumed && zoomState.zoomedIn()){
		  	panAndZoomInternalNamespace.zoomOut.call(_container, _event, {});
		  	zoomState.toggle();
			_event.consumed = true;
		  }
		});
	}; panAndZoomInternalNamespace.makeZoomable = makeZoomable;
	
	//var zoomMe = function(config) {
	//	var multi = 2;
	//	if(config)
	//		multi = config.multi;
	//	
	//	var viewObj = this.collection[config.index];
	//	viewObj.height = viewObj.height * multi;
	//	viewObj.width = viewObj.width * multi;
	//};
	
	var toggleZoom = function(/*ZoomState*/zoom){
		if(zoom.zoomedOut()) {
			//add zoom-in callback
			// 2x zoom in
			Grid.loop(puzzleGrid, zoomMe, {multi: 2});
		}
		else {
			//add zoom-out callback
			// 2x zoom out
			Grid.loop(puzzleGrid, zoomMe, {multi: .5});
		}
		zoom.toggle();
	}; panAndZoomInternalNamespace.toggleZoom = toggleZoom;
	
	var applyConfig = function(_target, _defaults) {
		//Recursively descend the config structure applying all
		// non-null non-empty configs to the _target
		
		for( var index in _defaults) {
			if( !(_target[index]) && _target[index] !== false ) //undefined and not explicitly false
				_target[index] = _defaults[index]; //copy in the default
				
			else if( Array.isArray(_target[index]) ){
				if( _target[index].length > 0 )
				{ /*do nothing*/}
				else {// == 0
					//append the defaults here
				}
			}
			
			else //defined, but we don't know how far down, recurse the object
				panAndZoomInternalNamespace.applyConfig(_target[index], _defaults[index]);
		} 
		
	}; panAndZoomInternalNamespace.applyConfig = applyConfig;
	
	var setup = function(_config){			
		if(_config && _config.zoom) {
			//Ti.API.debug(_config.container);
			panAndZoomInternalNamespace.applyConfig(_config, panAndZoomInternalNamespace.defaultConfig);
			panAndZoomInternalNamespace.makeZoomable(_config.container, _config.zoom);//makeZoomable(_config.container, _config.zoom);
		}
		
		if(_config && _config.pan) {
			//makePannable(_config.container, _config.pan);
		}
	}; panAndZoomInternalNamespace.setup = setup;
	
	var exports = {
		setup: setup
	};
	
})(); appNamespace.ui.PanAndZoom = panAndZoomInternalNamespace;