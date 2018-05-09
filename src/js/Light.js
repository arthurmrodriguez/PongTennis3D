import * as THREE from 'three';

export default class SpotLight extends THREE.Light{

    constructor(color = 0xffffff, intensity = 0.9, position){
        super();
        this.light = new THREE.SpotLight(color);
        position = (position === undefined ? new THREE.Vector3(100,200,200) : position);
        this.light.position.set(position.x,position.y, position.z);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 4096;
        this.light.shadow.mapSize.height = 4096;
        this.light.intensity = intensity;
        this.light.shadow.camera.near = 100;
        this.light.shadow.camera.far = 1000;
        this.light.shadow.camera.fov = 45;
        this.add(this.light);
    }


    setParameters(target, angle, distance){
        this.light.add(target);
        this.light.target = target;
        this.light.angle = angle;
        this.light.distance = distance
    }

}