
(function() {
	var platformWidth = Ti.Platform.displayCaps.platformWidth;
	
	//create the main application window
	appNamespace.ui.createApplicationWindow = function(_args) {
		var win = Ti.UI.createWindow(appNamespace.combine($$.Window,{
			exitOnClose:true,
			orientationModes:[
				Titanium.UI.PORTRAIT,
				Titanium.UI.LANDSCAPE_LEFT,
				Titanium.UI.LANDSCAPE_RIGHT,
				Titanium.UI.UPSIDE_PORTRAIT
			]
		})),
		headerView = Ti.UI.createView(appNamespace.combine($$.headerView,{top:0}));
		
		//create 'drawer' view to show drill-down data
		//var drawer = appNamespace.ui.createDrawerView();
		var game = appNamespace.ui.createGameView();
		
		//create a loading view which we can show on long data loads
		var loader = appNamespace.ui.createLoadingView();
		
		//assemble main app window
		win.add(headerView);
		//win.add(drawer);
		win.add(game);
		win.add(loader);
		
		//Ti.App.fireEvent('app:show.drawer', {showing:'gameBoard'});

		return win;
	};
})();