import * as THREE from 'three';
import Scene from './Scene';

// Main variables
var scene, renderer, views;

// Array of different views we're having (two players)
views = [
    {
        left: 0,
        top: 0,
        width: 0.5,
        height: 1.0,
        background: new THREE.Color(0.5, 0.5, 0.7),
        position: new THREE.Vector3(10, 0, 0)
    },
    {
        left: 0.5,
        top: 0,
        width: 0.5,
        height: 1.0,
        background: new THREE.Color(0.5, 0.7, 0.7),
        position: new THREE.Vector3(0, 0, 10)
    }
];


init();
animate();

/**
 * Method to create scene renderer
 * @returns {WebGLRenderer}
 */
function createRenderer(){
    var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setClearColor(new THREE.Color(0x000000), 0); // Background color
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );
    return renderer;
}

function init(){
    // The scene with the court, players & stuff
    scene = new THREE.Scene();
    var cube = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshPhongMaterial(0x00ff00));
    scene.add(cube);

    // Every single view will have a camera attached
    for(var i=0; i<views.length; i++){
        var view = views[i];
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 5000);
        camera.position.fromArray(view.position);
        camera.lookAt = scene.position;
        view.camera = camera;
    }

    // The renderer
    renderer = createRenderer();
}

function animate(){
    requestAnimationFrame(animate);
    render();
}

function render() {
    for (var ii = 0; ii < views.length; ++ii) {
        var view = views[ii];
        var camera = view.camera;
        var left = Math.floor(window.innerWidth * view.left);
        var top = Math.floor(window.innerHeight * view.top);
        var width = Math.floor(window.innerWidth * view.width);
        var height = Math.floor(window.innerHeight * view.height);
        renderer.setViewport(left, top, width, height);
        renderer.setScissor(left, top, width, height);
        renderer.setScissorTest(true);
        renderer.setClearColor(view.background);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }
}