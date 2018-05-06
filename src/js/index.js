import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as TrackballControls from 'three-trackballcontrols';
import Scene from './Scene';

// Main variables
var scene, renderer, world;

// Time of step in CANNON's world. Equal to a maximum of 60 FPS
var timeStep = 1/60;

// Two players, two cameras. Trackball Controls to walk around the scene
var playerOneCamera, playerOneControls;
var playerTwoCamera, playerTwoControls;

// Methods to run on load
initThree();
initCannon();
animate();

/**
 * Method to create scene renderer
 */
function createRenderer(){
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setClearColor(new THREE.Color(0xe6e6fa), 1); // Background color
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.style.margin = '0 auto';
    document.body.appendChild( renderer.domElement );
}

/**
 * Method to generate the two cameras
 */
function createCameras(){
    // Player one - camera
    playerOneCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    playerOneCamera.position.y = 200;
    playerOneCamera.position.z = 500;
    playerOneCamera.lookAt(new THREE.Vector3(0, 0, 0));
    playerOneControls = new TrackballControls(playerOneCamera, renderer);

    // Player two - camera
    playerTwoCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    playerTwoCamera.position.y = 200;
    playerTwoCamera.position.z = -500;
    playerTwoCamera.lookAt(new THREE.Vector3(0, 0, 0));
    playerTwoControls = new TrackballControls(playerTwoCamera, renderer);
}

/**
 * Function which initialises the THREE parameters
 */
function initThree(){
    // The scene with the court, players & stuff
    scene = new Scene();

    // Views
    createCameras();

    // The renderer
    createRenderer();
}

/**
 * Function which initialises the CANNON world and its parameters
 */
function initCannon(){
    // The cannon world. It handles physics
    world = new CANNON.World();
    world.gravity.set(0, -4, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 5;
}

/**
 * 
 */
function animate(){
    // Load this method in every frame
    requestAnimationFrame(animate);

    // Update physics world, stepping CANNON world and waiting for collisions
    updatePhysics();

    // Infinite loop
    render();
}

/**
 * 
 */
function updatePhysics(){
    // Step the physics world
    world.step(timeStep);

    // Copy coordinates from Cannon.js world to Three.js'
    //mesh.position.copy(body.position);
    //mesh.quaternion.copy(body.quaternion);
}

/**
 * 
 */
function updateCameras(){
    var left, bottom, width, height;

    left = 0.5 * window.innerWidth + 1; bottom = 0.5; width = 0.5 * window.innerWidth - 2; height = window.innerHeight - 2;
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.setScissorTest(true);
    playerOneCamera.aspect = width / height;
    playerOneCamera.updateProjectionMatrix();
    renderer.render(scene, playerOneCamera);
    playerOneControls.update();

    left = 1; bottom = 1; width = 0.5 * window.innerWidth - 2; height = window.innerHeight - 2;
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.setScissorTest(true);
    playerTwoCamera.aspect = width / height;
    renderer.render(scene, playerTwoCamera);
    playerTwoCamera.updateProjectionMatrix();
    playerTwoControls.update();
}

/**
 * 
 */
function render() {
    // Update the camera position and its trackball controls
    updateCameras();
}