import * as THREE from 'three';
import * as CANNON from 'cannon';
import Config from './Config';
import tennisNet from '../img/tennisNet.jpg';

export default class Net extends THREE.Object3D {

    constructor() {
        super();

        // Parameters
        this.width = Config.court.width;
        this.height = Config.net.height;
        this.depth = Config.net.depth;
        this.color = Config.net.color;
        this.mass = Config.net.mass;

        // 1 - THREE object
        this.geometry = new THREE.CubeGeometry(this.width, this.height, this.depth);

        // Texture created independently to apply tiling:
        // 8 times on X axis and 1 on Y axis
        this.texture = new THREE.TextureLoader().load(tennisNet);
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.repeat.set( 8, 1 );
        this.material = new THREE.MeshPhongMaterial({
            map: this.texture
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
        this.add(this.mesh);

        // 2 - CANNON object
        this.netShape = new CANNON.Box(new CANNON.Vec3(this.width/2, this.height/2, this.depth/2));
        this.contactMaterial = new CANNON.Material();
        this.body = new CANNON.Body({
            mass: this.mass,
            material: this.contactMaterial
        });
        this.body.addShape(this.netShape);

        Config.bodyIDs.netID = this.body.id;
    }

    updateMeshPosition() {
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}