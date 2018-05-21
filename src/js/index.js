import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import $ from 'jquery';
import Scene from './Scene';
import Player from './Player';
import Config from './Config';
import './CannonDebugRenderer';

// Main variables
var scene, renderer, debugRenderer;

// Two players, two cameras. Trackball Controls to walk around the scene
var playerOneCamera, playerOneControls;
var playerTwoCamera, playerTwoControls;

// Methods to run on load
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
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.appendChild( renderer.domElement );
}

/**
 * Method to generate the two cameras
 */
function createCameras(){
    // Player one - camera
    playerOneCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    playerOneCamera.position.y = Config.court.depth;
    playerOneCamera.position.z = 3*Config.court.depth/2;
    playerOneCamera.lookAt(new THREE.Vector3(0, 0, 0));
    playerOneControls = new TrackballControls(playerOneCamera, renderer);

    // Player two - camera
    playerTwoCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    playerTwoCamera.position.y = Config.court.depth;
    playerTwoCamera.position.z = -(3*Config.court.depth/2);
    playerTwoCamera.lookAt(new THREE.Vector3(0, 0, 0));
    playerTwoControls = new TrackballControls(playerTwoCamera, renderer);
}

/**
 * Function which initialises the THREE parameters
 */
function init(){
    // The scene with the court, players & stuff
    scene = new Scene();

    // If necessary, we can preview the CANNON meshes
    //debugRenderer = new THREE.CannonDebugRenderer(scene, scene.world);

    // Views
    createCameras();

    // The renderer
    createRenderer();
}

/**
 * 
 */
function animate(){
    // Load this method in every frame
    requestAnimationFrame(animate);

    // Update physics world, stepping CANNON world and waiting for collisions
    updateMeshPosition();
    
    // If necessary, we can preview the CANNON meshes
    //debugRenderer.update();

    // Infinite loop
    render();
}

/**
 * 
 */
function updateMeshPosition(){
    scene.updateMeshPosition();
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

/**
 * 
 */
function computeKeyDown(event) {
    scene.computeKeyDown(event);
}

/**
 * 
 */
function computeKeyUp(event) {
    scene.computeKeyUp(event);
}

// When ready, load these things
$(function() {
    window.addEventListener('keydown', computeKeyDown, false);
    window.addEventListener('keyup', computeKeyUp, false);
});