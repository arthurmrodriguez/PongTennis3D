import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import Scene from './Scene';

// Main variables
var scene, renderer, views;

var playerOneCamera, playerOneControls, playerTwoCamera, playerTwoControls;

init();
animate();

/**
 * Method to create scene renderer
 */
function createRenderer(){
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setClearColor(new THREE.Color(0xe6e6fa), 1); // Background color
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );
}

/**
 * Method to generate the two cameras
 */
function createCameras(){
    playerOneCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    playerOneCamera.position.y = 200;
    playerOneCamera.position.z = 500;
    playerOneCamera.lookAt(new THREE.Vector3(0, 0, 0));
    playerOneControls = new TrackballControls(playerOneCamera, renderer);
    playerTwoCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    playerTwoCamera.position.y = 200;
    playerTwoCamera.position.z = -500;
    playerTwoCamera.lookAt(new THREE.Vector3(0, 0, 0));
    playerTwoControls = new TrackballControls(playerTwoCamera, renderer);
}

function init(){
    // The scene with the court, players & stuff
    scene = new Scene();

    // Views
    createCameras();

    // The renderer
    createRenderer();
}

function animate(){
    requestAnimationFrame(animate);
    render();
}

function render() {
    var left, bottom, width, height;

    left = 1; bottom = 1; width = 0.5 * window.innerWidth - 2; height = window.innerHeight - 2;
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.setScissorTest(true);
    playerTwoCamera.aspect = width / height;
    playerTwoCamera.updateProjectionMatrix();
    renderer.render(scene, playerTwoCamera);

    left = 0.5 * window.innerWidth + 1; bottom = 1; width = 0.5 * window.innerWidth - 2; height = window.innerHeight - 2;
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.setScissorTest(true);
    playerOneCamera.aspect = width / height;
    playerOneCamera.updateProjectionMatrix();
    renderer.render(scene, playerOneCamera);

    playerOneControls.update();
    playerTwoControls.update();

    console.log("ARTHUR");
}