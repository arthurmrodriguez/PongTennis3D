import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import $ from 'jquery';
import Scene from './Scene';
import Player from './Player';
import Config from './Config';
import Camera from './Camera';
import './CannonDebugRenderer';

// Main variables
var scene, renderer, debugRenderer;

// Two players, two cameras. Trackball Controls to walk around the scene
var playerOneCamera;
var playerTwoCamera;

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

    // Dispose renderer on web viewport
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.appendChild(renderer.domElement);
}

/**
 * Method to generate the two cameras, depending on the player position
 */
function createCameras(){
    playerOneCamera = new Camera();
    playerTwoCamera = new Camera(true);
}

/**
 * Function which initialises the THREE parameters
 */
function init(){
    // The scene with the court, players & stuff
    scene = new Scene();

    // If necessary, we can preview the CANNON meshes
    //debugRenderer = new THREE.CannonDebugRenderer(scene, scene.world);

    // Dispose scoreboard and keys helpers
    createUIElements();
    
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

    left = 1; bottom = 1; width = 0.5 * window.innerWidth - 2; height = window.innerHeight - 2;
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.setScissorTest(true);
    playerTwoCamera.aspect = width / height;
    renderer.render(scene, playerTwoCamera);
    playerTwoCamera.updateProjectionMatrix();
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

/**
 * 
 */
function linkHTMLDependencies() {
    // Links to external font
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css?family=East+Sea+Dokdo';
    head.appendChild(link);
}

/**
 * 
 */
function createUIElements() {
    // Link needed external dependencies (fonts, etc.)
    linkHTMLDependencies();

    // Create scoreboard
    var scoreboard = document.createElement('div');
    scoreboard.setAttribute('id', 'scoreboard');
    scoreboard.style.color = 'white';
    scoreboard.style.position = 'absolute';
    scoreboard.style.left = '40%';
    scoreboard.style.width = '20%';
    scoreboard.style.height = '7%';
    scoreboard.style.borderBottom = '6px solid green';
    scoreboard.style.borderBottomLeftRadius = '45%';
    scoreboard.style.borderBottomRightRadius = '45%';
    scoreboard.style.textAlign = 'center';
    scoreboard.style.fontSize = '54px';
    scoreboard.style.fontFamily = 'East Sea Dokdo, cursive';
    scoreboard.style.backgroundColor = 'rgba(20, 20, 20, 0.8)';
    var scoreText = document.createTextNode('0 - 0');
    scoreboard.appendChild(scoreText);
    document.body.appendChild(scoreboard);

    // Create controls' helper
    // Player 1
    var player1helper = document.createElement('div');
    player1helper.setAttribute('id', 'player1helper');
    player1helper.style.color = 'white';
    player1helper.style.position = 'absolute';
    player1helper.style.left = '0';
    player1helper.style.width = '20%';
    player1helper.style.height = '7%';
    player1helper.style.borderBottom = '4px solid blue';
    player1helper.style.borderBottomRightRadius = '45%';
    player1helper.style.textAlign = 'center';
    player1helper.style.fontSize = '36px';
    player1helper.style.fontFamily = 'East Sea Dokdo, cursive';
    player1helper.style.backgroundColor = 'rgba(20, 20, 20, 0.8)';
    var player1helperText = document.createTextNode('W,A,S,D');
    player1helper.appendChild(player1helperText);
    document.body.appendChild(player1helper);

    // Player 2
    var player2helper = document.createElement('div');
    player2helper.setAttribute('id', 'player2helper');
    player2helper.style.color = 'white';
    player2helper.style.position = 'absolute';
    player2helper.style.right = '0';
    player2helper.style.width = '20%';
    player2helper.style.height = '7%';
    player2helper.style.borderBottom = '4px solid yellow';
    player2helper.style.borderBottomLeftRadius = '45%';
    player2helper.style.textAlign = 'center';
    player2helper.style.fontSize = '36px';
    player2helper.style.fontFamily = 'East Sea Dokdo, cursive';
    player2helper.style.backgroundColor = 'rgba(20, 20, 20, 0.8)';
    var player2helperText = document.createTextNode('Arrow keys');
    player2helper.appendChild(player2helperText);
    document.body.appendChild(player2helper);
}

// When ready, load these things
$(function() {
    window.addEventListener('keydown', computeKeyDown, false);
    window.addEventListener('keyup', computeKeyUp, false);
});