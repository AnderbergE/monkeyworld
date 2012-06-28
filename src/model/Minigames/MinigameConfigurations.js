
MW.MinigameConfiguration = (function() {
	
	/** @enum {Object} */
	var collection = {
		/** @enum {Object} */
		LADDER: {
			TREE: {
				game: Ladder,
				view: TreeView,
				title: "Tree Game"
			},
			MOUNTAIN: {
				game: Ladder,
				view: MountainView,
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
		k.sum = function() { return i; };
	}
	
	return collection;
})();
