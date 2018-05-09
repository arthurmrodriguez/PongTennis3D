import * as THREE from 'three';
import * as CANNON from 'cannon';
import Config from './Config';

export default class Racket extends THREE.Object3D {

    constructor() {
        super();

        // Mathematical description
        this.width = Config.racket.width;
        this.heigth = Config.racket.heigth;
        this.depth = Config.racket.depth;
        this.color = Config.racket.color;
        this.mass = Config.racket.mass;

        // 1 - THREE object
        this.geometry = new THREE.CubeGeometry(this.width, this.heigth, this.depth);
        this.material = new THREE.MeshPhongMaterial({ color: 0x6dc0cc });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        // 1.1 - THREE object.net
        // this.net = new THREE.Mesh(new THREE.CubeGeometry(this.width, 25, 1), new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
        // this.net.applyMatrix(new THREE.Matrix4().makeTranslation(0, 12.5, 0));
        // this.mesh.add(this.net);

        // 2 - CANNON object
        this.courtShape = new CANNON.Box(new CANNON.Vec3(this.width/2, this.heigth/2, this.depth/2));
        this.contactMaterial = new CANNON.Material();
        this.body = new CANNON.Body({
            mass: 0,
            material: this.contactMaterial
        });
        this.body.addShape(this.courtShape);
    }

    updatePhysics(){
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

    /**
     * Talking about movement, we have to change the CANNON parameters, not the THREE's ones.
     * The updatePhysics method will handle the update of the THREE mesh.
     * @param {keycode} event 
     */
    computeKey(event){
        switch(event.code){
            case 'ArrowUp':
                this.body.position.z += 1;
                break;
            case 'ArrowDown':
                this.body.position.z -= 1;
                break;
            case 'ArrowLeft':
                this.body.position.x += 1;
                break;
            case 'ArrowRight':
                this.body.position.x -= 1;
                break;
        }
    }
}