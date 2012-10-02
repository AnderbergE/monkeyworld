
MW.MinigameConfiguration = (function() {
	
	/** @enum {Object} */
	var collection = {
		/** @enum {Object} */
		ELEVATOR: {
			ELEVATOR: {
				game: MW.ElevatorMinigame,
				view: MW.BirdTreeView,
				title: "Bird Tree Game"
			}
		},
		LADDER: {
			TREE: {
				game: MW.LadderMinigame,
				view: MW.TreeView,
				title: "Tree Game"
			},
			MOUNTAIN: {
				game: MW.LadderMinigame,
				view: MW.MountainView,
				title: "Mountain Game"
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
