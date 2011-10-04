Ti.include('boardGameApp/grid.js');

Titanium.UI.setBackgroundColor('#000');


var winStats,
	wrapperConfig,
	scroller,
	wrapper,
	puzzleGrid;

var win = Titanium.UI.createWindow({ backgroundColor:'#ddd' });
win.orientationModes = [ Titanium.UI.PORTRAIT ];


win.addEventListener('open', function() {
	
	winStats = win.size;

	var scrollerSize = function() {
		var _size = {}, _minDimension = Math.min(winStats.width * .9, winStats.height * .9);
		_size.width = Math.floor(_minDimension/*winStats.width * .9*/);
		_size.height = Math.floor(_minDimension/*winStats.height * .75*/);
		return _size;
	};
	
	scroller = Ti.UI.createView({/*Ti.UI.createScrollView({*/
		width: scrollerSize().width,
		top:0,
		height: scrollerSize().height,
		borderColor:'#aaa',
		borderWidth:2,
		backgroundColor:'#fff',
		//scrollType: 'horizontal'
	});
	
	overlay = Ti.UI.createView({/*Ti.UI.createScrollView({*/
		width: scrollerSize().width,
		height: scrollerSize().height,
		top:0
	});
	
	
	wrapper = Ti.UI.createView({
		//top:0,
		//left:0
	});
	
	win.add(scroller);
	scroller.add(wrapper);
	win.add(overlay);
	
	// wrapper.addEventListener('touchmove', function(e){
		// Ti.API.info('wrapper touched');
		// //var _scrollType = wrapper.scrollType;
		// //Ti.API.info('wrapper scrollType: '+_scrollType);
	// });
	
	var gridConfig = {
		rows: 4,
		cols: 4,
		size: Math.min(scrollerSize().height, scrollerSize().width),
		containerObj: wrapper
	};
	
	gridConfig.subSize = Math.floor(gridConfig.size/Math.max(gridConfig.cols, gridConfig.rows));
	
	wrapper.width = gridConfig.subSize * gridConfig.cols;
	wrapper.height = gridConfig.subSize * gridConfig.rows;
	puzzleGrid = Grid.createGrid(gridConfig);
	
	// default state is zoom-in
	zoomState = Boolean(true);
	
	var zoomMe = function(config) {
		var multi = 2;
		if(config)
			multi = config.multi;
		
		var viewObj = this.collection[config.index];
		viewObj.height = viewObj.height * multi;
		viewObj.width = viewObj.width * multi;
	};
	
	toggleZoom = function(){
		if(zoomState) {
			//add zoom-in callback
			// 2x zoom in
			Grid.loop(puzzleGrid, zoomMe, {multi: 2});
		}
		else {
			//add zoom-out callback
			// 2x zoom out
			Grid.loop(puzzleGrid, zoomMe, {multi: .5});
		}
		zoomState = !zoomState;
	};
	
	//var assignZoom = function(config) {		
		//wrapper.addEventListener('doubletap', toggleZoom );
	//};

	var transformPrimary = Titanium.UI.create2DMatrix().scale(1.0);
	
	var animatePrimary = Titanium.UI.createAnimation();
	animatePrimary.transform = transformPrimary;
	animatePrimary.duration = 600;
	
	
	var transformSecondary = Titanium.UI.create2DMatrix().scale(2.0);
	
	var animateSecondary = Titanium.UI.createAnimation();
	animateSecondary.transform = transformSecondary;
	animateSecondary.duration = 600;

	// when this animation completes, scale to normal size
	// a.addEventListener('complete', function()
	// {
	    // // we can use the identity transform to take it back to it's real size
	    // var t2 = Titanium.UI.create2DMatrix();
	    // w.animate({transform:t2, duration:200});
	// });
	
	var zoomed_in = false;
 
	overlay.addEventListener(/*'scale'*/'doubletap', function(e)
	{		 
        if (!zoomed_in)
        {   
			var xUnits = e.x / gridConfig.subSize;
			var yUnits = e.y / gridConfig.subSize;
			
			var xTrans = -1 * gridConfig.subSize * getTransFromGridUnits(xUnits);
			var yTrans = -1 * gridConfig.subSize * getTransFromGridUnits(yUnits);
			
			
        	var tempTrans = Titanium.UI.create2DMatrix().scale(2.0).translate( xTrans, yTrans);
        	var tempAnim = Titanium.UI.createAnimation({transform: tempTrans, duration: 600});
			tempAnim.transform = tempTrans;
			tempAnim.duration = 600;
			
			wrapper.animate(tempAnim);
            overlay.width = 0;
            overlay.height = 0;
        }
        zoomed_in = !zoomed_in;
	});	
 
	scroller.addEventListener(/*'scale'*/'doubletap', function(e)
	{		 
        if (zoomed_in)
        {   
            wrapper.animate(animatePrimary);
            overlay.width = scrollerSize().width;
            overlay.height = scrollerSize().height;
        }
        zoomed_in = !zoomed_in;
	});
	
	
	/*		
	// [0-1.5) no trans
	// (1.5-2.5) trans 1 subsize unit
	// (2.5-4) trans 2 subsize units
	*/
	var getTransFromGridUnits = function(units){
		if(units < 1.5)
			return 0;
			
		else if(units < 2.5)
			return 1;
			
		else
			return 2;
	};
	
	
	//var gridSize = Math.max(scrollerSize().height, scrollerSize().width);
	//var gridSubSize = Math.floor(gridSize/Math.max(cols, rows));
	
});

win.open();



// win.show();


// var wrapperShadow = Ti.UI.createView({
	// width:'95%',
	// height:2,
	// backgroundColor:'#bbb',
	// top:297
// });

// win.add(wrapperShadow);
