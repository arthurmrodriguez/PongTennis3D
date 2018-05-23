export default {
    "racket" : {
        "width" : 140,
        "height" : 100,
        "depth" : 10,
        "color1" : 0x6dc0cc,
        "color2" : 0xaaaa33,
        "mass" : 5,
        "restitution" : 1.01,
        "stepSize" : 8,
        "rotationStep" : 0.2,
        "maxRotation" : 0.1
    },
    "court" : {
        "width" : 1000,
        "height" : 1,
        "depth" : 1800,
        "color" : 0x6dc066,
        "mass" : 0,
        "restitution" : 0.99
    },
    "net" : {
        "height" : 40,
        "depth" : 0.25,
        "color" : 0xffffff,
        "mass" : 0
    },
    "ball" : {
        "radius" : 12,
        "color" : 0xffff00,
        "mass" : 5,
        "numSegments" : 16,
        "bounceHeight" : 200
    },
    "scenario" : {
        "ambientLight" : {
            "color" : 0xffffff,
            "intensity" : 0.5
        },
        "spotLight" : {
            "color" : 0xffffff,
            "intensity" : 0.8,
            "angle" : 1.3,
            "penumbra" : 1,
            "decay" : 1,
            "position" : {
                "x" : 0,
                "y" : 550,
                "z" : 0
            }
        },
        "physics" : {
            "gravity" : -100,
            "bounceRestitution" : 1.0
        }
    },
    "playerOne" : {
        "playerOneLabel" : 1,
        "playerOneToken" : 1,
        "playerOneKeys" : {
            "up" : "KeyW",
            "down" : "KeyS",
            "left" : "KeyA",
            "right" : "KeyD",
            "rotationLeft" : "KeyC",
            "rotationRight" : "KeyV"
        },
    },

    "playerTwo" : {
        "playerTwoLabel" : 2,
        "playerTwoToken" : -1,
        "playerTwoKeys": {
            "up": "ArrowDown",
            "down": "ArrowUp",
            "left": "ArrowRight",
            "right": "ArrowLeft",
            "rotationLeft": "KeyK",
            "rotationRight": "KeyL"
        },
    },
    "bodyIDs" : {
        "courtID": 0,
        "netID": 0,
        "ballID" : 0,
        "player1ID" : 0,
        "player2ID" : 0
    }
}