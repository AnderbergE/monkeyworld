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

Configuration File:
-------------------
In `/src/model/Minigames/MinigameConfiguration.js`:

    /** @enum {Object} */
    var collection = {
    /** @enum {Object} */
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
       },
       MY_MINIGAME: {
          MY_MINIGAME: {
             game: MW.MyMinigame,
             view: MW.MyMinigameView,
             title: "My Minigame"
          }
       }
    };

Model
-----
The basic skeleton for the model file is:

    /**
     * @constructor
     * @extends {MW.Minigame}
     */
    MW.MyMinigame = function () {
       "use strict";
       var myMinigame = this;
       Minigame.call(this, "MyMinigame");
    
       // Attributes
       var someAttribute = 2;
    
       this.addSetup(function () {
          // Performed before minigame starts, lika a constructor.
       });

       this.addTeardown(function () {
          // Performed when minigame ends.
       });
     
       this.addStart(function () {
          // Performed when the minigame starts.
     
          // Broadcast an event called "SOME_EVENT".
          myMinigame.tell("SOME_EVENT");
     
          // Broadcast an event called "SOME_OTHER_EVENT", and wait until
          // the observer has called a callback function. Good if the
          // model needs to wait for an animation in the view.
          myMinigame.tellWait("SOME_OTHER_EVENT", function () {
          // this function will run when the view has called
          // the callback function
          
          Access general game state through the `game` member:
          if (myMinigame.game.modeIsAgentDo()) {
             // mode is "Agent Do"
          }
          
       });
    
       this.addStop(function () {
          // called when the minigame ends
       });
     	
       this.somePublicFunction = function () {
          // Do something.
       };
    };


View
----
The basic skeleton for the view file is:

     /**
      * @constructor
      * @extends {MW.MinigameView}
      * @param {MW.MyMinigameView} myMinigame
      */
     MW.MyMinigameView = function (myMinigame) {
        "use strict";

        this.addSetup(function () {
    	   // Performed before minigame starts, lika a constructor.
    	});

    	this.addTeardown(function () {
     	   // Performed when minigame ends.
     	});
     
        this.on("SOME_EVENT", function () {
           // Do something when SOME_EVENT is observed.
           // ...
           // Access and change the minigame state using the model's public
           // functions:
           myMinigame.somePublicFunction();
           
           // If the agent should be interrupted when in Agent See mode, use the
           // build in function:
           myMinigame.interruptAgent();
           // Resume the agent again with `myMinigame.resumeAgent()`.
        });
        
        this.on("SOME_OTHER_EVENT", function (callback) {
           // Perform animation or something time consuming when
           // SOME_OTHER_EVENT is obeserved.
           // ...
           // Call the callback when done, so the model can continue:
           callback();
        });
     };

Recording and accessing the player's actions
--------------------------------------------
In Child Play Mode, the player's actions can be recorded. In Agent See Mode,
these actions can be accessed by the agent.

In the model file (`src/model/Minigames/MyMinigame/MyMinigame.js`), use the
function `addAction`:

    // ...
    function someFunctionCalledBySomething() {
       // Doing something...
       // Noticing some action worth recording:
       myMinigame.addAction("nameOfAction");
    };
    // ...

In the agent strategy file (`src/model/Players/AgentPlayer.js`):

    this.strategies["MyMinigame"] = function(minigame, result) {
       // attributes
       var someAttribute = 9;
       
       this.on("SOME_EVENT", function () {
          // The agent can also listen for events.
          
          // Access the first recorded action:
          var firstAction = result[0];
          
          // Use second action:
          if (result[1] === "nameOfAction") {
             // Then change the state of the minigame, using its public
             // functions:
             myMinigame.somePublicFunction();
          }
       });
       
       this.interrupt = function () {
          // Performed when the agent is interrupted.
       };
       
       this.resume = function () {
          // Performed when the agent resumes after interruption.
       };
    };

