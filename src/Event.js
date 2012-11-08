/**
 * @enum {string}
 */
MW.Event = {
	MINIGAME_INITIATED:	"miniGameInitiated",
	MINIGAME_STARTED:	"miniGameStarted",
	MINIGAME_ENDED:		"miniGameDone",
	
	START_MINIGAME:		"START_MINIGAME",
	END_MINIGAME:		"END_MINIGAME",
	
	/* {Number} */
	PLACE_TARGET:		"PLACE_TARGET",
	TARGET_IS_PLACED:	"TARGET_IS_PLACED",
	/* {number: {Number}, tooHigh: {Boolean}, tooLow: {Boolean}} */
	PICKED_TARGET:		"PICKED_TARGET",
	ROUND_DONE:			"ROUND_DONE",
	
	/* {Boolean} */
	BUTTON_PUSH_NUMBER:	"BUTTON_PUSH_NUMBER",
	/* {Number} */
	BUTTON_PUSH_BOOL:	"BUTTON_PUSH_BOOL",
	BUTTON_PUSH_HELP:	"BUTTON_PUSH_HELP",
	/* {Boolean} */
	LOCK_BUTTONS:		"LOCK_BUTTONS",
	
	INTRODUCE_AGENT:	"INTRODUCE_AGENT",
	START_AGENT:		"START_AGENT",
	/* {number: {Number}, confidence: {Number}} */
	AGENT_CHOICE:		"AGENT_CHOICE",
	CORRECT_AGENT:		"CORRECT_AGENT",
	
	PRINT_LOG:			"PRINT_LOG",
	TRIGGER_FPS:		"TRIGGER_FPS"
};
