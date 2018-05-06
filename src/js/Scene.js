import * as THREE from 'three';
import Court from './Court';
import Ball from './Ball';

export default class Scene extends THREE.Scene {

    /**
     * 
     */
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

        // Court: simple ground plane
        this.court = new Court();
        this.add(this.court);

        // Ball
        this.ball = new Ball();
        this.add(this.ball.mesh);

        // Helper axes to test viewports
        this.axes = new THREE.AxesHelper(2000);
        this.add(this.axes);
    }

    /**
     * 
     */
    updatePhysics(){
        this.ball.updatePhysics();
    }
}