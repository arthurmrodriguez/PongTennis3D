import * as THREE from 'three';
import Court from './Court';

export default class Scene extends THREE.Scene {

    constructor(){
        super();
        // Main game elements
        this.court = null;
        this.ball = null;
        this.playerOne = null;
        this.playerTwo = null;
        this.ambientLight = null;
        this.spotLights = null;

        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0xffffff,0.85);
        this.add(this.ambientLight);

        // Spotlights
        //TODO

        // Court: simple ground plane for testing the viewport
        this.court = new Court();
        this.add(this.court);

        this.axes = new THREE.AxesHelper(100);
        this.add(this.axes);
    }

}