import * as CANNON from 'cannon';
import * as THREE from 'three';
import Config from './Config';
import ballTexture from '../img/tennisBall.png';

export default class Ball extends THREE.Object3D {
    
    /**
     * Class constructor with no parameters
     */
    constructor(color = Config.ball.color){
        super();

        // Parameters for a better looking
        this.radius = Config.ball.radius;
        this.numSegments = Config.ball.numSegments;
        this.color = color;
        
        // Mass needs to be higher than 0 in order to be affected by world gravity
        this.mass = Config.ball.mass;

        // Parameters needed to control the development of the game
        this.lastPlayerCollided = null;
        this.lastHalfOfCourtCollided = null;

        // 1 - THREE object - creates geometry and loads a tennis ball texture
        this.geometry = new THREE.SphereGeometry(this.radius, this.numSegments, this.numSegments);
        this.material = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(ballTexture) });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        // 2- CANNON object - just a sphere with a contact material (so it can collide in a specific way with other bodies)
        this.sphereShape = new CANNON.Sphere(this.radius);
        this.contactMaterial = new CANNON.Material();
        this.body = new CANNON.Body({
            mass: this.mass,
            material: this.contactMaterial 
        });
        this.body.addShape(this.sphereShape);
        this.body.numBounces = 0;
        Config.bodyIDs.ballID = this.body.id;
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
    }

    /**
     * Receives a vector representing the velocity that should be taken by the ball
     * @param {int} x 
     * @param {int} y 
     * @param {int} z 
     */
    setVelocity(x = 0, y = 0, z = 0) {
        this.body.velocity.x = x;
        this.body.velocity.y = y;
        this.body.velocity.z = z;
    }

    /**
     * This method is responsible of doing the clones between the collidable meshes
     * (CANNON bodies) and the watchable ones (THREE meshes).
     */
    updateMeshPosition(){
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}
