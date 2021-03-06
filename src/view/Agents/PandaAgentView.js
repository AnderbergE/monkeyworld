/**
 * Create a bird.
 * @extends {MW.GlobalObject}
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 *		{Function} drawScene - function that redraws the scene, default empty.
 */
MW.PandaAgentView = MW.GlobalObject.extend(
{
	init: function (config) {
		this._super('PandaAgentView');
		if (config.x === undefined) config.x = 0;
		if (config.y === undefined) config.y = 0;
		if (config.drawScene === undefined) config.drawScene = function () {};
		var that = this,
			group,
			panda,
			leftEye,
			rightEye,
			animation,
			followObject,
			followAnimation,
			EYE_MAX = 12,
			EYE_DISTANCE = 1,
			coordinates = {
				leftEye: {x: 146, y: 156},
				rightEye: {x: 341, y: 161}
			};
			
		var followAnimation = new Kinetic.Animation({
			func: function (frame) {
				setEye(leftEye, coordinates.leftEye, {
					x: followObject.getAbsolutePosition().x,
					y: followObject.getAbsolutePosition().y
				});
				setEye(rightEye, coordinates.rightEye, {
					x: followObject.getAbsolutePosition().x,
					y: followObject.getAbsolutePosition().y
				});
				config.drawScene();
			}
		});
		
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
			config.drawScene();
		}
		
		/**
		 * Walk with right foot.
		 * @private
		 */
		function walkRight () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA_WALK_RIGHT);
			animation = setTimeout(walkLeft, 150);
			config.drawScene();
		}
		
		/**
		 * Wave.
		 * @private
		 */
		function waveUp () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA_WAVE);
			animation = setTimeout(waveDown, 150);
			config.drawScene();
		}
		
		/**
		 * Don't wave.
		 * @private
		 */
		function waveDown () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA);
			animation = setTimeout(waveUp, 150);
			config.drawScene();
		}
		
		/**
		 * Open mouth.
		 * @private
		 */
		function mouthOpen () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA_TALK);
			animation = setTimeout(mouthClosed, 200);
			config.drawScene();
		}
		
		/**
		 * Close mouth.
		 * @private
		 */
		function mouthClosed () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA);
			animation = setTimeout(mouthOpen, 200);
			config.drawScene();
		}
		
		/**
		 * Set eye location in socket depending on mouse cursor position.
		 * @private
		 * @param {Kinetic.Image} eye - the eye to rotate
		 * @param {Hash} offset - the offset from the body to the eye
		 * 		{Number} offset.x - the eyes offset x coordinate
		 * 		{Number} offset.y - the eyes offset y coordinate
		 * @param {Hash} objectPos - the objects coordinates
		 * 		{Number} objectPos.x - the objects x coordinate
		 * 		{Number} objectPos.y - the objects y coordinate
		 */
		function setEye(eye, offset, objectPos) {
			var eyePos = eye.getAbsolutePosition();
			var dx = objectPos.x - (eyePos.x + eye.getWidth() / 2 - EYE_MAX);
			var dy = objectPos.y - (eyePos.y + eye.getHeight() / 2 - EYE_MAX);
			var r = Math.min(Math.max(Math.sqrt(dx * dx + dy * dy) /
				EYE_DISTANCE, 0), EYE_MAX);
			var a = Math.atan2(dy, dx);
			eye.setX(Math.cos(a) * r + offset.x);
			eye.setY(Math.sin(a) * r + offset.y);
		}
		
		/**
		 * Direct gaze towards mouse cursor position.
		 * @private
		 * @param {event} e - the event
		 */
		function eyesFollowCursor (e) {
			/* check that we got a good event */
			if (!e) {
				e = window.event;
			}
			/* get mouse position (browsers differ) */
			if (e.pageX || e.pageY) {
				mousePos = {x: e.pageX, y: e.pageY};
			} else if (e.clientX || e.clientY) {
				mousePos = {
					x: e.clientX + document.body.scrollLeft +
						document.documentElement.scrollLeft,
					y: e.clientY + document.body.scrollTop +
						document.documentElement.scrollTop
				};
			}
			mousePos.x = mousePos.x +
				(MW.GlobalSettings.width - window.innerWidth) / 2;
			setEye(leftEye, coordinates.leftEye, mousePos);
			setEye(rightEye, coordinates.rightEye, mousePos);
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
				config.drawScene();
			}
		}
		
		/**
		 * @public
		 * @param {Boolean} talk - true if the panda should talk.
		 */
		this.talk = function (talk) {
			clearTimeout(animation);
			if (talk) {
				mouthOpen();
			} else {
				MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA);
				config.drawScene();
			}
		}
		
		/**
		 * TODO: This should be made in a super class, along with bird stuff.
		 * @public
		 * @param {MW.SoundEntry} sound - the sound to play
		 */
		this.say = function (sound) {
			MW.Sound.play(sound);
			that.talk(true);
			setTimeout(function () {
				that.talk(false);
			}, sound.getLength() * 1000);
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
				config.drawScene();
			}
		}
		
		/**
		 * @public
		 * @param {Boolean} follow - true if the panda should follow the cursor.
		 */
		this.followCursor = function (follow) {
			followObject = null;
			followAnimation.stop();
			if (follow) {
				/* This might not work in all browsers, ses attachEvent. */
				document.addEventListener ("mousemove", eyesFollowCursor);
			} else {
				document.removeEventListener ("mousemove", eyesFollowCursor);
				leftEye.setX(coordinates.leftEye.x);
				leftEye.setY(coordinates.leftEye.y);
				rightEye.setX(coordinates.rightEye.x);
				rightEye.setY(coordinates.rightEye.y);
			}
		}
		
		/**
		 * @public
		 * @param {Boolean} obj - the object to follow.
		 */
		this.followObject = function (obj) {
			document.removeEventListener ("mousemove", eyesFollowCursor);
			if (obj !== undefined && obj != null &&
				obj.getAbsolutePosition !== undefined) {
				followObject = obj;
				followAnimation.start();
			} else {
				followObject = null;
				followAnimation.stop();
				leftEye.setX(coordinates.leftEye.x);
				leftEye.setY(coordinates.leftEye.y);
				rightEye.setX(coordinates.rightEye.x);
				rightEye.setY(coordinates.rightEye.y);
			}
		}
	}
});