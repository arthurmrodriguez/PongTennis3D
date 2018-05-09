import * as THREE from 'three';
import * as CANNON from 'cannon';
import Config from './Config';
import Net from './Net';

export default class Court extends THREE.Object3D {

    constructor(){
        super();

        // Objects
        this.net = null;

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

        // 2 - CANNON object
        this.racketShape = new CANNON.Box(new CANNON.Vec3(this.width/2, this.heigth/2, this.depth/2));
        this.contactMaterial = new CANNON.Material();
        this.body = new CANNON.Body({ 
            mass: this.mass,
            material: this.contactMaterial
        });
        this.body.addShape(this.racketShape);

        Config.bodyIDs.courtID = this.body.id;

        this.net = new Net();
        this.net.body.position.y += this.net.heigth/2;
        this.add(this.net);
    }

    updateMeshPosition(){
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
        this.net.updateMeshPosition();
    }
}