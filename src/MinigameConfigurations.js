
MW.MinigameConfiguration = (function() {
	
	/** @enum {Object} */
	var collection = {
		/** @enum {Object} */
		ELEVATOR: {
			ELEVATOR_6_w: {
				game: MW.ElevatorMinigame,
				view: MW.BirdTreeView,
				title: "Bird hero 1",
				difficulty: 6,
				useAgent: true
			},
			
			ELEVATOR_6_wo: {
				game: MW.ElevatorMinigame,
				view: MW.BirdTreeView,
				title: "Bird hero 1 solo",
				difficulty: 6,
				useAgent: false
			},
			
			ELEVATOR_8_w: {
				game: MW.ElevatorMinigame,
				view: MW.BirdTreeView,
				title: "Bird hero 2",
				difficulty: 8,
				useAgent: true
			},
			
			ELEVATOR_8_wo: {
				game: MW.ElevatorMinigame,
				view: MW.BirdTreeView,
				title: "Bird hero 2 solo",
				difficulty: 8,
				useAgent: false
			},
			
			ELEVATOR_10_w: {
				game: MW.ElevatorMinigame,
				view: MW.BirdTreeView,
				title: "Bird hero 3",
				difficulty: 10,
				useAgent: true
			},
			
			ELEVATOR_10_wo: {
				game: MW.ElevatorMinigame,
				view: MW.BirdTreeView,
				title: "Bird hero 3 solo",
				difficulty: 10,
				useAgent: false
			}
		}
	};
	
	for (var key in collection) {
		var i = 0;
		var k = collection[key];
		var arr = new Array();
		for (var ley in k) {
			arr.push(k[ley]); 
			k[ley].category = k;
			i++;
		}
		k.variations = arr;
		k.sum = i;
	}
	return collection;
})();
