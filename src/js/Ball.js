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
        this.body.position.set(0, Config.ball.bounceHeight, -100);
        this.body.velocity.set(0,0,150);
        Config.bodyIDs.ballID = this.body.id;

        /**
         * Listener event to detect collisions with other objects.
         * Proper function will be triggered with each collision.
         * Body.id could be used for classification.
         */
        this.body.addEventListener("collide", this.handleCollision);
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

    /**
     * This method checks every collision with every body on the world.
     * It always has to check if a point has been scored by any player.
     * 
     * --- RULES ABOUT SCORING ---
     * 
     * P1 loses a point if:
     *      - P2 hits the ball, the ball bounces in P1's half of the
     *        court and the play ends.
     *      - P1 hits the ball, and then the ball bounces in P1's
     *        half of the court.
     *      - P1 hits the ball and it goes directly out of the court.
     * 
     * A play ends when the ball bounces twice with no player strikes in
     * between; or when it goes out of the court.
     */
    handleCollision(collision){
        switch (collision.body.id) {
            case Config.bodyIDs.courtID:
                if(this.position.z > 0)
                    this.lastHalfOfCourtCollided = "2";
                else //this.body.position.z < 0
                    this.lastHalfOfCourtCollided = "1";
                break;
            case Config.bodyIDs.netID:
                break;
            case Config.bodyIDs.racketP1ID:
                this.lastPlayerCollided = "1";
                break;
            case Config.bodyIDs.racketP2ID:
                this.lastPlayerCollided = "2";
                break;
            default:
                break;
        }
        console.log('\n\n\nlast court collision: ' + this.lastHalfOfCourtCollided +
                    '\nlast player collided: ' + this.lastPlayerCollided);
    }

    /**
     * This method is responsible of doing the clones between the collidable meshes
     * (CANNON bodies) and the watchable ones (THREE meshes).
     */
    updateMeshPosition(){
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);

        // temporary trial - just places the ball in a playable position
        if(this.body.position.y <= -50){
            this.setPosition(0, Config.ball.bounceHeight, -100);
            this.body.velocity.set(0,0,150);
        }
    }
}
