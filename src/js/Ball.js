import * as CANNON from 'cannon';
import * as THREE from 'three';

export default class Ball extends THREE.Object3D {
    
    constructor(){
        super();

        // Mathematical description
        this.mass = 5;
        this.radius = 3;

        // 1 - THREE object
        this.geometry = new THREE.SphereGeometry(this.radius);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        // 2- CANNON object
        this.sphereShape = new CANNON.Sphere(this.radius);
        this.contactMaterial = new CANNON.Material();
        this.body = new CANNON.Body({ 
            mass: this.mass, 
            material: this.contactMaterial 
        });
        this.body.addShape(this.sphereShape);
        this.body.position.set(0,50,0);
    }

    updatePhysics(){
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}
