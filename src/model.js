/**
 * @constructor
 */
function Model(ieventManager, iview, iviewInit, iviewStart, iModel, iconfig, iplayer) {

	var myModel = iModel;
	var view = iview;
	var viewInit = iviewInit;
	var viewStart = iviewStart;
	var evm = ieventManager;
	var config = iconfig;
	var player = iplayer;
	var model = null;

	this.init = function() {
		Log.debug("Creating model...", "model");
		model = new myModel(evm);
		if (player != null)
			model.play(player, evm);
		Log.debug("Initiating model...", "model");
		var viewConfig = model.init(config);
		viewInit.call(view, viewConfig, model);
		evm.tell("view.initiated");
		viewStart.call(view);
		model.start();
	};
}