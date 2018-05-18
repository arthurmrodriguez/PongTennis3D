import * as THREE from 'three';
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
        this.texture.repeat.set( 20, 1 );
        this.material = new THREE.MeshPhongMaterial({ map: this.texture });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
        this.add(this.mesh);

        
    }
}