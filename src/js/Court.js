import * as THREE from 'three';
import Config from './Config';
import Net from './Net';
import tennisCourt from '../img/tennisCourt.png';

export default class Court extends THREE.Object3D {

    constructor(){
        super();

        // Objects
        this.net = null;

        // Parameters
        this.width = Config.court.width;
        this.height = Config.court.height;
        this.depth = Config.court.depth;
        this.color = Config.court.color;
        this.mass = Config.court.mass;

        // 1 - THREE object
        this.geometry = new THREE.CubeGeometry(this.width, this.height, this.depth);
        this.material = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(tennisCourt) });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        this.net = new Net();
        this.add(this.net);
    }
}