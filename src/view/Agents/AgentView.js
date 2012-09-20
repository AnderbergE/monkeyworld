/**
 * @constructor
 * @extends {Kinetic.Node}
 * @param {Kinetic.Container} container
 * @param {Object} config
 */
MW.AgentView = Class.extend(
/** @lends {MW.AgentView.prototype} */
{
    /** @constructs */
    init: function (container, config) {
        this.container = container;
        this.started = false;
        this.group = new Kinetic.Group(config);
        this.container.add(this.group);
        this.sprite = new Kinetic.Sprite({
            image: this.imageSprite,
            animation: "idle",
            animations: this.animations,
            frameRate: 4,
            visible: false
        });
        this.face = new Kinetic.Sprite({
            image: this.faceSprite,
            animation: "neutral",
            animations: this.facials,
            frameRate: 4,
            x: this.offsets["face"].x,
            y: this.offsets["face"].y,
            visible: false
        });
        this.blink = new Kinetic.Sprite({
            image: this.blinkSprite,
            animation: "idle",
            animations: this.blinks,
            frameRate: 15,
            x: this.offsets["face"].x,
            y: this.offsets["face"].y,
            visible: false
        });
        this.arm = new Kinetic.Sprite({
            image: this.pointAtSprite,
            animation: "pointAt",
            animations: this.pointAts,
            frameRate: 5,
            visible: false,
            x: this.offsets["arm"].x,
            y: this.offsets["arm"].y
        });
        var that = this;
        function repeatBlink() {
            that.blink.show();
            setTimeout(function () {
                that.blink.setAnimation("blink");
                that.blink.afterFrame(that.blinks["blink"].length - 1, function () {
                    that.blink.setAnimation("idle");
                    repeatBlink();
                });
            }, Utils.getRandomInt(2000, 5000));
        };
        repeatBlink();
        this.group.add(this.sprite);
        this.group.add(this.arm);
        this.group.add(this.face);
        this.group.add(this.blink);
        this.start = function () {
            if (!that.started) {
                that.started = true;
                this.sprite.show();
                this.sprite.start();
                this.face.start();
                this.blink.start();
                this.blink.show();
            }
        }
        this.setDefaultPosition = function () {
            this.sprite.setPosition({ x: 0, y: 0 });
        };
    },

    idle: function () {
        this.start();
        this.face.show();
        this.blink.show();
        this.sprite.setAnimation("idle");
        this.setDefaultPosition();
    },

    dance: function () {
        this.start();
        this.face.hide();
        this.blink.hide();
        this.sprite.setAnimation("dance");
        this.sprite.setPosition(this.offsets["dance"]);
    },
    
    pointAt: function (number, callback) {
        this.start();
        this.sprite.setAnimation("idle-no-arm");
        this.arm.show();
        this.arm.setAnimation("pointAt" + number);
        var that = this;
        this._chosenNumber = number;
        this.arm.afterFrame(that.pointAts["pointAt" + number].length - 2, function () {
            that.arm.stop();
            callback();
        });
        this.arm.start();
    },
    
    resetPointAt: function (callback) {
        this.start();
        this.arm.stop();
        this.sprite.setAnimation("idle-no-arm");
        this.arm.show();
        var that = this;
        if (this.arm.getIndex() < 4) {
            var n = this.arm.getIndex();
            this.arm.setIndex(this.pointAts["pointAt" + this._chosenNumber].length - n - 2);
        }
        this.arm.setAnimation("reset");
        this.arm.afterFrame(this.pointAts["reset"].length - 1, function () {
            that.arm.stop();
            that.arm.hide();
            that.sprite.setAnimation("idle");
            if (callback !== undefined) {
                callback();
            }
        });
        this.arm.start();
    },

    jump: function () {
        this.start();
        this.face.hide();
        this.blink.hide();
        this.sprite.setAnimation("jump");
        this.setDefaultPosition();
    },

    hideBody: function () {
        this.start();
        this.face.show();
        this.blink.show();
        this.sprite.setAnimation("head");
        this.setDefaultPosition();
    },
    
    /**
     * @param {number=} timeout
     */
    talk: function (timeout) {
        this.start();
        this.face.show();
        this.blink.show();
        this.face.setAnimation("talk");
        var that = this;
        if (timeout !== undefined) {
            setTimeout(function () {
                that.neutral();
            }, timeout);
        }
    },
    
    neutral: function () {
        this.start();
        this.face.show();
        this.blink.show();
        this.face.setAnimation("neutral");
    },
    
    feetOffset: function () {
        return this.offsets["feet"];
    },
    
    transitionTo: function (config) {
        this.group.transitionTo(config);
    },
    
    setContainer: function (container) {
        this.group.moveTo(container);
    },
    
    setX: function (x) {
        this.group.setX(x);
    },
    
    setY: function (y) {
        this.group.setY(y);
    },
    
    setPosition: function(pos) {
        this.group.setPosition(pos);
    },
    
    _remove: function () {
        this.container.remove(this.group);
    }
});

