var MW = {};

Kinetic.MW = {};
MW.resPath = "../res"

/** @enum {string} */
MW.Language = {
	SWEDISH: "sv",
	ENGLISH: "en"
}; 

/**
 * @enum {string}
 */
MW.GameMode = {
	CHILD_PLAY: "Child Play",
	AGENT_SEE: "Monkey See",
	AGENT_DO: "Monkey Do"
};

MW.GlobalSettings = {
	/** @type {MW.Language} */ language: MW.Language.ENGLISH,
	/** @type {boolean}     */ debug:    false,
        /** @type {boolean}     */ testing:  false
};

