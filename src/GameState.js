/** @constructor */
function GameState() {
	
	var bananas = 0;
	var currentSeeRound = 1;
	var currentDoRound = 1;
	var maxSeeRounds = 1;
	var maxDoRounds = maxSeeRounds ;
	var mode = GameMode.MONKEY_SEE;
	var results = new Array();
	
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
}
