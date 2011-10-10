
(function() {
	appNamespace.ui.createDrawerView = function(_args) {
		var drawerView = Ti.UI.createView(appNamespace.combine($$.stretch,{
			visible:false
		})),
		backdrop = Ti.UI.createView(appNamespace.combine($$.stretch, {
			backgroundColor:'#787878',
			opacity:0.85
		})),
		drawer = Ti.UI.createView({
			top:30,
			bottom:30,
			left:$$.platformWidth-10,
			width:$$.platformWidth,
			borderRadius:10,
			backgroundColor:'#efefef',
			//gradient will only work on iOS
			backgroundGradient:{
				type:'linear',
				colors:[
					{color:'#efefef',position:0.0},
					{color:'#cdcdcd',position:0.50},
					{color:'#efefef',position:1.0}
				]
			}
		}),
		closeView = Ti.UI.createView({
			width:15,
			borderRadius:10,
			backgroundColor:appNamespace.ui.theme.darkBlue,
			left:0,
			top:0,
			bottom:0
		}),
		arrow = Ti.UI.createImageView({
			image:'images/arrow_details.png',
			height:'auto',
			width:'auto',
			left:2,
			right:2
		});
		
		drawerView.add(backdrop);
		drawerView.add(drawer);
		closeView.add(arrow);
		drawer.add(closeView);
		
		//Add necessary drawer views
		var stack = appNamespace.ui.createStackView({
			views: [
				//appNamespace.ui.createAddAccountView(),
				//appNamespace.ui.createTweetDetailsView(),
				//appNamespace.ui.createAccountDetailsView()
				appNamespace.ui.createGameView()
			],
			props: {
				top:10,
				left:25,
				right:20,
				bottom:10
			}
		});
		
		drawer.add(stack);
		
		//add logic to manage the state of the drawer
		Ti.App.addEventListener('app:show.drawer', function(e) {
			drawerView.visible = true;
			
			//determine which view to show in the drawer
			// if (e.showing === 'createAccount') {
				// stack.fireEvent('changeIndex',{idx:0});
			// }
			// else if (e.showing === 'tweetDetails') {
				// stack.fireEvent('changeIndex',{idx:1});
			// }
			// else if (e.showing === 'accountDetails') {
				// stack.fireEvent('changeIndex',{idx:2});
			// }
			/*else*/ if (e.showing === 'gameBoard') {
				stack.fireEvent('changeIndex', {idx:0});
			}
			
			drawer.animate({
				duration:$$.animationDuration,
				left:10
			}, function() {
				Ti.App.fireEvent('app:drawer.opened');
			});
		});
		
		Ti.App.addEventListener('app:hide.drawer', function(e) {
			drawer.animate({
				duration:$$.animationDuration,
				left:$$.platformWidth-10
			}, function() {
				drawerView.visible = false;
			});
		});
		
		//clicking in the backdrop or arrow should hide also
		backdrop.addEventListener('click', function() { Ti.App.fireEvent('app:hide.drawer'); });
		closeView.addEventListener('click', function() { Ti.App.fireEvent('app:hide.drawer'); });
		
		return drawerView;
	};
})();