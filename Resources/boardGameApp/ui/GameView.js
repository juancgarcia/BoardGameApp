
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
			}),
			
			dragToken = Ti.UI.createView({
				backgroundColor:'#0b0'
			}),
			
			dropSpot = Ti.UI.createView({
				backgroundColor:'#00b'
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
		
		
		gameBoard.add(dropSpot);
		dropSpot.width = dropSpot.height = 80;
		dropSpot.right = 20;
		dropSpot.bottom = 20;		
		
		gameBoard.add(dragToken);		
		dragToken.width = dragToken.height = 50;
		dragToken.left = 20;//-1 ( gameBoard.width / 2) -
		dragToken.top = 20;
		
		
		
		//var puzzleGrid = Grid.createGrid(gridConfig);
	
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
		
		var dragging = false,
			coord = {
				touchStart: {
					x: null,
					y: null
				},
				touchMove: {
					x: null,
					y: null
				},
				draggableStart: {
					x: null,
					y: null
				},
				draggableMove: {
					x: null,
					y: null
				}				
			},
			skip = 2,
			skipItr = 0;
		
		var dragTouchStart = function(draggable, contextPoint){			
			dragging = true;
			
			if(coord.draggableMove.x === null || coord.draggableMove.y === null){				
				coord.draggableStart = {
					x: draggable.top,
					y: draggable.left
				};
			} else {
				coord.draggableStart.x = coord.draggableMove.x;
				coord.draggableStart.y = coord.draggableMove.y;
			}
			coord.touchStart = {
				x: contextPoint.x,
				y: contextPoint.y
			};
		};
		
		var dragTouchMove = function(draggable, contextPoint){
			if(skipItr < skip){
				skipItr++;
				return;
			} else {
				skipItr = 0;
			}
			
			coord.touchMove = {
				x: contextPoint.x,
				y: contextPoint.y
			};

			diff = {dx: contextPoint.x - coord.touchStart.x, dy: contextPoint.y - coord.touchStart.y};
			
			//draggable.left = coord.draggableStart.x + diff.dx;
			//draggable.top = coord.draggableStart.y + diff.dy;
			
			coord.draggableMove = {
				x: coord.draggableStart.x + diff.dx,
				y: coord.draggableStart.y + diff.dy
			};
			
			draggable.animate({
				left: coord.draggableMove.x,
				top: coord.draggableMove.y,
				duration:1
			});			
		};
		
		var dragTouchEnd = function(draggable, contextPoint){
			dragging = false;
		};
		
		var drag = function(_event){
			// movement is based on diff between outercontext and lastXY
			// assuming top,left as origin 0,0
			var point = _event.source.convertPointToView({x: _event.x, y: _event.y}, gameBoard);
			var draggable = this;
			var diff;
			 
			switch(_event.type){
				case 'touchstart':
					if(!dragging){
						dragTouchStart(draggable, point);
					}
					break;
					
				case 'touchmove':
					if(dragging){
						dragTouchMove(draggable, point);
					}
					break;
					
				case 'touchend':
				case 'touchcancel':
					dragTouchEnd(draggable, point);
					break;
			}
			Ti.API.debug(_event.type+' - '+this.name+' { x: '+point.x+', y: '+point.y+' }');
		};
		
		var ontouchmoveCallback = function (_event) {
			var point, name;
			if(_event && _event.source && !_event.handled) {
				point = _event.source.convertPointToView({x: _event.x, y: _event.y}, gameBoard);
				
				drag(this,_event, point);
				
				if(this.name)
					name = this.name;
				Ti.API.debug('TouchMove! ('+name+')'+'x: '+point.x+', y: '+point.y);
				_event.handled = true;
			}
			//Ti.API.debug('TouchMove!');
		};
		
		var tapCallback = function (_event) {
			var name = '';
			if(this.name)
				name = this.name;
			Ti.API.debug('Tap!! ('+name+')');
		};
		
		dragToken.name = 'DragToken';
		dragToken.addEventListener('touchstart', drag, false);
		dragToken.addEventListener('touchmove', drag, false);
		dragToken.addEventListener('touchend', drag, false);
		dragToken.addEventListener('touchcancel', drag, false);
		//dragToken.addEventListener('singletap', tapCallback);
		
		gameBoard.name = 'GameBoard';
		//gameBoard.addEventListener('touchmove', ontouchmoveCallback);
		//gameBoard.addEventListener('singletap', tapCallback);
		
		return gameView;
	};
	
})();
