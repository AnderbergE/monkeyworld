// To prevent SoundJS producing error message. Bug in SoundJS compilation?
SoundJS.testAudioStall = function(event) {};

window.onload = function() {
	new Game();
	
	
};

/**
 * @constructor
 */
function Game() {
	
	//var fishingGame = new FishingGame();
	
	//fishingGame.play(monkeyPlayer, eventManager);
	
	/** @const */ var WIN_WIDTH = 1024;
	/** @const */ var WIN_HEIGHT = 768;
	var stage = new Kinetic.Stage({
        container: 'container',
        width: WIN_WIDTH,
        height: WIN_HEIGHT
    });
	
	var subtitleLayer = new Kinetic.Layer({
        width: WIN_WIDTH,
        height: WIN_HEIGHT
	});

	stage.add(subtitleLayer);
	stage._subtitleLayer = subtitleLayer;
	
	var eventManager = new EventManager(subtitleLayer);
	
	/**
	 * @param iView
	 * @param iModel
	 * @param config
	 * @param {Function=} callback
	 */
	function kickInModule(iView, iModel, player, config, callback) {
		var view = new iView(eventManager, stage, this, callback);
		var model = new Model(eventManager, view, view.init, view.start, iModel, config, player);
		view.prepare(model, model.init);
	};


	/*
	 * ONLY_FISHING = true will start the fishing game immediately. If it
	 * is set to false, the game will start from the beginning (i.e. like
	 * it is supposed to do in a live setting.
	 */
	/** @const */ var ONLY_FISHING = true;
	
	var player = new GamerPlayer(eventManager);
	
	if (ONLY_FISHING) {
		kickInModule(FishingView, FishingGame, player, {maxNumber: 9, numberFishes: 5});
	} else {
		kickInModule(StartView, Start, {}, function(config) {
			if (config == "login") {
				kickInModule(LoginView, Intro, {}, function() {
					kickInModule(FishingView, FishingGame, player, {maxNumber: 9, numberFishes: 5});
				});	
			} else {
				kickInModule(NewPlayerView, NewPlayer, {}, function() {
					kickInModule(IntroView, Intro, {}, function() {
						kickInModule(FishingView, FishingGame, player, {maxNumber: 9, numberFishes: 5});	
					});
				});	
			}
		});
	}
}

