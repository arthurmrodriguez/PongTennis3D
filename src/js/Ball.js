import * as CANNON from 'cannon';
import * as THREE from 'three';

export default class Ball extends THREE.Object3D {
    
    constructor(){
        super();

        this.mass = 0.6;
        this.radius = 3;

        this.geometry = new THREE.SphereGeometry(this.radius);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.body = new CANNON.Body({ mass: this.mass });
        this.body.angularVelocity.set(1, 1, 1);
        this.body.angularDamping = 0.8;
    }

    updatePhysics(){
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}
