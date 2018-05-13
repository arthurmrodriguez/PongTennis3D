import * as THREE from 'three';
import * as CANNON from 'cannon';
import Config from './Config';
import racketModel from '../models/tennisRacket.obj';

export default class Racket extends THREE.Object3D {

    constructor(color) {
        super();

        // Mathematical description
        this.width = Config.racket.width;
        this.height = Config.racket.height;
        this.depth = Config.racket.depth;
        this.color = color;
        this.mass = Config.racket.mass;
        this.stepSize = Config.racket.stepSize;
        this.controls = null;

        // Animation/movement parameters
        this.movingBackwards = false;
        this.movingForward = false;
        this.movingLeft = false;
        this.movingRight = false;
        this.loadingStrike = false;
        this.releasingStrike = false;

        // 1 - THREE object
        this.geometry = new THREE.CubeGeometry(this.width, this.height, this.depth);
        this.material = new THREE.MeshPhongMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        // 2 - CANNON object
        this.racketShape = new CANNON.Box(new CANNON.Vec3(this.width/2, this.height/2, this.depth/2));
        this.contactMaterial = new CANNON.Material();
        this.body = new CANNON.Body({
            mass: 0,
            material: this.contactMaterial
        });
        this.body.addShape(this.racketShape);

        // Listener event to detect collisions with other objects.
        // Proper function will be triggered with each collision
        // Body.id could be used for classification.
        this.body.addEventListener("collide", function (collision) {
            switch (collision.body.id) {
                case Config.bodyIDs.ballID:
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * Receives a point in which the object is positioned.
     * It handles the body, so that the own body positions the mesh.
     * @param {int} x 
     * @param {int} y 
     * @param {int} z 
     */
    setPosition(x = 0, y = 0, z = 0){
        this.body.position.x = x;
        this.body.position.y = y;
        this.body.position.z = z;
    }

    /**
     * 
     * @param {keys} keys 
     */
    setControls(keys){
        this.controls = keys;
        this.controls.up = keys.up;
        this.controls.down = keys.down;
        this.controls.left = keys.left;
        this.controls.right = keys.right;
        this.controls.strike = keys.strike;
    }

    /**
     * It copies the body's position into the THREE mesh
     */
    updateMeshPosition(){
        if(this.movingForward)
            this.body.position.z += this.stepSize;
        if(this.movingBackwards)
            this.body.position.z -= this.stepSize;
        if(this.movingLeft)
            this.body.position.x += this.stepSize;
        if(this.movingRight)
            this.body.position.x -= this.stepSize;

        if(this.loadingStrike){
            this.mesh.translateX(this.width/2);
            this.mesh.rotateY(0.1);
            this.mesh.translateX(-this.width / 2);
            this.body.position.copy(this.mesh.position);
            this.body.quaternion.copy(this.mesh.quaternion);
        } /*else if(this.releasingStrike){
            
        }*/
        
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

    /**
     * Talking about movement, we have to change the CANNON parameters, not the THREE's ones.
     * The updateMeshPosition method will handle the update of the THREE mesh.
     * @param {keycode} event 
     */
    computeKeyDown(event){
        switch(event.code){
            case this.controls.up:
                this.movingForward = true;
                break;
            case this.controls.down:
                this.movingBackwards = true;
                break;
            case this.controls.left:
                this.movingLeft = true;
                break;
            case this.controls.right:
                this.movingRight = true;
                break;
            case this.controls.strike:
                this.loadingStrike = true;
                this.releasingStrike = false;
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
                this.movingForward = false;
                break;
            case this.controls.down:
                this.movingBackwards = false;
                break;
            case this.controls.left:
                this.movingLeft = false;
                break;
            case this.controls.right:
                this.movingRight = false;
                break;
            case this.controls.strike:
                this.loadingStrike = false;
                this.releasingStrike = true;
                break;
        }
    }
}