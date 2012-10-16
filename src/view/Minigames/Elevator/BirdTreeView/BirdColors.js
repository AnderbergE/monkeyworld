var BirdColors;

/**
 * Set a list of colors for the birds.
 * @param {Number} nbrOfColors - the amount of colors to pick from
 */
MW.BirdColorSetup = function (nbrOfColors) {
	BirdColors = new Array();
	/* The idea here is that the different birds' images have names with a color
	 * in them, so you switch image by changing the name of it. */
	/*
	var colorNames = {'purple', 'blue'}
	MW.BirdColors.push(Random colorNames value);
	Then read the value and choose picture in the different view objects.
	*/
	
	c = function () {
		return '#'+((1<<24)*(Math.random()+1)|0).toString(16).substr(1);
	}
	
	for (var i = 0; i < nbrOfColors; i++) {
		BirdColors.push(c());
	}
}

/**
 * Get a color from the list.
 * @public
 * @param {Number} number - the color place in the list (1-nbrOfColors)
 * @return {String} - the color
 */
MW.BirdColorGet = function (number) {
	if (number <= 0 || number > BirdColors.length) {
		throw "Array out of bounds exception";
	}
	return BirdColors[number - 1];
}