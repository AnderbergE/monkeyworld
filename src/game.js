window.onload = function() {

	
	
	new Game();
};

/**
 * @constructor
 */
function Game() {
	var eventManager = new EventManager();
	/** @const */ var WIN_WIDTH = 1024;
	/** @const */ var WIN_HEIGHT = 768;
	var stage = new Kinetic.Stage("container", WIN_WIDTH, WIN_HEIGHT);

	
	/**
	 * @param iView
	 * @param iModel
	 * @param config
	 * @param {Function=} callback
	 */
	function kickInModule(iView, iModel, config, callback) {
		var view = new iView(eventManager, stage, this, callback);
		var model = new Model(eventManager, view, view.init, view.start, iModel, config);
		view.prepare(model, model.init);
	};

	
	soundManager.onready(function() {
		console.log("SOUND: SoundManager2 done, starting rest of game...");

		/*
		 * ONLY_FISHING = true will start the fishing game immediately. If it
		 * is set to false, the game will start from the beginning (i.e. like
		 * it is supposed to do in a live setting.
		 */
		/** @const */ var ONLY_FISHING = true;
		
		
		if (ONLY_FISHING) {
			kickInModule(FishingView, FishTank, {maxNumber: 9, numberFishes: 5});
		} else {
			kickInModule(StartView, Start, {}, function(config) {
				if (config == "login") {
					kickInModule(LoginView, Intro, {}, function() {
						kickInModule(FishingView, FishTank, {maxNumber: 9, numberFishes: 5});
					});	
				} else {
					kickInModule(NewPlayerView, NewPlayer, {}, function() {
						kickInModule(IntroView, Intro, {}, function() {
							kickInModule(FishingView, FishTank, {maxNumber: 9, numberFishes: 5});	
						});
					});	
				}
			});
		}
	});
}

