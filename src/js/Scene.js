import * as THREE from 'three';
import * as Ammo from 'ammojs';
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

        // Physics variables
        this.restitution = Config.scenario.physics.bounceRestitution;
        this.gravity = Config.scenario.physics.gravity;

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

        this.initPhysics();

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

        // Ball
        this.ball = new Ball();
        this.add(this.ball);

        // Trial rackets
        this.racket1 = new Racket(Config.racket.color1, false);
        this.racket1.setPosition(0, this.racket1.height/2, -Config.court.depth/2);
        this.racket1.setControls(Config.playerOnekeys);
        this.add(this.racket1);
        
        this.racket2 = new Racket(Config.racket.color2, true);
        this.racket2.rotation.set(0, Math.PI, 0);
        this.racket2.setPosition(0, this.racket2.height/2, -Config.court.depth/2);
        this.racket2.setControls(Config.playerTwokeys);
        this.add(this.racket2);
    }

    /**
     * 
     */
    initPhysics(){
        this.collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
        this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
        this.broadphase = new Ammo.btDbvtBroadphase();
        this.solver = new Ammo.btSequentialImpulseConstraintSolver();
        this.softBodySolver = new Ammo.btDefaultSoftBodySolver();
        this.physicsWorld = new Ammo.btSoftRigidDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration, this.softBodySolver);
        this.physicsWorld.setGravity(new Ammo.btVector3(0, this.gravity, 0));
        this.physicsWorld.getWorldInfo().set_m_gravity(new Ammo.btVector3(0, this.gravity, 0));
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

    /**
     * 
     */
    updateMeshPosition(){
        this.racket1.updateMeshPosition();
        this.racket2.updateMeshPosition();
    }
}