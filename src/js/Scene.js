import * as THREE from 'three';
import * as CANNON from 'cannon';
import Court from './Court';
import Ball from './Ball';
import SpotLight from './Light';
import Racket from './Racket';
import Config from './Config';

export default class Scene extends THREE.Scene {

    /**
     * 
     */
    constructor(){
        super();
        // Main game elements
        this.court = null;
        this.world = null;
        this.ball = null;
        this.playerOne = null;
        this.playerTwo = null;
        this.ambientLight = null;
        this.spotLights = null;

        this.restitution = Config.scenario.physics.bounceRestitution;
        this.gravity = Config.scenario.physics.gravity;

        // Time of step in CANNON's world. Equal to a maximum of 60 FPS
        this.timeStep = 1 / 60;

        // Init cannon world
        this.initCannon();

        // Ambient light
        this.ambientLight = new THREE.AmbientLight(
            Config.scenario.ambientLight.color,
            Config.scenario.ambientLight.intensity
        );
        this.add(this.ambientLight);

        // Spotlights
        this.cenitalSpotLight = new SpotLight();
        this.add(this.cenitalSpotLight);

        // Court: simple ground plane
        this.court = new Court();
        this.add(this.court);
        this.world.addBody(this.court.body);
        this.world.addBody(this.court.net.body);

        // Ball
        this.ball = new Ball();
        this.add(this.ball);
        this.world.addBody(this.ball.body);

        // Trial rackets
        this.racket1 = new Racket(Config.racket.color1);
        this.racket1.setPosition(0, this.racket1.height/2, -Config.court.depth/2);
        this.racket1.setControls(Config.playerOnekeys);
        this.add(this.racket1);
        this.world.addBody(this.racket1.body);
        Config.bodyIDs.racketP1ID = this.racket1.body.id;

        this.racket2 = new Racket(Config.racket.color2);
        this.racket2.setPosition(0, this.racket2.height/2, Config.court.depth/2);
        this.racket2.setControls(Config.playerTwokeys);
        this.add(this.racket2);
        this.world.addBody(this.racket2.body);
        Config.bodyIDs.racketP2ID = this.racket2.body.id;

        // Collisions work correctly without contact materials, but there aren't any bounces.
        // Contact material between the ball and the ground
        this.ballGroundMaterial = new CANNON.ContactMaterial(
            this.court.contactMaterial,
            this.ball.contactMaterial,
            {
                friction: 0.0,
                restitution: this.restitution
            }
        );
        this.world.addContactMaterial(this.ballGroundMaterial);

        // Contact material between the ball and a racket
        this.ballRacket1Material = new CANNON.ContactMaterial(
            this.ball.contactMaterial,
            this.racket1.contactMaterial,
            {
                friction: 0.0,
                restitution: this.restitution
            }
        );
        this.world.addContactMaterial(this.ballRacket1Material);

        this.ballRacket2Material = new CANNON.ContactMaterial(
            this.ball.contactMaterial,
            this.racket2.contactMaterial,
            {
                friction: 0.0,
                restitution: this.restitution
            }
        );
        this.world.addContactMaterial(this.ballRacket2Material);
    }

    /**
     * Function which initialises the CANNON world and its parameters
     */
    initCannon() {
        // The cannon world. It handles physics
        this.world = new CANNON.World();
        this.world.gravity.set(0, this.gravity, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
    }

    /**
     * 
     */
    updateMeshPosition() {
        // Step the physics world
        this.world.step(this.timeStep);
        this.court.updateMeshPosition();
        this.ball.updateMeshPosition();
        this.racket1.updateMeshPosition();
        this.racket2.updateMeshPosition();
    }

    /**
     * 
     */
    computeKeyDown(event){
        this.racket1.computeKeyDown(event);
        this.racket2.computeKeyDown(event);
    }

    /**
     * 
     */
    computeKeyUp(event){
        this.racket1.computeKeyUp(event);
        this.racket2.computeKeyUp(event);
    }
}