/**
 * This file is a type of JavaScript class in a JSON format.
 * It's used in the whole project for using the same defined constants.
 */
export default {
    "racket" : {
        "width" : 140,
        "height" : 100,
        "depth" : 10,
        "color1" : '#e91e63',
        "color2" : '#2196f3',
        "mass" : 0,
        "restitution" : 1.1,
        "stepSize" : 8,
        "rotationStep" : 0.2,
        "maxRotation" : 0.2
    },
    "court" : {
        "width" : 1000,
        "height" : 1,
        "depth" : 1800,
        "color" : '#6dc066',
        "mass" : 0,
        "restitution" : 0.9
    },
    "net" : {
        "height" : 40,
        "depth" : 0.25,
        "color" : '#ffffff',
        "mass" : 0
    },
    "ball" : {
        "radius" : 12,
        "color" : '#ffff00',
        "mass" : 5,
        "numSegments" : 16,
        "bounceHeight" : 200,
        "initialXPos" : 0,
        "initialZPos" : 200,
        "velocity" : 150
    },
    "scenario" : {
        "camera" : {
            "position" : {
                "x" : 0,
                "y" : 1500,
                "z" : 1600
            }
        },
        "ambientLight" : {
            "color" : '#ffffff',
            "intensity" : 0.5
        },
        "spotLight" : {
            "color" : '#ffffff',
            "intensity" : 0.8,
            "angle" : 1.3,
            "penumbra" : 1,
            "decay" : 1,
            "position" : {
                "x" : 0,
                "y" : 800,
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