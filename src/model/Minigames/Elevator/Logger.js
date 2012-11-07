/**
 * @constructor
 * @extends {MW.Minigame}
 */
MW.Logger = MW.GlobalObject.extend(
/** @lends {MW.Logger.prototype} */
{
	/**
	 * @constructs
	 * @param {MW.Game} parent
	 */
	init: function (parent) {
		this._super("Logger");
		var logger = this,
			log = "";
		
		if (typeof(Storage) === "undefined") {
			window.alert("This browser doesn't support local storage, " +
				"you need to get to the modern ages, download another.");
		}
		if (localStorage.participant === undefined) {
				localStorage.participant = 0;
			}
		if (localStorage.log === undefined) {
			localStorage.log = "";
		}
		
		
		function addLog (e, param) {
			localStorage.log += Date.now() + "," + e +
				(param !== undefined ? "," + param : "") + "<br>";
		}
		
		function printLog () {
			var newWindow = window.open();
			newWindow.document.write("<p>" + localStorage.log + "</p>");
		}
		
		
		this.on(MW.Event.BUTTON_PUSH_NUMBER, function (number) {
			addLog(MW.Event.BUTTON_PUSH_NUMBER, number);
		});
		
		this.on(MW.Event.BUTTON_PUSH_BOOL, function (bool) {
			addLog(MW.Event.BUTTON_PUSH_BOOL, bool ? "yes" : "no");
		});
		
		
		this.on(MW.Event.PLACE_TARGET, function (number) {
			addLog(MW.Event.PLACE_TARGET, number);
		});
		
		this.on(MW.Event.TARGET_IS_PLACED, function () {
			addLog(MW.Event.TARGET_IS_PLACED);
		});
		
		this.on(MW.Event.PICKED_TARGET, function (vars) {
			addLog(MW.Event.PICKED_TARGET, vars.number.toString() +
				(vars.tooLow || vars.tooHigh ? ",wrong" : ",right"));
		});
		
		this.on(MW.Event.ROUND_DONE, function () {
			addLog(MW.Event.ROUND_DONE);
		});
		
		
		this.on(MW.Event.INTRODUCE_AGENT, function () {
			addLog(MW.Event.INTRODUCE_AGENT);
		});
		
		this.on(MW.Event.START_AGENT, function () {
			addLog(MW.Event.START_AGENT);
		});
		
		this.on(MW.Event.AGENT_CHOICE, function (vars) {
			addLog(MW.Event.AGENT_CHOICE, vars.number + "," + vars.confidence);
		});
		
		
		this.on(MW.Event.START_MINIGAME, function () {
			localStorage.participant = parseInt(localStorage.participant) + 1;
			addLog(MW.Event.START_MINIGAME,
				"participant" + localStorage.participant);
		});
		
		this.on(MW.Event.MINIGAME_ENDED, function () {
			addLog(MW.Event.MINIGAME_ENDED);
			localStorage.log += "<br>";
		});
		
		this.on(MW.Event.PRINT_LOG, function () {
			printLog();
		});
	}
});
