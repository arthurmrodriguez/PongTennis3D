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
        this.spotLight1 = new SpotLight({position: new THREE.Vector3(200,200,200)});
        this.add(this.spotLight1);

        // Court: simple ground plane
        this.court = new Court();
        this.add(this.court);
        this.world.addBody(this.court.body);
        this.world.addBody(this.court.net.body);

        // Ball
        this.ball = new Ball();
        this.add(this.ball);
        this.world.addBody(this.ball.body);

        // Trial racket
        this.racket1 = new Racket();
        this.add(this.racket1);
        this.world.addBody(this.racket1.body);

        // Helper axes to test viewports
        this.axes = new THREE.AxesHelper(2000);
        this.add(this.axes);

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
        this.ballRacketMaterial = new CANNON.ContactMaterial(
            this.ball.contactMaterial,
            this.racket1.contactMaterial,
            {
                friction: 0.0,
                restitution: this.restitution
            }
        );
        this.world.addContactMaterial(this.ballRacketMaterial);
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
    }

    /**
     * 
     */
    computeKey(event) {
        this.racket1.computeKey(event);
    }
}