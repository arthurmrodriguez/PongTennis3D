import Racket from './Racket';
import Config from './Config';

/**
 * At least two players are necessary for a PongTennis3D game.
 * Each player has a racket, which he moves with his controls keys,
 * and he counts his points himself.
 */
export default class Player {

    /**
     * Class constructor
     * @param {string} name 
     * @param {dictionary} keys 
     */
    constructor(name = "Anonymous", color, opposite, keys){
        
        this.color = color;
        this.opposite = opposite;
        this.keys = keys;
        
        this.racket = new Racket(this.color, this.opposite);
        this.racket.setControls(this.keys);
        this.points = 0;

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