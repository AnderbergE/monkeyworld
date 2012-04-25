$(document).ready(function(){

	var evm = new GameEventManager();
	var gameState = new GameState();
	

	module("Fishing Game", {
		setup: function() {
			evm.on("FishingGame.catch", function(msg) { msg.done(); }, "test");
			evm.on("FishingGame.free", function(msg) { msg.done(); }, "test");
		},
		teardown: function() {
			evm.forget("test");
		}
	});

	
	test("Number of fish", function() {
		var data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 123, 500, 1232, 6050];
		for (var i = 0; i < data.length; i++) {
			var fg = new FishingGame(evm, gameState, { maxNumber: 9, numberFishes: data[i], numberCorrect: 0});
			equal(fg.getNumberOfFish(), data[i]);
		}
	});

	test("Catch one correct fish", function() {
		var gfg = new FishingGame(evm, gameState, { maxNumber: 21, numberFishes: 565, numberCorrect: 200});
		var correctFish = gfg.getOneCorrectFish();
		gfg.catchFish(correctFish);
		var basket = gfg.getBasket();
		equal(basket[0].toString(), correctFish.toString());
	});
	
	test("Catch many correct fish", function() {
		var FISH_TO_CATCH = 200;
		var gfg = new FishingGame(evm, gameState, { maxNumber: 21, numberFishes: 565, numberCorrect: FISH_TO_CATCH});
		var correct = new Array();
		for (var i = 0; i < FISH_TO_CATCH; i++) {
			var fish = gfg.getOneCorrectFish();
			correct.push(fish);
			gfg.catchFish(fish);
		}
		var basket = gfg.getBasket();
		for (var i = 0; i < FISH_TO_CATCH; i++) {
			equal(basket[i].toString(), correct[i].toString());	
		}
	});
	
	test("Catch one incorrect fish", function() {
		var gfg = new FishingGame(evm, gameState, { maxNumber: 21, numberFishes: 565, numberCorrect: 200});
		var incorrectFish = gfg.getOneIncorrectFish();
		gfg.catchFish(incorrectFish);
		var basket = gfg.getBasket();
		equal(basket[0].toString(), incorrectFish.toString());
	});
	
	test("Catch many incorrect fish", function() {
		var FISH_TO_CATCH = 200;
		var gfg = new FishingGame(evm, gameState, { maxNumber: 21, numberFishes: 565, numberCorrect: FISH_TO_CATCH});
		var incorrect = new Array();
		for (var i = 0; i < FISH_TO_CATCH; i++) {
			var fish = gfg.getOneIncorrectFish();
			incorrect.push(fish);
			gfg.catchFish(fish);
		}
		var basket = gfg.getBasket();
		for (var i = 0; i < FISH_TO_CATCH; i++) {
			equal(basket[i].toString(), incorrect[i].toString());	
		}
	});
	
	test("Catch different fish in different order", function() {
		var caught = new Array();
		var CORRECT_NUMBER = 5;
		var data =
			[true, false, true, true, true, false, false, false, true, true,
			 false, false, true, false, false, true, true, true, false, false,
			 false, false, false, false, true, true, true, true, false, false];
		var numCorrect = 0;
		var numIncorrect = 0;
		for (var i = 0; i < data.length; i++) {
			if (data[i]) numCorrect++; else numIncorrect++;
		};
		
		var gfg = new FishingGame(evm, gameState, { maxNumber: 21, targetNumber: CORRECT_NUMBER, numberFishes: numCorrect + numIncorrect, numberCorrect: numCorrect});
		for (var i = 0; i < numCorrect + numIncorrect; i++) {
			var fish = (data[i] ? gfg.getOneCorrectFish() : gfg.getOneIncorrectFish());
			caught.push(fish);
			gfg.catchFish(fish);
		}
		var basket = gfg.getBasket();
		for (var i = 0; i <  numCorrect + numIncorrect; i++) {
			if (data[i])
				equal(basket[i].getTargetNumber(), CORRECT_NUMBER);
			else
				notEqual(basket[i].getTargetNumber(), CORRECT_NUMBER);
			equal(basket[i].toString(), caught[i].toString());
		};
	});
	
	test("Catch and free one fish", function() {
		var caught = new Array();
		var CORRECT_NUMBER = 5;
		var gfg = new FishingGame(evm, gameState, { maxNumber: 21, targetNumber: CORRECT_NUMBER, numberFishes: 50, numberCorrect: 10});
		var fish = gfg.getOneCorrectFish();
		gfg.catchFish(fish);
		var basket = gfg.getBasket();
		equal(basket[0].toString(), fish.toString());
		equal(gfg.getOneCorrectlyCapturedFish().toString(), fish.toString());
		gfg.freeFish(fish);
		equal(basket[0], undefined);
		equal(gfg.getOneCorrectlyCapturedFish(), null);
	});
	
	test("Catch and free fish in different order", function() {
		var TARGET_NUMBER = 5;
		var NUMBER_CORRECT = 5;
		var NUMBER_INCORRECT = 5;
		var numberTotal = NUMBER_CORRECT + NUMBER_INCORRECT;
		var gfg = new FishingGame(evm, gameState, {
			maxNumber: 21,
			targetNumber: TARGET_NUMBER,
			numberFishes: numberTotal,
			numberCorrect: NUMBER_CORRECT
		});
		var basket = gfg.getBasket();
		var correct1 = gfg.getOneCorrectFish();
		gfg.catchFish(correct1);
		equal(gfg.getOneCorrectlyCapturedFish().toString(), correct1.toString());
		
		var correct2 = gfg.getOneCorrectFish();
		gfg.catchFish(correct2);
		equal(basket[1].toString(), correct2.toString());
		
		var correct3 = gfg.getOneCorrectFish();
		gfg.catchFish(correct3);
		equal(basket[2].toString(), correct3.toString());
		
		var correct4 = gfg.getOneCorrectFish();
		
		var incorrect1 = gfg.getOneIncorrectFish();
		gfg.catchFish(incorrect1);
		equal(basket[3].toString(), incorrect1.toString());
		
		var incorrect2 = gfg.getOneIncorrectFish();
		gfg.catchFish(incorrect2);
		equal(basket[4].toString(), incorrect2.toString());
		
		var incorrect3 = gfg.getOneIncorrectFish();
		gfg.catchFish(incorrect3);
		equal(basket[5].toString(), incorrect3.toString());
		
		gfg.freeFish(correct1);
		equal(basket[0], null);
		
		gfg.freeFish(correct2);
		equal(basket[1], null);
		
		gfg.freeFish(incorrect2);
		equal(basket[4], null);
		
		gfg.catchFish(correct4);
		equal(basket[0], correct4.toString());
		
		gfg.freeFish(correct3);
		equal(basket[2], null);
		
		gfg.catchFish(incorrect2);
		equal(basket[1], incorrect2.toString());
		
		gfg.freeFish(incorrect2);
		equal(basket[1], null);

		gfg.catchFish(incorrect2);
		equal(basket[1], incorrect2.toString());
		
		gfg.freeFish(incorrect2);
		equal(basket[1], null);

		gfg.catchFish(incorrect2);
		equal(basket[1], incorrect2.toString());
		
		gfg.freeFish(incorrect2);
		equal(basket[1], null);

		gfg.catchFish(incorrect2);
		equal(basket[1], incorrect2.toString());
		
	});

});