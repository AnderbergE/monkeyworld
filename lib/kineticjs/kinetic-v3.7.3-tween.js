
///////////////////////////////////////////////////////////////////////
//  Tween
///////////////////////////////////////////////////////////////////////
/**
 * Shape constructor.  Shape extends Node
 * @param {function} drawFunc
 * @param {string} name
 */
Kinetic.Tween = function(obj, propFunc, func, begin, finish, duration){
	this._listeners = new Array();
	this.addListener(this);
	this.obj = obj;
	this.propFunc = propFunc;
	this.begin = begin;
	this._pos = begin;
	this.setDuration(duration);

	this.isPlaying = false;
	
	this._change = 0;

	this.prevTime = 0;
	this.prevPos = 0;
	this.looping = false;

	this._time = 0;
	this._position = 0;
	this._startTime = 0;
	this._finish = 0;

	this.name = '';

	//set the tweening function	
	if (func!=null && func!='') {
		this.func = func;
	} else {
		this.func = function (t, b, c, d) { return c*t/d + b; };
	};

	this.setFinish(finish);
};

/*
 * Tween methods
 */
Kinetic.Tween.prototype = {
	setTime: function(t){
		this.prevTime = this._time;
		if (t > this.getDuration()) {
			if (this.looping) {
				this.rewind (t - this._duration);
				this.update();
				this.broadcastMessage('onTweenLooped',{target:this,type:'onTweenLooped'});
			} else {
				this._time = this._duration;
				this.update();
				this.stop();
				this.broadcastMessage('onTweenFinished',{target:this,type:'onTweenFinished'});
			}
		} else if (t < 0) {
			this.rewind();
			this.update();
		} else {
			this._time = t;
			this.update();
		}
	},
	getTime: function(){	return this._time; },
	setDuration: function(d){ this._duration = (d == null || d <= 0) ? 100000 : d; },
	getDuration: function(){ return this._duration; },
	setPosition: function(p){
		this.prevPos = this._pos;
		//var a = this.suffixe != '' ? this.suffixe : '';
		this.propFunc(p); //+ a;
		//this.obj(Math.round(p));
		this._pos = p;
		this.broadcastMessage('onTweenChanged',{target:this,type:'onTweenChanged'});
	},
	getPosition: function(t){
		if (t == undefined) t = this._time;
		return this.func(t, this.begin, this._change, this._duration);
	},
	setFinish: function(f){ this._change = f - this.begin; },
	getFinish: function(){	return this.begin + this._change; },
	start: function(){
		this.rewind();
		this.startEnterFrame();
		this.broadcastMessage('onTweenStarted',{target:this,type:'onTweenStarted'});
	},
	rewind: function(t){
		this.stop();
		this._time = (t == undefined) ? 0 : t;
		this.fixTime();
		this.update();
	},
	fforward: function(){
		this._time = this._duration;
		this.fixTime();
		this.update();
	},
	update: function(){ this.setPosition(this.getPosition(this._time)); },
	startEnterFrame: function(){
		this.stopEnterFrame();
		this.isPlaying = true;
		this.onEnterFrame();
	},
	onEnterFrame: function(){
		if(this.isPlaying)
			this.nextFrame();
	},
	nextFrame: function(){ this.setTime((this.getTimer() - this._startTime) / 1000);	},
	stop: function(){
		this.stopEnterFrame();
		this.broadcastMessage('onTweenStopped',{target:this,type:'onTweenStopped'});
	},
	stopEnterFrame: function(){ this.isPlaying = false; },
	continueTo: function(finish, duration){
		this.begin = this._pos;
		this.setFinish(finish);
		if (this._duration != undefined)
			this.setDuration(duration);
		this.start();
	},
	resume: function(){
		this.fixTime();
		this.startEnterFrame();
		this.broadcastMessage('onTweenResumed',{target:this,type:'onTweenResumed'});
	},
	yoyo: function (){ this.continueTo(this.begin,this._time); },
	addListener: function(o){
		this.removeListener (o);
		return this._listeners.push(o);
	},
	removeListener: function(o){
		var a = this._listeners;
		var i = a.length;
		while (i--) {
			if (a[i] == o) {
				a.splice (i, 1);
				return true;
			}
		}
		return false;
	},
	broadcastMessage: function(){
		var arr = new Array();
		for(var i = 0; i < arguments.length; i++){
			arr.push(arguments[i])
		}
		var e = arr.shift();
		var a = this._listeners;
		var l = a.length;
		for (var i=0; i<l; i++){
			if(a[i][e])
			a[i][e].apply(a[i], arr);
		}
	},
	fixTime: function(){	this._startTime = this.getTimer() - this._time * 1000; },
	getTimer: function(){ return new Date().getTime() - this._time; }
};

/*
 * Tween algorithms
 */

Kinetic.Tween.backEaseIn = function(t,b,c,d,a,p){
	if (s == undefined) var s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
};

Kinetic.Tween.backEaseOut = function(t,b,c,d,a,p){
	if (s == undefined) var s = 1.70158;
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
};

Kinetic.Tween.backEaseInOut = function(t,b,c,d,a,p){
	if (s == undefined) var s = 1.70158; 
	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
};

Kinetic.Tween.elasticEaseIn = function(t,b,c,d,a,p){
		if (t==0) return b;  
		if ((t/=d)==1) return b+c;  
		if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) {
			a=c; var s=p/4;
		}
		else 
			var s = p/(2*Math.PI) * Math.asin (c/a);
		
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
};

Kinetic.Tween.elasticEaseOut = function (t,b,c,d,a,p){
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
};

Kinetic.Tween.elasticEaseInOut = function (t,b,c,d,a,p){
	if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) var p=d*(.3*1.5);
	if (!a || a < Math.abs(c)) {var a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
};

Kinetic.Tween.bounceEaseOut = function(t,b,c,d){
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}
};

Kinetic.Tween.bounceEaseIn = function(t,b,c,d){
	return c - Kinetic.Tween.bounceEaseOut (d-t, 0, c, d) + b;
};

Kinetic.Tween.bounceEaseInOut = function(t,b,c,d){
	if (t < d/2) return Kinetic.Tween.bounceEaseIn (t*2, 0, c, d) * .5 + b;
	else return Kinetic.Tween.bounceEaseOut (t*2-d, 0, c, d) * .5 + c*.5 + b;
};

Kinetic.Tween.strongEaseInOut = function(t,b,c,d){
	return c*(t/=d)*t*t*t*t + b;
};

Kinetic.Tween.regularEaseIn = function(t,b,c,d){
	return c*(t/=d)*t + b;
};

Kinetic.Tween.regularEaseOut = function(t,b,c,d){
	return -c *(t/=d)*(t-2) + b;
};

Kinetic.Tween.regularEaseInOut = function(t,b,c,d){
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
};

Kinetic.Tween.strongEaseIn = function(t,b,c,d){
	return c*(t/=d)*t*t*t*t + b;
};

Kinetic.Tween.strongEaseOut = function(t,b,c,d){
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
};

Kinetic.Tween.strongEaseInOut = function(t,b,c,d){
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
};