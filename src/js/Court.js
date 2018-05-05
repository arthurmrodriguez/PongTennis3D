import * as THREE from 'three';

export default class Court extends THREE.Object3D {

    constructor(){
        super();
        this.court = new THREE.Mesh(new THREE.CubeGeometry(200, 1, 400), new THREE.MeshPhongMaterial({ color: 0x6dc066 }));
        this.add(this.court);

        this.net = new THREE.Mesh(new THREE.CubeGeometry(200, 25, 1), new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
        this.net.applyMatrix(new THREE.Matrix4().makeTranslation(0, 12.5, 0));
        this.court.add(this.net);
    }
}