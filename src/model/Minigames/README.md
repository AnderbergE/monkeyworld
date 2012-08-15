Minigames
=========

A minigame can be seen as a plugin to the game engine, and must therefore
follow some rules to work.

Overall structure
-----------------
The minigame should be divided in two separate parts: The _model_ and the
_view_. The model part should contain all the game logic, and unit tests should
be able to test the functions of the minigame by only using the model and listen
to the event it broadcasts. The view on the other hand should contain no game
logic at all, but simply listen to events being broadcasted from the model, and
update the graphics accordingly.

For a minigame called MyMinigame, two files should be created:

* /src/model/Minigames/MyMinigame/MyMinigame.js
* /src/view/Minigames/MyMinigame/MyMinigameView.js

Then edit the file /src/model/Minigames/MinigameConfiguration.js to make the
engine able to recognize the new minigame.

Model
-----
The basic skeleton for the model file is:

    /**
     * @constructor
     * @extends {MW.Minigame}
     */
    MW.MyMinigame = function () {
    	"use strict";
    	Minigame.call(this, "MyMinigame");
    	// attributes

    	this.addSetup(function () {
    		// performed before minigame starts, lika a constructor
    	});

    	this.addTeardown(function () {
     		// performed when minigame ends
     	});
     
     	this.start = function () {
     		// called when the minigame starts
     	};
     }


View
----

