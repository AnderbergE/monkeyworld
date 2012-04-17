/** @enum {string} */
var GameMode = {
	CHILD_PLAY: "Child Play",
	MONKEY_SEE: "Monkey See",
	MONKEY_DO: "Monkey Do",
	GUARDIAN_ANGEL: "Guardian Angel"
}

/**
 * @constructor
 */
function GameModule() {}
GameModule.prototype = new GameView();
/**
 * @param {Player} player
 * @param {EventManager} eventManager
 * @param {Object} config
 */
GameModule.prototype.play = function(player, eventManager, config) {
	this._eventManager = eventManager;
	player.strategies[this._name](this, eventManager, config);
};

/** @type {string} */
GameModule.prototype._name = "GameModule";

/** @type {GameMode} */
GameModule.prototype.mode = GameMode.CHILD_PLAY;
GameModule.prototype.getMode = function() { return this.mode; };
/** @param {GameMode} mode */
GameModule.prototype.setMode = function(mode) { this.mode = mode; };
