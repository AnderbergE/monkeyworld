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
		var logger = this;
		
		
		/**
		 * Listen to button pushes.
		 */
		this.on('BUTTON_PUSHED', function (vars) {
			if (vars.number === undefined) {
				/* agent was correct/incorrect */
				if (vars.bool) {
				} else {
				}
			} else {
			}
		});
		
		/**
		 * Player or agent has picked a number.
		 * @param {Hash} vars
		 * @param {Number} vars.number - the chosen number
		 */
		this.on(MW.Event.MG_LADDER_PICKED, function (vars) {
			if (vars.number) {
			} else {
			}
		});
		
		/**
		 * Start new round.
		 */
		this.on('ROUND_DONE', function (vars) {
			nextRound();
		});
		
		/**
		 * Start new round.
		 */
		this.on(MW.Event.MG_ELEVATOR_TARGET_IS_PLACED, function () {
			
		});
		
		this.on('QUIT', function () {
			
		});
	}
});
