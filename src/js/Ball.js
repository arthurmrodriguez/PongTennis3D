import * as CANNON from 'cannon';
import * as THREE from 'three';

export default class Ball extends THREE.Object3D {
    
    constructor(){
        super();

        // Mathematical description
        this.mass = 0.6;
        this.radius = 3;

        // 1 - THREE object
        this.geometry = new THREE.SphereGeometry(this.radius);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.applyMatrix(new THREE.Matrix4().makeTranslation(0, 50, 0));
        this.add(this.mesh);

        // 2- CANNON object
        this.sphereShape = new CANNON.Sphere(this.radius);
        this.contactMaterial = new CANNON.Material();
        this.body = new CANNON.Body({ 
            mass: this.mass, 
            material: this.contactMaterial 
        });
        this.body.addShape(this.sphereShape);
    }

    updatePhysics(){
        // Copy coordinates from Cannon.js world to Three.js'
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}

/*
var size = 0.5;
                var he = new CANNON.Vec3(size,size,size*0.1);
                var boxShape = new CANNON.Box(he);
                var mass = 0;
                var space = 0.1 * size;
                var N = 5, last;
                var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
                for(var i=0; i<N; i++){
                    var boxbody = new CANNON.Body({ mass: mass });
                    boxbody.addShape(boxShape);
                    var boxMesh = new THREE.Mesh(boxGeometry, material);
                    boxbody.position.set(5,(N-i)*(size*2+2*space) + size*2+space,0);
                    boxbody.linearDamping = 0.01;
                    boxbody.angularDamping = 0.01;
                    // boxMesh.castShadow = true;
                    boxMesh.receiveShadow = true;
                    world.addBody(boxbody);
                    scene.add(boxMesh);
                    boxes.push(boxbody);
                    boxMeshes.push(boxMesh);
*/