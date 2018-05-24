import * as THREE from 'three';
import * as CANNON from 'cannon';
import Config from './Config';

export default class Racket extends THREE.Object3D {

    constructor(color,opposite) {
        super();

        // Mathematical description
        this.width = Config.racket.width;
        this.height = Config.racket.height;
        this.depth = Config.racket.depth;
        this.color = color;
        this.mass = Config.racket.mass;
        this.stepSize = Config.racket.stepSize;
        this.controls = null;
        this.restitution = Config.racket.restitution;
        this.opposite = opposite;

        // Animation/movement parameters
        this.movingBackwards = false;
        this.movingForward = false;
        this.movingLeft = false;
        this.movingRight = false;
        this.rotatingLeft = false;
        this.rotatingRight = false;

        // 1 - THREE object
        this.geometry = new THREE.CubeGeometry(this.width, this.height, this.depth);
        this.material = new THREE.MeshPhongMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        if(this.opposite)
            this.mesh.applyMatrix(new THREE.Matrix4().makeRotationX(0.1));
        else
            this.mesh.applyMatrix(new THREE.Matrix4().makeRotationX(-0.1));
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        // 2 - CANNON object
        this.racketShape = new CANNON.Box(new CANNON.Vec3(this.width/2, this.height/2, this.depth*5));
        this.contactMaterial = new CANNON.Material();
        this.body = new CANNON.Body({
            mass: 0,
            material: this.contactMaterial
        });
        this.body.addShape(this.racketShape);
        this.body.velocity.set(0,0,0);
    }

    /**
     * Receives a point in which the object is positioned.
     * It handles the body, so that the own body positions the mesh.
     * @param {int} x
     * @param {int} y
     * @param {int} z
     */
    setPosition(x = 0, y = 0, z = 0){
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }


    /**
     * It copies the body's position into the THREE mesh
     */
    updateMeshPosition(){
        if(this.movingForward)
            this.mesh.position.z += this.stepSize;
        if(this.movingBackwards)
            this.mesh.position.z -= this.stepSize;
        if(this.movingLeft)
            this.mesh.position.x += this.stepSize;
        if(this.movingRight)
            this.mesh.position.x -= this.stepSize;

        if(this.rotatingLeft) {
            if (this.mesh.rotation.y < Config.racket.maxRotation)
                this.mesh.rotateY(0.05);
        }

        else if(this.rotatingRight) {
            if (this.mesh.rotation.y > -Config.racket.maxRotation)
                this.mesh.rotateY(-0.05);
        }

        this.body.quaternion.copy(this.mesh.quaternion);
        this.body.position.copy(this.mesh.position);
        this.body.position.z = this.opposite ? this.body.position.z + (this.depth*5) :
            this.body.position.z - (this.depth*5);
    }


}
