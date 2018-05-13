export default {
    "racket" : {
        "width" : 100,
        "height" : 60,
        "depth" : 5,
        "color1" : 0x6dc0cc,
        "color2" : 0xaaaa33,
        "mass" : 0,
        "stepSize" : 6
    },
    "court" : {
        "width" : 800,
        "height" : 1,
        "depth" : 1600,
        "color" : 0x6dc066,
        "mass" : 0
    },
    "net" : {
        "height" : 40,
        "depth" : 0.25,
        "color" : 0xffffff,
        "mass" : 0
    },
    "ball" : {
        "radius" : 10,
        "color" : 0xffff00,
        "mass" : 5,
        "numSegments" : 16,
        "bounceHeight" : 60
    },
    "scenario" : {
        "ambientLight" : {
            "color" : 0xffffff,
            "intensity" : 0.5
        },
        "spotLight" : {
            "color" : 0xffffff,
            "intensity" : 0.5,
            "position" : {
                "x" : 0,
                "y" : 500,
                "z" : 0
            }
        },
        "physics" : {
            "bounceRestitution" : -0.5,
            "gravity" : -100
        }
    },
    "playerOnekeys" : {
        "up" : "KeyW",
        "down" : "KeyS",
        "left" : "KeyA",
        "right" : "KeyD",
        "strike" : "Space"
    },
    "playerTwokeys" : {
        "up" : "ArrowDown",
        "down" : "ArrowUp",
        "left" : "ArrowRight",
        "right" : "ArrowLeft",
        "strike" : "Enter"
    },
    "bodyIDs" : {
        "courtID": 0,
        "netID": 0,
        "ballID" : 0,
        "racketP1ID" : 0,
        "racketP2ID" : 0
    }
}