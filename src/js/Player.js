import * as THREE from 'three';
import Racket from './Racket';
import Config from './Config';

/**
 * At least two players are necessary for a PongTennis3D game.
 * Each player has a racket, which he moves with his controls keys,
 * and he counts his points himself.
 */
export default class Player extends THREE.Object3D{

    /**
     * Class constructor with parameters
     * @param {string} name 
     * @param {THREE.Color} color 
     * @param {boolean} opposite 
     * @param {dictionary} keys 
     */
    constructor(name = "Anonymous", color, opposite, keys){
        super();
        // Member data
        this.name = name;
        this.opposite = opposite;
        this.color = color;
        this.controls = null;
        this.setControls(keys)
        this.racket = new Racket(this.color, this.opposite);
        this.add(this.racket);

        // Parameters updated during the development of the game
        this.currentPoints = 0;
        this.currentGames = 0;
        this.currentSets = 0;
        this.serving = false;
        this.advantage = false;
    }

    /**
     * It's used to configure the keys for moving the player
     * @param {keys} keys
     */
    setControls(keys){
        this.controls = keys;
        this.controls.up = keys.up;
        this.controls.down = keys.down;
        this.controls.left = keys.left;
        this.controls.right = keys.right;
        this.controls.rotationLeft = keys.rotationLeft;
        this.controls.rotationRight = keys.rotationRight;
    }

    /**
     * Talking about movement, we have to change the CANNON parameters, not the THREE's ones.
     * The updateMeshPosition method will handle the update of the THREE mesh.
     * @param {keycode} event
     */
    computeKeyDown(event) {
        switch (event.code) {
            // When the player is serving, the Keys for moving
            // forward and backwards will allow him to Serve
            case this.controls.up:
                if (this.serving)
                    this.serving = false;
                else
                    this.racket.movingForward = true;
                break;
            case this.controls.down:
                if (this.serving)
                    this.serving = false;
                else
                    this.racket.movingBackwards = true;
                break;
            case this.controls.left:
                this.racket.movingLeft = true;
                break;
            case this.controls.right:
                this.racket.movingRight = true;
                break;
            case this.controls.rotationLeft:
                this.racket.rotatingLeft = true;
                this.racket.rotatingRight = false;
                break;
            case this.controls.rotationRight:
                this.racket.rotatingLeft = false;
                this.racket.rotatingRight = true;
                break;
        }
    }

    /**
     * Talking about movement, we have to change the CANNON parameters, not the THREE's ones.
     * The updateMeshPosition method will handle the update of the THREE mesh.
     * @param {keycode} event
     */
    computeKeyUp(event){
        switch (event.code) {
            case this.controls.up:
                this.racket.movingForward = false;
                break;
            case this.controls.down:
                this.racket.movingBackwards = false;
                break;
            case this.controls.left:
                this.racket.movingLeft = false;
                break;
            case this.controls.right:
                this.racket.movingRight = false;
                break;
            case this.controls.rotationLeft:
                this.racket.rotatingLeft = false;
                this.racket.rotatingRight = false;
                break;
            case this.controls.rotationRight:
                this.racket.rotatingLeft = false;
                this.racket.rotatingRight = false;
                break;
        }
    }

    /**
     * Updates the racket position and its relative body
     */
    updateMeshPosition(){
        this.racket.updateMeshPosition();
    }

    /**
     * Used for placing the player's racket in a specific position (maybe when a point ends)
     * @param {int} x 
     * @param {int} y 
     * @param {int} z 
     */
    setPosition(x, y, z){
        this.racket.setPosition(x, y, z);
        this.racket.mesh.rotation.y = 0;
    }

    /**
     * Sets the advantage when deuce
     * @param {int} advantage
     */
    setAdvantage(advantage){
        this.advantage += advantage;
    }

    /**
     * Called when the player scores a point
     */
    incrementPoints(){
        // When already has 40 points and scores again
        // gets an advantage
        if(this.currentPoints == 40)
            this.setAdvantage(1);

        // Update score from 15 points
        if(this.currentPoints <= 30)
            this.currentPoints += 15;

        // Get score of 40 after 3 plays scored
        if(this.currentPoints == 45)
            this.currentPoints = 40;
    }

    /**
     * Called when the player scores a game
     */
    incrementGames(){
        this.currentGames += 1;
        this.resetCurrentPoints();
    }

    /**
     * Called when the player scores a set
     */
    incrementSets(){
        this.currentSets += 1;
        this.resetCurrentGames();
    }

    /**
     * When a game is ended, points equal to 0
     */
    resetCurrentPoints(){
        this.currentPoints = 0;
        this.advantage = 0;
    }

    /**
     * When a set is ended, games equal to 0
     */
    resetCurrentGames(){
        this.currentGames = 0;
        this.resetCurrentPoints();
    }

    /**
     * Used for abstraction with the racket object
     */
    getMesh(){
        return this.racket.mesh;
    }

    /**
     * Used for abstraction with the racket object
     */
    getBody(){
        return this.racket.body;
    }

    /**
     * Used for abstraction with the racket object
     */
    getContactMaterial(){
        return this.racket.contactMaterial;
    }
}