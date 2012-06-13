/**
 * @constructor
 * @extends {GameView}
 * @param {Ladder} game
 */
function MountainView(game) {
	/** @type{MountainView} */ var view = this;
	
	GameView.call(this);
	Log.debug("Constructing MountainView", "mt-view");
	this.tag("MountainView");
	
	var dynamicLayer = new Kinetic.Layer();
	var staticLayer = new Kinetic.Layer();
	
	var CAGE_CONFIG = {
		X: 400, Y: 600
	};
	
	var balloonGroups = new Array();
	var cage = new Kinetic.Group({ x: CAGE_CONFIG.X, y: CAGE_CONFIG.Y });
	
	/** @constructor @extends {Kinetic.Shape} */
	Kinetic.Balloon = function(x, y) {
		var group = new Kinetic.Group({ x: x, y: y });
		var balloon = new Kinetic.Circle({
			fill: "red",
			stroke: "black",
			strokeWidth: 4,
			radius: 20
		});
		var string = new Kinetic.Line({
			stroke: "black",
			strokeWidth: 4,
			points: [0, 20, 0, 65]
		});
		group.add(string);
		group.add(balloon);
		return group;
	};
	
	var BALLOON_GRID = {
		X: 730, Y: 180, STEPX: 140, STEPY: 140, WIDTH: 2
	};
	
	view.setup = function() {
		Log.debug("Setting up MountainView", "mt-view");
		view.stage.add(staticLayer);
		view.stage.add(dynamicLayer);
		
		var mountain = new Kinetic.Polygon({
			points: [50, 600,
			         350, 600,
			         150, 100],
			fill: "gray",
			stroke: "black",
			strokeWidth: 4
		});
		
		cage.add(new Kinetic.Polygon({
			points: [0, 0,
			         100, 0,
			         150, -100,
			         -50, -100],
			fill: "#993300",
			stroke: "black",
			strokeWidth: 4
		}));
		
		var balloonGrid = new Utils.gridizer(
			BALLOON_GRID.X, BALLOON_GRID.Y, BALLOON_GRID.STEPX, BALLOON_GRID.STEPY, BALLOON_GRID.WIDTH
		);
		
		for (var i = 0; i < 6; i++) {
			(function(i) {
				var pos = balloonGrid.next();
				var group = new Kinetic.Group({ x: pos.x, y: pos.y });
				var balloons = new Kinetic.Group({ x: 40, y: 40 });
				var rect = new Kinetic.Rect({
					width: BALLOON_GRID.STEPX,
					height: BALLOON_GRID.STEPY,
					fill: "yellow",
					strokeWidth: 4,
					stroke: "black"
				});
				group.add(rect);
				balloonGroups.push(group);
				var r = 0;
				for (var j = 0; j <= i; j++) {
					if (j === 3) r++;
					balloons.add(new Kinetic.Balloon(j*30 - 2.7*r*30, r*30));
				}
				group.add(balloons);
				group._rect = rect;
				group._balloons = balloons;
				
				group.on("mousedown touchstart", function() {
					group._rect.setFill("red");
					game.pick(i + 1);
				});
				
				dynamicLayer.add(group);
			})(i);
		};
		
		dynamicLayer.add(cage);
		staticLayer.add(mountain);
		view.on("frame", function() { dynamicLayer.draw(); });
		staticLayer.draw();
	};
	
	view.on("Ladder.picked", function(msg) {
		var b = balloonGroups[msg.number - 1]._balloons;
		var g = balloonGroups[msg.number - 1];
		view.getTween(b.attrs).to({x: - Math.abs(CAGE_CONFIG.X - g.getX()), y: CAGE_CONFIG.Y - g.getY() - 160 }, 1000).call(function() {
			b.moveTo(cage);
			b.setX(0);
			b.setY(-160);
			b.moveDown();
			msg.callback();
		});
	});
	
	view.on("Ladder.birdFlyToLadder", function(msg) {
		view.getTween(cage.attrs).to({ y: CAGE_CONFIG.Y - msg.number * 50 }, 2000);
	});
	
	view.on("Ladder.placeTreat", function(msg) {
		console.log("correct: " + game.getTargetNumber());
	});
	
	view.on("Game.stopMiniGame Game.roundDone", function() {
		Log.debug("Tearing down MountainView", "mt-view");
		view.stage.remove(staticLayer);
		view.stage.remove(dynamicLayer);
	});
}
inherit(MountainView, GameView);
