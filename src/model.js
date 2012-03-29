/**
 * @constructor
 */
function Model(ieventManager, iview, iviewInit, iviewStart, iModel, iconfig, iplayer, istage) {
	
	var myModel = iModel;
	var view = iview;
	var viewInit = iviewInit;
	var viewStart = iviewStart;
	var evm = ieventManager;
	var config = iconfig;
	var player = iplayer;
	var stage = istage;

	this.init = function() {
		Log.debug("Creating model...", "model");
		var m = new myModel(evm);
		m.play(player, evm);
		Log.debug("Initiating model...", "model");
		var viewConfig = m.init(config);
		viewInit.call(view, viewConfig, m);
		evm.tell("view.initiated");
		viewStart.call(view);
	};
}