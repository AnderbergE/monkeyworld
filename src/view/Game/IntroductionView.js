/**
 * @constructor
 * @extends {ViewModule}
 */
MW.IntroductionView = function (callback) {
	ViewModule.call(this, "IntroductionView");
	var
		view = this,
		stage,
		layer;

	view.addSetup(function () {
		stage = view.getStage();
		layer = new Kinetic.Layer();
		stage.add(layer);
		
		//layer.add(new Kinetic.Rect({width:200,height:200,fill:"blue"}));

		view.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_1); }, 2000);
		view.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_2); }, 2000);
		view.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_3); }, 7000);
		view.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_4); }, 7000);
		view.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_5); }, 12000);
		view.setTimeout(function () { callback(); }, 14000);
	});

	view.addTearDown(function () {
		stage.remove(layer);
	});

	view.on(MW.Event.FRAME, function (msg) {
		layer.draw();
	});
};
