/**
 * @extends {MW.AgentView}
 * @constructor
 * @param {Kinetic.Container} container
 * @param {Object} config
 */
MW.MouseAgentView = MW.AgentView.extend(
/** @lends {MW.MouseAgentView.prototype} **/
{
    /** @constructs */
    init: function (container, config) {
        this.imageSprite = MW.Images.AGENT_MOUSE_SPRITE;
        this.faceSprite = MW.Images.AGENT_MOUSE_FACIALS_SPRITE;
        this.blinkSprite = MW.Images.AGENT_MOUSE_BLINK_SPRITE;
        this.pointAtSprite = MW.Images.AGENT_MOUSE_POINT_AT_SPRITE;
        this.animations = {
            "idle": [
                { x: 311, y: 0, width: 249, height: 338 }
            ],
            "idle-no-arm": [
                { x: 0, y: 1675, width: 249, height: 338 }
            ],
            "dance": [
                { x: 0, y: 0, width: 249, height: 404 },
                { x: 0, y: 454, width: 249, height: 403 },
                { x: 0, y: 907, width: 249, height: 404 }
            ],
            "head": [
                { x: 300, y: 473, width: 249, height: 266 }
            ],
            "jump": [
                { x: 0, y: 1361, width: 261, height: 264 }
            ]
        };
        this.facials = {
            "happy": [
                { x: 0, y: 0, width: 220, height: 150 }
            ],
            "neutral": [
                { x: 0, y: 200, width: 220, height: 150 }
            ],
            "surprised": [
                { x: 0, y: 400, width: 220, height: 150 }
            ],
            "talk": [
                { x: 0, y: 600, width: 201, height: 129 },
                { x: 0, y: 200, width: 220, height: 150 }
            ]
        };
        this.blinks = {
            "idle": [
                { x: 0, y: 0, width: 1, height: 1 }
            ],
            "blink": [
                { x: 0, y: 0, width: 176, height: 85 },
                { x: 0, y: 135, width: 177, height: 91 },
                { x: 0, y: 276, width: 178, height: 98 }

            ]
        };
        this.pointAts = {
            "pointAt6": [
                { x: 0, y: 0, width: 320, height: 430 },
                { x: 0, y: 480, width: 320, height: 430 },
                { x: 0, y: 960, width: 320, height: 430 },
                { x: 0, y: 1440, width: 320, height: 430 },
                { x: 0, y: 1920, width: 320, height: 430 }  //1
            ],
            "pointAt5": [
                { x: 0, y: 0, width: 320, height: 430 },
                { x: 0, y: 480, width: 320, height: 430 },
                { x: 0, y: 960, width: 320, height: 430 },
                { x: 0, y: 1440, width: 320, height: 430 },
                { x: 370, y: 0, width: 320, height: 430 }   //2
            ],
            "pointAt4": [
                { x: 0, y: 0, width: 320, height: 430 },
                { x: 0, y: 480, width: 320, height: 430 },
                { x: 0, y: 960, width: 320, height: 430 },
                { x: 0, y: 1440, width: 320, height: 430 },
                { x: 370, y: 480, width: 320, height: 430 } //3
            ],
            "pointAt3": [
                { x: 0, y: 0, width: 320, height: 430 },
                { x: 0, y: 480, width: 320, height: 430 },
                { x: 0, y: 960, width: 320, height: 430 },
                { x: 0, y: 1440, width: 320, height: 430 },
                { x: 370, y: 960, width: 320, height: 430 } //4
            ],
            "pointAt2": [
                { x: 0, y: 0, width: 320, height: 430 },
                { x: 0, y: 480, width: 320, height: 430 },
                { x: 0, y: 960, width: 320, height: 430 },
                { x: 0, y: 1440, width: 320, height: 430 },
                { x: 370, y: 1440, width: 320, height: 430 }//5
            ],
            "pointAt1": [
                { x: 0, y: 0, width: 320, height: 430 },
                { x: 0, y: 480, width: 320, height: 430 },
                { x: 0, y: 960, width: 320, height: 430 },
                { x: 0, y: 1440, width: 320, height: 430 },
                { x: 370, y: 1920, width: 320, height: 430 } //6
            ],
            "reset": [
                { x: 0, y: 1440, width: 320, height: 430 },
                { x: 0, y: 960, width: 320, height: 430 },
                { x: 0, y: 480, width: 320, height: 430 },
                { x: 0, y: 0, width: 320, height: 430 }
            ]
        };
        
        this.offsets = {
            "dance": { x: 0, y: -64 },
            "face": { x: -12, y: -11 },
            "feet": { x: 0, y: -315 },
            "arm": { x: -216, y: -196 }
        }
        this._super(container, config);
    }
});

