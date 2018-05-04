import * as THREE from 'three';

export default class Renderer {

    constructor(width, height){
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
    }

    getRenderer(){
        return this.renderer;
    }

    getDomElement(){
        return this.renderer.domElement;
    }

}
