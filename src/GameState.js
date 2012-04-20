/** @constructor */
function GameState() {
	
	var bananas = 0;
	var currentSeeRound = 1;
	var currentDoRound = 1;
	var maxSeeRounds = 1;
	var maxDoRounds = maxSeeRounds;
	
	var maxBeforeHelp = 1;
	var currentRoundWithoutHelp = 1;
	
	var mode = GameMode.CHILD_PLAY;
	var results = new Array();
	var _madeMistake = false;
	
	this.resetHelpRounds = function() {
		currentRoundWithoutHelp = 1;
	};
	
	this.resetMonekyRounds = function() {
		results = new Array();
		currentSeeRound = 1;
		currentDoRound = 1;
	};
	
	this.addNoHelpRound = function() {
		currentRoundWithoutHelp++;
	};
	
	this.timeForHelp = function() {
		return currentRoundWithoutHelp >= maxBeforeHelp;
	};
	
	this.firstRoundWithoutHelp = function() {
		return currentRoundWithoutHelp == 1;
	};
	
	this.getMaxMonkeySeeRounds = function() {
		return maxSeeRounds;
	};
	
	this.getMaxMonkeyDoRounds = function() {
		return maxDoRounds;
	};
	
	this.pushResult = function(result) {
		results.push(result);
	};
	
	this.getResults = function() {
		return results;
	};
	
	this.clearResults = function() {
		results = new Array();
	};
	
	this.addBanana = function() {
		Log.debug("Adding banana", "game");
		bananas++;
	};
	
	this.addMonkeySeeRound = function() {
		currentSeeRound++;
	};
	
	this.getMonkeySeeRounds = function() {
		return currentSeeRound;
	};
	
	this.addMonkeyDoRound = function() {
		currentDoRound++;
	};
	
	this.getMonkeyDoRounds = function() {
		return currentDoRound;
	};
	
	this.setMode = function(imode) {
		mode = imode;
	};
	
	this.getMode = function() {
		return mode;
	};
	
	this.getBananas = function() {
		return bananas;
	};
	
	/**
	 * Tells the system that the player has done a mistake during the game play.
	 */
	this.reportMistake = function() {
		_madeMistake = true;
	};
	
	/**
	 * Checks if the player has done something considered a mistake during
	 * the game play.
	 * 
	 * @return {boolean} true if a mistake was made by the player
	 */
	this.madeMistake = function() {
		return _madeMistake;
	};
}
