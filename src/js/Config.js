export default {
    "racket" : {
        "width" : 20,
        "heigth" : 20,
        "depth" : 20,
        "color" : 0x6dc0cc,
        "mass" : 0
    },
    "court" : {
        "width" : 200,
        "heigth" : 1,
        "depth" : 400,
        "color" : 0x6dc066,
        "mass" : 0
    },
    "ball" : {
        "radius" : 4,
        "color" : 0xffff00,
        "mass" : 5
    },
    "scenario" : {
        "ambientLight" : {
            "color" : 0xffffff,
            "intensity" : 0.5
        },
        "physics" : {
            "bounceRestitution" : 1.0,
            "gravity" : -9.82
        }
    },
    "playerOnekeys" : {
        "left" : "KeyA",
        "right" : "KeyD"
    },
    "playerTwokeys" : {
        "left" : "ArrowLeft",
        "right" : "ArrowRight"
    }
}