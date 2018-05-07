import * as THREE from 'three';
import * as CANNON from 'cannon';
import Court from './Court';
import Ball from './Ball';

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

        // Time of step in CANNON's world. Equal to a maximum of 60 FPS
        this.timeStep = 1 / 60;

        // Init cannon world
        this.initCannon();

        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0xffffff,0.85);
        this.add(this.ambientLight);

        // Spotlights
        //TODO

        // Court: simple ground plane
        this.court = new Court();
        this.add(this.court);
        this.world.addBody(this.court.body);

        // Ball
        this.ball = new Ball();
        this.add(this.ball);
        this.world.addBody(this.ball.body);

        // Helper axes to test viewports
        this.axes = new THREE.AxesHelper(2000);
        this.add(this.axes);

        this.ballGroundMaterial = new CANNON.ContactMaterial(
            this.court.contactMaterial,
            this.ball.contactMaterial,
            {
                friction: 0.0,
                restitution: 0.9
            }
        );
        this.world.addContactMaterial(this.ballGroundMaterial);
    }

    /**
     * Function which initialises the CANNON world and its parameters
     */
    initCannon() {
        // The cannon world. It handles physics
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 20;
        this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
        this.world.defaultContactMaterial.contactEquationRelaxation = 4;
    }

    /**
     * 
     */
    updatePhysics() {
        // Step the physics world
        this.world.step(this.timeStep);
        this.court.updatePhysics();
        this.ball.updatePhysics();
    }
}