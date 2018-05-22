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
        this.timeStep = 1 / 45;

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

        this.ballIndicator = new Ball();
        this.add(this.ballIndicator);

        // Trial rackets
        this.racket1 = new Racket(Config.racket.color1,false);
        this.racket1.setControls(Config.playerOnekeys);
        this.racket1.setPosition(0,this.racket1.height/2,-this.court.depth/2);
        this.add(this.racket1);
        this.world.addBody(this.racket1.body);
        Config.bodyIDs.racketP1ID = this.racket1.body.id;
        
        this.racket2 = new Racket(Config.racket.color2,true);
        this.racket2.setPosition(0, this.racket2.height/2,this.court.depth/2);
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
                restitution: Config.court.restitution
            }
        );
        this.world.addContactMaterial(this.ballGroundMaterial);

        // Contact material between the ball and a racket
        this.ballRacket1Material = new CANNON.ContactMaterial(
            this.ball.contactMaterial,
            this.racket1.contactMaterial,
            {
                friction: 0.0,
                restitution: this.racket1.restitution
            }
        );
        this.world.addContactMaterial(this.ballRacket1Material);

        this.ballRacket2Material = new CANNON.ContactMaterial(
            this.ball.contactMaterial,
            this.racket2.contactMaterial,
            {
                friction: 0.0,
                restitution: this.racket2.restitution
            }
        );
        this.world.addContactMaterial(this.ballRacket2Material);

        /**
         * Listener owned by the ball's body in order to detect collisions and handle scoring.
         * As the listener is owned by the body, inside of the this.handleCollision method, this
         * isn't translated by the Scene class; it's translated by "ball.body".
         */
        this.ball.body.addEventListener("collide", this.handleCollision);
    }

    /**
     * Function which initialises the CANNON world and its parameters
     */
    initCannon() {
        // The cannon world. It handles physics
        this.world = new CANNON.World();
        this.world.gravity.set(0, this.gravity, 0);
        this.world.solver.iterations = 60;
        this.world.solver.tolerance = 0;
    }

    /**
     * 
     */
    updateMeshPosition() {
        // Step the physics world
        this.world.step(this.timeStep);
        this.court.updateMeshPosition();
        this.ball.updateMeshPosition();
        this.ballIndicator.position.set(this.ball.mesh.position.x,0,this.ball.mesh.position.z);
        this.racket1.updateMeshPosition();
        this.racket2.updateMeshPosition();
    }

    /**
     * This method checks every collision with every body on the world.
     * It always has to check if a point has been scored by any player.
     * 
     * --- RULES ABOUT SCORING ---
     * 
     * P1 loses a point if:
     *      - P2 hits the ball, the ball bounces in P1's half of the
     *        court and the play ends.
     *      - P1 hits the ball, and then the ball bounces in P1's
     *        half of the court.
     *      - P1 hits the ball and it goes directly out of the court.
     * 
     * A play ends when the ball bounces twice with no player strikes in
     * between (that's why we keep a "numBounces" variable equal to 0, and
     * it's incremented in every bounce); or when it goes out of the court.
     */
    handleCollision(collision) {
        switch (collision.body.id) {
            case Config.bodyIDs.courtID:
                if (this.position.z > 0)
                    this.lastHalfOfCourtCollided = "2";
                else //this.body.position.z < 0
                    this.lastHalfOfCourtCollided = "1";
                this.ball.numBounces++;
                break;
            case Config.bodyIDs.netID:
                break;
            case Config.bodyIDs.racketP1ID:
                this.lastPlayerCollided = "1";
                break;
            case Config.bodyIDs.racketP2ID:
                this.lastPlayerCollided = "2";
                break;
            default:
                break;
        }
        // @TODO: conditions when this.endedPlay() should be called
    }

    /**
     * This method is called when a play, handled by this.handleCollision(), ends.
     * It's responsible of adding points to the players who score them.
     */
    endedPlay(){
        this.ball.numBounces = 0;
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