/**
 * @constructor
 */
function Model(ieventManager, iview, iviewInit, iviewStart, iModel, iconfig) {
	
	var myModel = iModel;
	var view = iview;
	var viewInit = iviewInit;
	var viewStart = iviewStart;
	var evm = ieventManager;
	var config = iconfig;

	this.init = function() {
		evm.log('MODEL: Creating model...');
		var m = new myModel(evm);
		evm.log('MODEL: Initiating model...');
		var viewConfig = m.init(config);
		viewInit.call(view, viewConfig, m);
		viewStart.call(view);
	};
}