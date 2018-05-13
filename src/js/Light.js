import * as THREE from 'three';
import Config from './Config';

export default class SpotLight extends THREE.Light{

    constructor(color = 0xffffff){
        super();
        this.light = new THREE.SpotLight(color);
        this.light.position.x = Config.scenario.spotLight.position.x;
        this.light.position.y = Config.scenario.spotLight.position.y;
        this.light.position.z = Config.scenario.spotLight.position.z;
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 4096;
        this.light.shadow.mapSize.height = 4096;
        this.light.intensity = Config.scenario.spotLight.intensity;
        this.light.shadow.camera.near = 100;
        this.light.shadow.camera.far = 1000;
        this.light.shadow.camera.fov = 45;
        this.add(this.light);
    }

    /**
     * 
     * @param {*} target 
     * @param {*} angle 
     * @param {*} distance 
     */
    setParameters(target, angle, distance){
        this.light.add(target);
        this.light.target = target;
        this.light.angle = angle;
        this.light.distance = distance
    }
}