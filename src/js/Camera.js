import * as THREE from 'three';
import Config from './Config';

export default class Camera extends THREE.PerspectiveCamera {

    /**
     * Class constructor with parameters
     * @param {boolean} opposite determines if the camera should be rotated in the world to look at the opposite side
     */
    constructor(opposite = false){
        super(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.position.x = Config.scenario.camera.position.x;
        this.position.y = Config.scenario.camera.position.y;
        this.position.z = opposite ? -Config.scenario.camera.position.z : Config.scenario.camera.position.z;
        this.lookAt(new THREE.Vector3(0, 0, 0));
    }
}