import * as THREE from 'three';
import Config from './Config';

export default class SpotLight extends THREE.Light{

    /**
     * Class constructor
     * @param {THREE.Color} color 
     */
    constructor(){
        super();

        // Color of the light (always white)
        this.light = new THREE.SpotLight(Config.scenario.spotLight.color);
        this.light.intensity = Config.scenario.spotLight.intensity;

        // Parameters for positioning
        this.light.position.x = Config.scenario.spotLight.position.x;
        this.light.position.y = Config.scenario.spotLight.position.y;
        this.light.position.z = Config.scenario.spotLight.position.z;

        // Parameters for casting and showing high-res shadows
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 4096;
        this.light.shadow.mapSize.height = 4096;

        // Parameters for distortion, penumbra and related stuff
        this.light.angle = Config.scenario.spotLight.angle;
        this.light.penumbra = Config.scenario.spotLight.penumbra;
        this.light.decay = Config.scenario.spotLight.decay;

        this.add(this.light);
    }

    /**
     * Its purpose it's basically adding some basical parameters chosen by the user
     * @param {float} target 
     * @param {float} angle 
     * @param {float} distance 
     */
    setParameters(target, angle, distance){
        this.light.add(target);
        this.light.target = target;
        this.light.angle = angle;
        this.light.distance = distance
    }
}