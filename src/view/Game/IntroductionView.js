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
		
		var mouseView = new MW.MouseAgentView();
		var mouse = mouseView.getBody(view, 100, 200);
		layer.add(mouse);
		mouseView.dance();
		mouse.setScale(0.7);
		
		var mouseView2 = new MW.MouseAgentView();
		var mouse2 = mouseView2.getBody(view, 300, 200);
		layer.add(mouse2);
		mouseView2.dance();
		mouse2.setScale(0.7);
		
		var mouseView3 = new MW.MouseAgentView();
		var mouse3 = mouseView3.getBody(view, 500, 200);
		layer.add(mouse3);
		mouseView3.dance();
		mouse3.setScale(0.7);

		var mouseView4 = new MW.MouseAgentView();
		var mouse4 = mouseView4.getBody(view, 700, 200);
		layer.add(mouse4);
		mouseView4.dance();
		mouse4.setScale(0.7);	

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
