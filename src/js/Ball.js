import * as CANNON from 'cannon';
import * as THREE from 'three';
import Config from './Config';
import ballTexture from '../img/tennisBall.png';

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
        this.material = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(ballTexture) });
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
        this.body.position.set(0, Config.ball.bounceHeight, -15);
        Config.bodyIDs.ballID = this.body.id;

        // Listener event to detect collisions with other objects.
        // Proper function will be triggered with each collision
        // Body.id could be used for classification.
        this.body.addEventListener("collide",function(collision){
            switch (collision.body.id){
                case Config.bodyIDs.courtID:
                    // console.log("Colisiona con Court");
                    break;
                case Config.bodyIDs.netID:
                    // console.log("Colisiona con Net");
                    break;
                case Config.bodyIDs.racketP1ID:
                    break;
                case Config.bodyIDs.racketP2ID:
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
    setPosition(x = 0, y = 0, z = 0) {
        this.body.position.x = x;
        this.body.position.y = y;
        this.body.position.z = z;
        this.body.angularVelocity.set(0, 0, 0);
        this.body.velocity.set(0, 0, 0);
    }

    updateMeshPosition(){
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);

        // temporal para pruebas
        if(this.body.position.y <= -50){
            this.setPosition(0, 60, Config.court.depth/4);
        }
    }
}
