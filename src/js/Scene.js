import * as THREE from 'three';
import * as CANNON from 'cannon';
import Court from './Court';
import Ball from './Ball';
import SpotLight from './Light';
import Racket from './Racket';
import Config from './Config';
import Player from "./Player";

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
        this.timeStep = 1 / 30;

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

        // Ball indicator to see ball position over court
        this.ballIndicator = new Ball();
        this.add(this.ballIndicator);

        // Player is a wrapper for a racket and points
        // Player One
        this.playerOne = new Player("PlayerOne",Config.racket.color1,false,Config.playerOne.playerOneKeys);
        this.playerOne.setPosition(0,this.playerOne.racket.height/2,-this.court.depth/2);
        this.add(this.playerOne);
        this.world.addBody(this.playerOne.getBody());
        Config.bodyIDs.player1ID = this.playerOne.getBody().id;

        // Player Two
        this.playerTwo = new Player("PlayerTwo",Config.racket.color2,true,Config.playerTwo.playerTwoKeys);
        this.playerTwo.setPosition(0,this.playerTwo.racket.height/2,this.court.depth/2);
        this.add(this.playerTwo);
        this.world.addBody(this.playerTwo.getBody());
        Config.bodyIDs.player2ID = this.playerTwo.getBody().id;

        // Player stuff
        this.lastPlayerCollided = this.lastHalfOfCourtCollided = Config.playerOne.playerOneLabel;
        this.deuce = false;

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

        // Contact material between the ball and the racket of PlayerOne
        this.ballRacket1Material = new CANNON.ContactMaterial(
            this.ball.contactMaterial,
            this.playerOne.getContactMaterial(),
            {
                friction: 0.0,
                restitution: this.playerOne.racket.restitution
            }
        );
        this.world.addContactMaterial(this.ballRacket1Material);

        this.ballRacket2Material = new CANNON.ContactMaterial(
            this.ball.contactMaterial,
            this.playerTwo.getContactMaterial(),
            {
                friction: 0.0,
                restitution: this.playerTwo.racket.restitution
            }
        );
        this.world.addContactMaterial(this.ballRacket2Material);

        /**
         * Listener owned by the ball's body in order to detect collisions and handle scoring.
         * As the listener is owned by the body, inside of the this.handleCollision method, this
         * isn't translated by the Scene class; it's translated by "ball.body".
         */
        var self = this;

        /**
         * This method checks every collision with every body on the world.
         * It always has to check if a point has been scored by any player.
         *
         * --- RULES ABOUT SCORING ---
         *
         * P1 loses a point if:
         *      1 - P2 hits the ball, the ball bounces in P1's half of the
         *        court and the play ends.
         *      2 - P1 hits the ball, and then the ball bounces in P1's
         *        half of the court.
         *      3 - P1 hits the ball and it goes directly out of the court.
         *
         * A play ends when the ball bounces twice with no player strikes in
         * between (that's why we keep a "numBounces" variable equal to 0, and
         * it's incremented in every bounce); or when it goes out of the court.
         */
        this.ball.body.addEventListener("collide", function(collision){

            // Every time the ball collides with a racket, the numBounces of
            // the ball is set to 0. When the ball goes out of the court, numBounces
            // is incremented in 1 (this is done inside Ball's object)
            switch (collision.body.id) {
                case Config.bodyIDs.courtID:
                    if (this.position.z > 0)
                        self.lastHalfOfCourtCollided = Config.playerTwo.playerTwoLabel;
                    else //this.body.position.z < 0
                        self.lastHalfOfCourtCollided = Config.playerOne.playerOneLabel;
                    this.numBounces++;
                    self.checkSetState();
                    break;
                case Config.bodyIDs.netID:
                    break;
                case Config.bodyIDs.player1ID:
                    self.lastPlayerCollided = Config.playerOne.playerOneLabel;
                    this.numBounces = 0;
                    break;
                case Config.bodyIDs.player2ID:
                    self.lastPlayerCollided = Config.playerTwo.playerTwoLabel;
                    this.numBounces = 0;
                    break;
                default:
                    break;
            }
        });
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

    checkSetState(){
        // This first condition covers the aforementioned conditions 2 and 3,
        // that is, when the ball is hit by P1 and either bounces inside P1 court or
        // goes out of the court
        if(this.ball.body.numBounces == 1){
            if(this.lastHalfOfCourtCollided == this.lastPlayerCollided){
                var winner = this.lastPlayerCollided == Config.playerOne.playerOneLabel ?
                    Config.playerTwo.playerTwoLabel : Config.playerOne.playerOneLabel;
                this.endedPlay(winner);
            }
        }
        // If it reaches a count of more than 2 bounces, the last player who
        // hit the ball is the winner
        else if(this.ball.body.numBounces >= 2){
            this.endedPlay(this.lastPlayerCollided);
        }
    }


    /**
     * This method is called when a play ends.
     * It's responsible of adding points to the players who score them.
     * @param winner Player ID who has won the current play.
     */
    endedPlay(winner){

        // Update of the values
        this.lastPlayerCollided = winner;
        var token = this.lastPlayerCollided == Config.playerOne.playerOneToken ?
            Config.playerOne.playerOneToken : Config.playerTwo.playerTwoToken;

        // Update score
        this.lastPlayerCollided === Config.playerOne.playerOneLabel ? this.playerOne.incrementScore() :
            this.playerTwo.incrementScore();

        // After score update, we check if there's a deuce: both players with
        // 40 points and no one with advantage
        if(this.playerOne.currentPoints == this.playerTwo.currentPoints)
            this.deuce = true;
        else
            this.deuce = false;

        // When there's a deuce we have to check if any player was reached
        // an advantage of two over the other
        if(this.deuce){
            // Check if somebody has got advantage of more two points
            if(Math.abs(this.playerOne.advantage - this.playerTwo.advantage) == 2) {
                if (this.playerOne.advantage > this.playerTwo.advantage) {
                    this.playerOne.incrementSets();
                    this.playerTwo.resetCurrentPoints();
                }
                else {
                    this.playerTwo.incrementSets();
                    this.playerOne.resetCurrentPoints();
                }
            }
        }

        // If there's no deuce, we check if any player has reached the winning score
        // which is 40 points and a advantage
        else {
            if(this.playerOne.currentPoints == 40 && this.playerOne.advantage >= 1) {
                this.playerOne.incrementSets();
                this.playerTwo.resetCurrentPoints();
            }
            else if(this.playerTwo.currentPoints == 40 && this.playerTwo.advantage >= 1) {
                this.playerTwo.incrementSets();
                this.playerOne.resetCurrentPoints();
            }
        }


        this.showScore();
        this.ball.body.numBounces = 0;
        this.ball.setPosition(0, Config.ball.bounceHeight, -100*token);
        this.ball.body.velocity.set(0,0,150*token);

    }

    showScore(){

        console.log("-----------PUNTUACION-----------");
        console.log("Player ONE : SETS " + this.playerOne.currentSets +
                                " POINTS " + this.playerOne.currentPoints +
                                " ADVANTAGE " + this.playerOne.advantage);

        console.log("Player TWO : SETS " + this.playerTwo.currentSets +
                                " POINTS " + this.playerTwo.currentPoints +
                                " ADVANTAGE " + this.playerTwo.advantage);
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
        if(this.ball.body.position.y <= -50) {
            this.ball.body.numBounces++;
            this.checkSetState();
        }
        this.playerOne.updateMeshPosition();
        this.playerTwo.updateMeshPosition();
    }

    /**
     * 
     */
    computeKeyDown(event){
        this.playerOne.computeKeyDown(event);
        this.playerTwo.computeKeyDown(event);
    }

    /**
     * 
     */
    computeKeyUp(event){
        this.playerOne.computeKeyUp(event);
        this.playerTwo.computeKeyUp(event);
    }
}