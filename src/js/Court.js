import * as THREE from 'three';
import * as Ammo from 'ammojs';
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

        // 2 - AMMO body
        this.transform = new Ammo.btTransform();
        this.transform.setIdentity();
        this.transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        this.transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        this.motionState = new Ammo.btDefaultMotionState(this.transform);
        this.localInertia = new Ammo.btVector3(0, 0, 0);
        physicsShape.calculateLocalInertia(mass, localInertia);
        this.shape = new Ammo.btBoxShape(new Ammo.btVector3(this.width/2, this.height/2, this.depth/2));
        this.shape.setMargin(0.05);

        // Create rigid body
        this.body = new Ammo.btRigidBody(
            new Ammo.btRigidBodyConstructionInfo({
                mass: this.mass,
                collisionShape: this.shape
            })
        );
        this.mesh.userData.physicsBody = this.body;

        this.net = new Net();
        this.add(this.net);
    }
}