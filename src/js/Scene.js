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
     * Class constructor without parameters. Every parameter is defined in the Config.js
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

        // CANNON world parameters
        this.restitution = Config.scenario.physics.bounceRestitution;
        this.gravity = Config.scenario.physics.gravity;

        // Time of step in CANNON's world
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
        this.ball.setPosition(Config.ball.initialXPos,Config.ball.bounceHeight,-Config.ball.initialZPos);
        this.ball.setVelocity(0,0,0);
        this.ball.body.mass = 0;
        this.add(this.ball);
        this.world.addBody(this.ball.body);

        // Player is a wrapper for a racket and points
        // Player One
        this.playerOne = new Player("PlayerOne",Config.racket.color1,false,Config.playerOne.playerOneKeys);
        this.add(this.playerOne);
        this.world.addBody(this.playerOne.getBody());
        Config.bodyIDs.player1ID = this.playerOne.getBody().id;

        // Player Two
        this.playerTwo = new Player("PlayerTwo",Config.racket.color2,true,Config.playerTwo.playerTwoKeys);
        this.add(this.playerTwo);
        this.world.addBody(this.playerTwo.getBody());
        Config.bodyIDs.player2ID = this.playerTwo.getBody().id;
        this.resetRacketsPosition();

        // Player stuff -------- CHECK THIS
        this.lastPlayerCollided = this.lastHalfOfCourtCollided = Config.playerOne.playerOneLabel;
        this.deuce = false;
        this.served = false;
        this.lastPlayerCollided === Config.playerOne.playerOneLabel ?
            this.playerOne.serving = true : this.playerTwo.serving = true;

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
         * 
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
        var self = this;
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
                    self.checkGameState();
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

    /**
     * It checks the score from 0 to 40+ points in a single game
     */
    checkGameState(){
        // This first condition covers the aforementioned conditions 2 and 3,
        // that is, when the ball is hit by P1 and either bounces inside P1 court or
        // goes out of the court
        if(this.ball.body.numBounces === 1){
            if(this.lastHalfOfCourtCollided === this.lastPlayerCollided){
                var winner = this.lastPlayerCollided === Config.playerOne.playerOneLabel ?
                    Config.playerTwo.playerTwoLabel : Config.playerOne.playerOneLabel;
                this.endedPlay(winner);
            }
        }
        // If it reaches a count of more than 2 bounces, the last player who
        // hit the ball is the winner
        else if(this.ball.body.numBounces >= 2)
            this.endedPlay(this.lastPlayerCollided);
    }

    /**
     * It checks the score from 0 to 6+ games in a single set
     */
    checkSetState(){

    }

    /**
     * This method is called when a play ends.
     * It's responsible of adding points to the players who score them.
     * @param winner Player ID who has won the current play.
     */
    endedPlay(winner){
        // Update of the values
        this.lastPlayerCollided = winner;

        // Update score locally to each player
        this.lastPlayerCollided === Config.playerOne.playerOneLabel ? this.playerOne.incrementPoints() :
            this.playerTwo.incrementPoints();

        // After score update, we check if there's a deuce: both players with
        // 40 points and no one with advantage
        if(this.playerOne.currentPoints === this.playerTwo.currentPoints)
            this.deuce = true;
        else
            this.deuce = false;

        // When there's a deuce we have to check if any player was reached
        // an advantage of two over the other
        if(this.deuce){
            // Check if somebody has got advantage of more two points
            if(Math.abs(this.playerOne.advantage - this.playerTwo.advantage) === 2) {
                if (this.playerOne.advantage > this.playerTwo.advantage) {
                    this.playerOne.incrementGames();
                    this.playerTwo.resetCurrentPoints();
                }
                else {
                    this.playerTwo.incrementGames();
                    this.playerOne.resetCurrentPoints();
                }
            }
        }

        // If there's no deuce, we check if any player has reached the winning score
        // which is 40 points and a advantage
        else {
            if(this.playerOne.currentPoints === 40 && this.playerOne.advantage >= 1) {
                this.playerOne.incrementGames();
                this.playerTwo.resetCurrentPoints();
            }
            else if(this.playerTwo.currentPoints === 40 && this.playerTwo.advantage >= 1) {
                this.playerTwo.incrementGames();
                this.playerOne.resetCurrentPoints();
            }
        }

        // Update the score on GUI
        this.updateScore();
        // Now it's time to serve, so the ball will remain
        // still until the serving player serves
        this.served = false;
        this.lastPlayerCollided === Config.playerOne.playerOneToken ?
            this.playerOne.serving = true : this.playerTwo.serving = true;

        // Restart the position of the rackets
        this.resetRacketsPosition();
    }

    /**
     * Writes the current score to the HTML UI
     */
    updateScore(){
        var textoP1, textoP2;
        textoP1 = (this.playerOne.currentPoints === 40 && this.playerOne.advantage>this.playerTwo.advantage) ? 'A' : this.playerOne.currentPoints;
        textoP2 = (this.playerTwo.currentPoints === 40 && this.playerTwo.advantage>this.playerOne.advantage) ? 'A' : this.playerTwo.currentPoints;
        document.getElementById('scoreboard').innerText = (textoP1 + ' - ' + textoP2);
    }

    /**
     * Places the racket in the center of their half of the court again
     */
    resetRacketsPosition(){
        this.playerOne.setPosition(0, this.playerOne.racket.height, -this.court.depth / 4);
        this.playerTwo.setPosition(0, this.playerTwo.racket.height, this.court.depth / 4);
    }

    /**
     * It updates every meshes' and bodies' position in the scene
     */
    updateMeshPosition() {
        // Step the physics world
        this.world.step(this.timeStep);
        this.court.updateMeshPosition();
        this.playerOne.updateMeshPosition();
        this.playerTwo.updateMeshPosition();
        this.ball.updateMeshPosition();

        if(this.ball.body.position.y <= -50) {
            this.ball.body.numBounces++;
            this.checkGameState();
        }

        if(!this.served){
            if(this.ball.body.mass != 0){
                // The ball animation needs to be stopped inside the
                // animation loop for it not to maintain old values and
                // update them correctly
                var token = this.lastPlayerCollided === Config.playerOne.playerOneLabel ?
                    Config.playerOne.playerOneToken : Config.playerTwo.playerTwoToken;

                // Set the ball at the same level (X axis) as the racket, which then
                // will be updated according to orientation of the serving player
                var servingPlayer = this.lastPlayerCollided === Config.playerOne.playerOneLabel ?
                    this.playerOne : this.playerTwo;
                this.ball.setPosition(servingPlayer.getMesh().position.x, Config.ball.bounceHeight, -Config.ball.initialZPos*token);
                this.ball.setVelocity(0,0,0);
                this.ball.body.mass = 0;
            }

            // Allows the ball to be positioned in relation to the serving player
            // position and orientation
            var token = this.lastPlayerCollided === Config.playerOne.playerOneLabel ?
                Config.playerOne.playerOneToken : Config.playerTwo.playerTwoToken;
            var servingPlayer = this.lastPlayerCollided === Config.playerOne.playerOneLabel ?
                this.playerOne : this.playerTwo;

            this.ball.setPosition(servingPlayer.getMesh().position.x, Config.ball.bounceHeight, -Config.ball.initialZPos*token);
            this.ball.updateMeshPosition();
        }
    }

    /**
     * Event triggered when a key starts being pressed
     */
    computeKeyDown(event){
        this.playerOne.computeKeyDown(event);
        this.playerTwo.computeKeyDown(event);

        // After checking key events, we check
        // whether the serving player has served
        if(!this.served){
            if(this.lastPlayerCollided === Config.playerOne.playerOneLabel &&
                !this.playerOne.serving)
                this.served = true;

            else if(this.lastPlayerCollided === Config.playerTwo.playerTwoLabel &&
                !this.playerTwo.serving)
                this.served = true;

            // Common variables
            var token = this.lastPlayerCollided === Config.playerOne.playerOneLabel ?
                Config.playerOne.playerOneToken : Config.playerTwo.playerTwoToken;
            var servingPlayer = this.lastPlayerCollided === Config.playerOne.playerOneLabel ?
                this.playerOne : this.playerTwo;

            // If the player has served, animation is reset by giving
            // velocity and mass to the ball
            if(this.served){
                this.ball.body.numBounces = 0;
                this.ball.setPosition(servingPlayer.getMesh().position.x, Config.ball.bounceHeight, -Config.ball.initialZPos*token);

                // Velocity is adjusted according to the players orientation
                // Orientation
                var matrix = new THREE.Matrix4();
                matrix.extractRotation( servingPlayer.getMesh().matrix );
                var direction = new THREE.Vector3( 0, 0, 1 );
                direction.applyMatrix4(matrix);

                this.ball.body.velocity.set(Config.ball.velocity*token*direction.x,0,Config.ball.velocity*token*direction.z);
                this.ball.body.mass = Config.ball.mass;
            }
        }
    }

    /**
     * Event triggered when a key stops being pressed
     */
    computeKeyUp(event){
        this.playerOne.computeKeyUp(event);
        this.playerTwo.computeKeyUp(event);
    }
}