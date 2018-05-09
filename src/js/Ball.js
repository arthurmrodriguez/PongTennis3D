import * as CANNON from 'cannon';
import * as THREE from 'three';
import Config from './Config';

export default class Ball extends THREE.Object3D {
    
    constructor(){
        super();

        // Parameters
        this.mass = Config.ball.mass;
        this.radius = Config.ball.radius;
        this.numSegments = Config.ball.numSegments;
        this.color = Config.ball.color;

        // 1 - THREE object
        this.geometry = new THREE.SphereGeometry(this.radius, this.numSegments, this.numSegments);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });
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
        this.body.position.set(0,50,-5);
        Config.bodyIDs.ballID = this.body.id;

        // Listener event to detect collisions with other objects.
        // Proper function will be triggered with each collision
        // Body.id could be used for classification.
        this.body.addEventListener("collide",function(collision){
            switch (collision.body.id){
                case Config.bodyIDs.courtID:
                    console.log("Colisiona con Court");
                    break;
                case Config.bodyIDs.netID:
                    console.log("Colisiona con Net");
                    break;
                case Config.bodyIDs.racketP1ID:
                    console.log("Colisiona con Racket");
                    break;
                default:
                    break;
            }
        });
    }

    updateMeshPosition(){
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);

        // temporal para pruebas
        if(this.body.position.y <= -50){
            this.body.position = new CANNON.Vec3(0, 50, 0);
            this.body.velocity.set(0, 0, 0);
        }
    }
}
