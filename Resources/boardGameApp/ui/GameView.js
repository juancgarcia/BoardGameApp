
(function(){
	appNamespace.ui.createGameView = function(_args) {
		
		var gameView = Ti.UI.createView(),
			
			gameContainer = Ti.UI.createView({/*Ti.UI.createScrollView({*/
				width: $$.platformMin * $$.containerShrink,
				//top:0,
				height: $$.platformMin * $$.containerShrink,
				borderColor:'#aaa',
				borderWidth:2,
				backgroundColor:'#fff',
				//scrollType: 'horizontal'
			}),
			
			overlay = Ti.UI.createView({/*Ti.UI.createScrollView({*/
			    backgroundColor:'#000',
			    opacity:0.50,
				width: $$.platformMin * $$.containerShrink,
				height: $$.platformMin * $$.containerShrink,
				top:0
			}),		
		
			gameBoard = Ti.UI.createView({
				//top:0,
				//left:0
			});
			
			// var wrapperShadow = Ti.UI.createView({
				// width:'95%',
				// height:2,
				// backgroundColor:'#bbb',
				// top:297
			// });
		
		gameView.add(gameContainer);
		gameContainer.add(gameBoard);
		//gameView.add(overlay);
		
		// gameView.add(wrapperShadow);			
	
		// gameBoard.addEventListener('touchmove', function(e){
			// Ti.API.info('gameBoard touched');
			// //var _scrollType = gameBoard.scrollType;
			// //Ti.API.info('gameBoard scrollType: '+_scrollType);
		// });
		
		var gridConfig = {
			rows: 4,
			cols: 4,
			size: Math.min($$.platformMin * $$.containerShrink, $$.platformMin * $$.containerShrink),
			containerObj: gameBoard
		};
		
		gridConfig.subSize = Math.floor(gridConfig.size/Math.max(gridConfig.cols, gridConfig.rows));
		
		gameBoard.width = gridConfig.subSize * gridConfig.cols;
		gameBoard.height = gridConfig.subSize * gridConfig.rows;
		
		var puzzleGrid = Grid.createGrid(gridConfig);
	
		var transformPrimary = Titanium.UI.create2DMatrix().scale(1.0);
		
		var animatePrimary = Titanium.UI.createAnimation();
		animatePrimary.transform = transformPrimary;
		animatePrimary.duration = 600;
	
		// when this animation completes, scale to normal size
		// a.addEventListener('complete', function()
		// {
		    // // we can use the identity transform to take it back to it's real size
		    // var t2 = Titanium.UI.create2DMatrix();
		    // w.animate({transform:t2, duration:200});
		// });
		
		var zoomed_in = false;
		/*		
		// [0-1.5) no trans
		// (1.5-2.5) trans 1 subsize unit
		// (2.5-4) trans 2 subsize units
		*/
		var customTranslationDistance = function(coordPart, tileSize){
			var multiplyer = 0;
			var selectedTile = coordPart / tileSize;
// 			
			if(selectedTile < 1.5)
				multiplyer = 0;
// 				
			else if(selectedTile < 2.5)
				multiplyer = 1;
// 				
			else
				multiplyer = 2;
// 				
			return -1 * tileSize * multiplyer;
		};
		
		if(appNamespace.ui.PanAndZoom && appNamespace.ui.PanAndZoom.setup){
			appNamespace.ui.PanAndZoom.setup({
				container: gameBoard,
				zoom: {
					multiplyer: 2,
					state: {
						zoomedOut: true,
					},
					events: {
						zoomIn: ['doubletap'],
						zoomOut: ['doubletap']
					},
				}//,
				// pan: {
					// stepLength: ---,
					// pageLength: ---,
					// events: {
						// stepUp: [],
						// stepDown: [],
						// stepLeft: [],
						// stepRight: [],
						// pageUp: [],
						// pageDown: [],
						// pageLeft: [],
						// pageRight: []
					// } 	
				// }
			});
		}
	 
		// gameBoard.addEventListener('doubletap', function(_event)
		// {
			// var point = _event.source.convertPointToView({x:_event.x, y:_event.y}, this);
// 			
	        // if (!zoomed_in)
	        // {   
	        	// var xTrans, yTrans;
// 				
				// xTrans = customTranslationDistance(point.x, gridConfig.subSize);
				// yTrans = customTranslationDistance(point.y, gridConfig.subSize);
// 				
// 				
	        	// var tempTrans = Titanium.UI.create2DMatrix().scale(2.0).translate( xTrans, yTrans);
	        	// var tempAnim = Titanium.UI.createAnimation();
				// tempAnim.transform = tempTrans;
				// tempAnim.duration = 600;
// 				
				// this.animate(tempAnim);
// 	            
	        	// zoomed_in = !zoomed_in;
	        	// _event.consumed = true;
	        // }
		// });	
	 
		// gameBoard.addEventListener('doubletap', function(_event)
		// {		 
	        // if (!_event.consumed && zoomed_in)
	        // {   
	            // this.animate(animatePrimary);
// 	            
	        	// zoomed_in = !zoomed_in;
	        // }
		// });
		
		
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
		
		return gameView;
	};
	
})();
