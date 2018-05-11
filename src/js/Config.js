export default {
    "racket" : {
        "width" : 20,
        "height" : 20,
        "depth" : 20,
        "color" : 0x6dc0cc,
        "mass" : 0
    },
    "court" : {
        "width" : 200,
        "height" : 1,
        "depth" : 400,
        "color" : 0x6dc066,
        "mass" : 0
    },
    "net" : {
        "height" : 25,
        "depth" : 1,
        "color" : 0xffffff,
        "mass" : 0
    },
    "ball" : {
        "radius" : 8,
        "color" : 0xffff00,
        "mass" : 5,
        "numSegments" : 32
    },
    "scenario" : {
        "ambientLight" : {
            "color" : 0xffffff,
            "intensity" : 0.5
        },
        "physics" : {
            "bounceRestitution" : 1.0,
            "gravity" : -100
        }
    },
    "playerOnekeys" : {
        "up" : "KeyW",
        "down" : "KeyS",
        "left" : "KeyA",
        "right" : "KeyD"
    },
    "playerTwokeys" : {
        "up" : "ArrowUp",
        "down" : "ArrowDown",
        "left" : "ArrowLeft",
        "right" : "ArrowRight"
    },
    "bodyIDs" : {
        "courtID": 0,
        "netID": 0,
        "ballID" : 0,
        "racketP1ID" : 0,
        "racketP2ID" : 0
    }
}