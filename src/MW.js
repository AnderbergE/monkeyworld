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

/**
 * This will silent Google Closure's verbose warnings about the extend function
 * in Resig's inheritance construct not being defined for sub classes (which it
 * is).
 *
 * Probably, this works because the "missingProperties" warning is defined like
 * this:
 *
 *   "Warnings about whether a property will ever be defined
 *    on an object. Part of type-checking."
 *          -- http://code.google.com/p/closure-compiler/wiki/Warnings
 *
 * And by having this function it _can_ be defined, thus the warning may not
 * be raised.
 */
(function () {
	function silentClosure(tmp) {
		tmp.extend = Class.extend;
	}
})();

