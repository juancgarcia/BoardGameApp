
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
		
		if(appNamespace.ui.PanAndZoom && appNamespace.ui.PanAndZoom.setup){
			appNamespace.ui.PanAndZoom.setup({
				container: gameBoard,
				zoom: {
					multiplyer: 2,
					translationFunc: customTranslationDistance,
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
		
		//test draggable implementation
		
		var ontouchmoveCallback = function (_event) {
			var point;
			if(_event && _event.source) {
				point = _event.source.convertPointToView({x: _event.x, y: _event.y}, this);
				Ti.API.log('DEBUG','TouchMove! '+'x: '+point.x+', y: '+point.y);
			}
			//Ti.API.log('DEBUG','TouchMove!');
		};
		
		gameBoard.addEventListener('touchmove', ontouchmoveCallback);
		
		
		
		var tapCallback = function (_event) {
			Ti.API.log('DEBUG','Tap!!');
		};
		
		gameBoard.addEventListener('singletap', tapCallback);
		
		return gameView;
	};
	
})();
