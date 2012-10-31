/**
 * Create a bird.
 * @extends {MW.GlobalObject}
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 */
MW.PandaAgentView = MW.GlobalObject.extend(
{
	init: function (config) {
		this._super('PandaAgentView');
		if (config.x === undefined) config.x = 0;
		if (config.y === undefined) config.y = 0;
		if (config.drawScene === undefined) config.drawScene = function () {};
		var group,
			panda,
			leftEye,
			rightEye,
			animation,
			coordinates = {
				leftEye: {x: 141, y: 151},
				rightEye: {x: 336, y: 156}
			};
		
		group = new Kinetic.Group({
			x: config.x,
			y: config.y,
			scale: {x: 0.25, y: 0.25}
		});
		
		/* Add body */
		panda = new Kinetic.Image({
			image: MW.Images.ELEVATORGAME_AGENT_PANDA
		});
		group.add(panda);
		
		/* Add eyes */
		leftEye = new Kinetic.Image({
			x: coordinates.leftEye.x,
			y: coordinates.leftEye.y,
			image: MW.Images.ELEVATORGAME_AGENT_PANDA_EYE
		});
		group.add(leftEye);
		rightEye = new Kinetic.Image({
			x: coordinates.rightEye.x,
			y: coordinates.rightEye.y,
			image: MW.Images.ELEVATORGAME_AGENT_PANDA_EYE
		});
		group.add(rightEye);
		
		/* Add eye flares */
		group.add(new Kinetic.Image({
			x: coordinates.leftEye.x + 19,
			y: coordinates.leftEye.y + 14,
			image: MW.Images.ELEVATORGAME_AGENT_PANDA_EYE_FLARE
		}));
		group.add(new Kinetic.Image({
			x: coordinates.rightEye.x + 19,
			y: coordinates.rightEye.y + 14,
			image: MW.Images.ELEVATORGAME_AGENT_PANDA_EYE_FLARE
		}));
		
		
		/**
		 * Walk with left foot.
		 * @private
		 */
		function walkLeft () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA_WALK_LEFT);
			animation = setTimeout(walkRight, 150);
		}
		
		/**
		 * Walk with right foot.
		 * @private
		 */
		function walkRight () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA_WALK_RIGHT);
			animation = setTimeout(walkLeft, 150);
		}
		
		/**
		 * Wave.
		 * @private
		 */
		function waveUp () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA_WAVE);
			animation = setTimeout(waveDown, 150);
		}
		
		/**
		 * Don't wave.
		 * @private
		 */
		function waveDown () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA);
			animation = setTimeout(waveUp, 150);
		}
		
		/**
		 * Set eye location in socket depending on mouse cursor position.
		 * @private
		 * @param {Kinetic.Image} eye - The eye to set.
		 * @param {Number} offset - The offset from the body to the eye.
		 */
		function setEye(eye, offset) {
			/* This is not 100 %, but good enough perhaps */
			var w = eye.getWidth();
			var h = eye.getHeight();
			var eyePos = eye.getAbsolutePosition();
			var dx = event.pageX - (eyePos.x + w / 2);
			var dy = event.pageY - (eyePos.y + h / 2);
			var r = (dx*dx/w+dy*dy/h<1) ?
				1 : Math.sqrt(w*h / (dx*dx*h+dy*dy*w));
			eye.setX((r*dx)/2+offset.x);
			eye.setY((r*dy)/2+offset.y);
		}
		
		/**
		 * Direct gaze towards mouse cursor position.
		 * @private
		 */
		function eyesFollowCursor () {
			setEye(leftEye, coordinates.leftEye);
			setEye(rightEye, coordinates.rightEye);
			config.drawScene();
		}
		
		
		/**
		 * @public
		 * @return {Kinetic.Group}
		 */
		this.getGraphics = function () {
			return group;
		};
		
		/**
		 * @public
		 * @param {Hash} config - config for a Kinetic transition.
		 */
		this.transitionTo = function (config) {
			group.transitionTo(config);
		};
		
		/**
		 * @public
		 * @param {Boolean} walk - true if the panda should walk.
		 */
		this.walk = function (walk) {
			clearTimeout(animation);
			if (walk) {
				walkLeft();
			} else {
				MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA);
			}
		}
		
		/**
		 * @public
		 * @param {Boolean} wave - true if the panda should wave.
		 */
		this.wave = function (wave) {
			clearTimeout(animation);
			if (wave) {
				waveUp();
			} else {
				MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA);
			}
		}
		
		/**
		 * @public
		 * @param {Boolean} follow - true if the panda should follow the cursor.
		 * @param {Function} drawScene - function to draw the scene.
		 */
		this.followCursor = function (follow) {
			if (follow) {
				document.onmousemove = eyesFollowCursor;
			} else {
				document.onmousemove = null;
				leftEye.setX(coordinates.leftEye.x);
				leftEye.setY(coordinates.leftEye.y);
				rightEye.setX(coordinates.rightEye.x);
				rightEye.setY(coordinates.rightEye.y);
			}
		}
	}
});