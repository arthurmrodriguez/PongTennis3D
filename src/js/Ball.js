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

    }

    /**
     * Receives a point in which the object is positioned.
     * It handles the body, so that the own body positions the mesh.
     * @param {int} x 
     * @param {int} y 
     * @param {int} z 
     */
    setPosition(x = 0, y = 0, z = 0) {
        // this.body.position.x = x;
        // this.body.position.y = y;
        // this.body.position.z = z;
        // this.body.angularVelocity.set(0, 0, 0);
        // this.body.velocity.set(0, 0, 0);
    }

}
