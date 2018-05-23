import * as THREE from 'three';
import Racket from './Racket';
import Config from './Config';

/**
 * At least two players are necessary for a PongTennis3D game.
 * Each player has a racket, which he moves with his controls keys,
 * and he counts his points himself.
 */
export default class Player extends THREE.Object3D{

    constructor(name = "Anonymous", color, opposite, keys){
        super();
        // Member data
        this.name = name;
        this.opposite = opposite;
        this.color = color;
        this.keys = keys;
        this.racket = new Racket(this.color, this.opposite);
        this.racket.setControls(this.keys);
        this.currentPoints = 0;
        this.currentSets = 0;
        this.advantage = false;
        this.add(this.racket);
    }

    /**
     * 
     */
    getMesh(){
        return this.racket.mesh;
    }

    /**
     * 
     */
    getBody(){
        return this.racket.body;
    }

    /**
     * 
     */
    getContactMaterial(){
        return this.racket.contactMaterial;
    }

    /**
     * 
     * @param {int} x 
     * @param {int} y 
     * @param {int} z 
     */
    setPosition(x, y, z){
        this.racket.setPosition(x, y, z);
    }

    /**
     * Sets the advantage when deuce
     * @param {int} advantage
     */
    setAdvantage(advantage){
        this.advantage += advantage;
    }

    incrementScore(){

        // When already has 40 points and scores again
        // gets an advantage
        if(this.currentPoints == 40)
            this.setAdvantage(1);

        // Update score from 15 points
        if(this.currentPoints <= 30)
            this.currentPoints += 15;

        // Get score of 40 when 3 plays scored
        if(this.currentPoints == 45)
            this.currentPoints = 40;
    }

    incrementSets(){
        this.currentSets+=1;
        this.resetCurrentPoints();
    }


    resetCurrentPoints(){
        this.currentPoints = 0;
        this.advantage = 0;
    }

    resetCurrentSets(){
        this.currentSets = 0;

    }

    /**
     * 
     */
    updateMeshPosition(){
        this.racket.updateMeshPosition();
    }

    /**
     * 
     */
    computeKeyDown(event){
        this.racket.computeKeyDown(event);
    }

    /**
     * 
     */
    computeKeyUp(event){
        this.racket.computeKeyUp(event);
    }

}