import * as THREE from 'three';
import * as CANNON from 'cannon';
import Config from './Config';

export default class Court extends THREE.Object3D {

    constructor(){
        super();

        // Parameters
        this.width = Config.court.width;
        this.heigth = Config.court.heigth;
        this.depth = Config.court.depth;
        this.color = Config.court.color;
        this.mass = Config.court.mass;

        // 1 - THREE object
        this.geometry = new THREE.CubeGeometry(this.width, this.heigth, this.depth);
        this.material = new THREE.MeshPhongMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        // 1.1 - THREE object.net
        // this.net = new THREE.Mesh(new THREE.CubeGeometry(this.width, 25, 1), new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
        // this.net.applyMatrix(new THREE.Matrix4().makeTranslation(0, 12.5, 0));
        // this.mesh.add(this.net);

        // 2 - CANNON object
        this.courtShape = new CANNON.Box(new CANNON.Vec3(this.width, this.heigth, this.depth));
        this.contactMaterial = new CANNON.Material();
        this.body = new CANNON.Body({ 
            mass: this.mass,
            material: this.contactMaterial
        });
        this.body.addShape(this.courtShape);
    }

    updatePhysics(){
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}