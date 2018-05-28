import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import $ from 'jquery';
import Scene from './Scene';
import Player from './Player';
import Config from './Config';
import Camera from './Camera';

// Main variables
var scene, renderer, debugRenderer;

// Two players, two cameras. Trackball Controls to walk around the scene
var playerOneCamera, playerOneControls;
var playerTwoCamera, playerTwoControls;

//// Methods to run on load
// Init world, players, parameters and all that stuff
init();

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
    playerOneControls = new TrackballControls(playerOneCamera, renderer);
    playerTwoCamera = new Camera(true);
    playerTwoControls = new TrackballControls(playerTwoCamera, renderer);
}

/**
 * Function which initialises the THREE parameters
 */
function init(){
    // The scene with the court, players & stuff
    scene = new Scene();

    // Dispose scoreboard and keys helpers
    initializeGameParameters();
    scene.updateServingPlayer();
    
    // Views
    createCameras();
    
    // The renderer
    createRenderer();
}

/**
 * Reiterative call. It displays and updates everything on the browser
 */
function animate(){
    // Load this method in every frame
    requestAnimationFrame(animate);

    if (!scene.pausedGame){
        // Update physics world, stepping CANNON world and waiting for collisions
        scene.updateMeshPosition();

        // Reload cameras and points of view
        updateCameras();
    }
}

/**
 * Needed to display two different cameras with a single renderer
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
    playerTwoCamera.updateProjectionMatrix();
    renderer.render(scene, playerTwoCamera);
    playerTwoControls.update();
}

/**
 * Event triggered when a key starts being pressed
 */
function computeKeyDown(event) {
    if(!scene.pausedGame)
        scene.computeKeyDown(event);
}

/**
 * Event triggered when a key stops being pressed
 */
function computeKeyUp(event) {
    if(!scene.pausedGame)
        scene.computeKeyUp(event);
}

/**
 * It's used to link with external dependencies, such as fonts, icons, etc.
 */
function linkHTMLDependencies() {
    // Links to external font
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css?family=East+Sea+Dokdo';
    head.appendChild(link);

    // Links to external icons
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://use.fontawesome.com/releases/v5.0.13/css/all.css';
    link.integrity = 'sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp';
    link.crossOrigin = 'anonymous';
    head.appendChild(link);
}

/**
 * It displays a container used to define the parameters of the game (such as games, sets, etc)
 */
function initializeGameParameters() {
    // Link needed external dependencies (fonts, etc.)
    linkHTMLDependencies();
    createUIElements();

    // Generic div
    var matchOptions = document.createElement('div');
    matchOptions.setAttribute('id', 'matchOptions');
    matchOptions.style.width = '30vw';
    matchOptions.style.height = '30vh';
    matchOptions.style.marginLeft = '30vw';
    matchOptions.style.marginTop = '25vh';
    matchOptions.style.backgroundColor = '#404040';
    matchOptions.style.boxShadow = '0px 0px 30px 5px rgba(48,48,48,1)';
    matchOptions.style.fontFamily = 'sans-serif';
    matchOptions.style.color = 'white';
    matchOptions.style.position = 'absolute';
    matchOptions.style.textAlign = 'center';
    matchOptions.style.paddingTop = matchOptions.style.paddingBottom = '5vh';
    matchOptions.style.paddingLeft = matchOptions.style.paddingRight = '5vw';

    // Radio buttons for chosing the games per set
    var gamesAndSetsForm = document.createElement('div');
    gamesAndSetsForm.appendChild(document.createTextNode('Choose the number of games per set:'));
    gamesAndSetsForm.appendChild(document.createElement('br'));
    gamesAndSetsForm.appendChild(document.createElement('br'));
    var radioGames3 = document.createElement('input');
    radioGames3.setAttribute('type', 'radio');
    radioGames3.setAttribute('name', 'games');
    radioGames3.setAttribute('value', '3');
    radioGames3.checked = true;
    gamesAndSetsForm.appendChild(document.createTextNode('3 '));
    gamesAndSetsForm.appendChild(radioGames3);
    gamesAndSetsForm.appendChild(document.createElement('br'));
    var radioGames5 = document.createElement('input');
    radioGames5.setAttribute('type', 'radio');
    radioGames5.setAttribute('name', 'games');
    radioGames5.setAttribute('value', '5');
    gamesAndSetsForm.appendChild(document.createTextNode('5 '));
    gamesAndSetsForm.appendChild(radioGames5);
    gamesAndSetsForm.appendChild(document.createElement('br'));
    var radioGames7 = document.createElement('input');
    radioGames7.setAttribute('type', 'radio');
    radioGames7.setAttribute('name', 'games');
    radioGames7.setAttribute('value', '7');
    gamesAndSetsForm.appendChild(document.createTextNode('7 '));
    gamesAndSetsForm.appendChild(radioGames7);
    gamesAndSetsForm.appendChild(document.createElement('br'));

    // Radio buttons for choosing the sets per match
    gamesAndSetsForm.appendChild(document.createElement('br'));
    gamesAndSetsForm.appendChild(document.createElement('br'));
    gamesAndSetsForm.appendChild(document.createTextNode('Choose the number of sets per match:'));
    gamesAndSetsForm.appendChild(document.createElement('br'));
    gamesAndSetsForm.appendChild(document.createElement('br'));
    var radioSets1 = document.createElement('input');
    radioSets1.setAttribute('type', 'radio');
    radioSets1.setAttribute('name', 'sets');
    radioSets1.setAttribute('value', '1');
    radioSets1.checked = true;
    gamesAndSetsForm.appendChild(document.createTextNode('1 '));
    gamesAndSetsForm.appendChild(radioSets1);
    gamesAndSetsForm.appendChild(document.createElement('br'));
    var radioSets3 = document.createElement('input');
    radioSets3.setAttribute('type', 'radio');
    radioSets3.setAttribute('name', 'sets');
    radioSets3.setAttribute('value', '3');
    gamesAndSetsForm.appendChild(document.createTextNode('3 '));
    gamesAndSetsForm.appendChild(radioSets3);
    gamesAndSetsForm.appendChild(document.createElement('br'));
    var radioSets5 = document.createElement('input');
    radioSets5.setAttribute('type', 'radio');
    radioSets5.setAttribute('name', 'sets');
    radioSets5.setAttribute('value', '5');
    gamesAndSetsForm.appendChild(document.createTextNode('5 '));
    gamesAndSetsForm.appendChild(radioSets5);
    gamesAndSetsForm.appendChild(document.createElement('br'));
    gamesAndSetsForm.appendChild(document.createElement('br'));

    // Div for showing the end of the game
    var endOfTheGameDiv = document.createElement('div');
    endOfTheGameDiv.setAttribute('id', 'endOfTheGameDiv');
    endOfTheGameDiv.style.width = '30vw';
    endOfTheGameDiv.style.height = '30vh';
    endOfTheGameDiv.style.marginLeft = '30vw';
    endOfTheGameDiv.style.marginTop = '25vh';
    endOfTheGameDiv.style.backgroundColor = '#404040';
    endOfTheGameDiv.style.boxShadow = '0px 0px 30px 5px rgba(48,48,48,1)';
    endOfTheGameDiv.style.fontFamily = 'East Sea Dokdo, cursive';
    endOfTheGameDiv.style.color = 'white';
    endOfTheGameDiv.style.position = 'absolute';
    endOfTheGameDiv.style.textAlign = 'center';
    endOfTheGameDiv.style.fontSize = '180%';
    endOfTheGameDiv.style.fontWeight = 'bold';
    endOfTheGameDiv.style.paddingTop = '15vh';
    endOfTheGameDiv.style.paddingBottom = '5vh';
    endOfTheGameDiv.style.paddingLeft = endOfTheGameDiv.style.paddingRight = '5vw';
    endOfTheGameDiv.style.display = 'none';
    document.body.appendChild(endOfTheGameDiv);

    // Submit button - it triggers the game with the chosen options
    var submitButton = document.createElement('button');
    submitButton.innerText = 'Play!';
    submitButton.onclick = function() {
        // Hide parameters chooser dialog
        document.getElementById('matchOptions').style.display = 'none';
        document.getElementById('scoreboard').style.display = 'inherit';
        document.getElementById('player1helper').style.display = 'inherit';
        document.getElementById('player2helper').style.display = 'inherit';
        document.getElementById('player1indicator').style.display = 'inherit';
        document.getElementById('player2indicator').style.display = 'inherit';

        // Check chosen option
        scene.gamesPerSet = $('input[name=games]:checked').val();
        scene.setsPerMatch = $('input[name=sets]:checked').val();
        
        // Start the whole game
        scene.pausedGame = false;
        animate();
    };
    gamesAndSetsForm.appendChild(submitButton);

    matchOptions.appendChild(gamesAndSetsForm);
    document.body.appendChild(matchOptions);
}

/**
 * It draws HTML elements on the screen to inform about the score and the controls for each player
 */
function createUIElements() {    
    // Create scoreboard
    var scoreboard = document.createElement('div');
    scoreboard.setAttribute('id', 'scoreboard');
    scoreboard.style.color = 'white';
    scoreboard.style.position = 'absolute';
    scoreboard.style.left = '37.5%';
    scoreboard.style.width = '25%';
    scoreboard.style.height = '17%';
    scoreboard.style.borderBottom = '6px solid green';
    scoreboard.style.borderBottomLeftRadius = '45%';
    scoreboard.style.borderBottomRightRadius = '45%';
    scoreboard.style.textAlign = 'center';
    scoreboard.style.fontSize = '54px';
    scoreboard.style.fontFamily = 'East Sea Dokdo, cursive';
    scoreboard.style.backgroundColor = 'rgba(20, 20, 20, 0.8)';
    var pointsText = document.createElement('div');
    pointsText.setAttribute('id', 'pointsText');
    pointsText.innerText = '0 - 0';
    scoreboard.appendChild(pointsText);
    var gamesText = document.createElement('div');
    gamesText.setAttribute('id', 'gamesText');
    gamesText.style.fontSize = '60%';
    gamesText.innerText = 'Games: 0 - 0';
    scoreboard.appendChild(gamesText);
    var setsText = document.createElement('div');
    setsText.setAttribute('id', 'setsText');
    setsText.style.fontSize = '60%';
    setsText.innerText = 'Sets: 0 - 0';
    scoreboard.appendChild(setsText);
    scoreboard.style.display = 'none';
    document.body.appendChild(scoreboard);

    // Create controls' helper
    // Player 1
    var player1helper = document.createElement('div');
    player1helper.setAttribute('id', 'player1helper');
    player1helper.style.color = 'white';
    player1helper.style.position = 'absolute';
    player1helper.style.left = '0';
    player1helper.style.width = '20%';
    player1helper.style.height = '10%';
    player1helper.style.borderBottomRightRadius = '45%';
    player1helper.style.borderBottom = '3px solid ' + Config.racket.color1;
    player1helper.style.textAlign = 'center';
    player1helper.style.fontSize = '36px';
    player1helper.style.fontFamily = 'East Sea Dokdo, cursive';
    player1helper.style.backgroundColor = 'rgba(20, 20, 20, 0.5)';
    var player1helperText = document.createTextNode('Movement: W,A,S,D');
    player1helper.appendChild(player1helperText);
    player1helper.appendChild(document.createElement('br'));
    var player1helperText2 = document.createTextNode('Rotation: C,V');
    player1helper.appendChild(player1helperText2);
    player1helper.style.display = 'none';
    document.body.appendChild(player1helper);

    // Player 2
    var player2helper = document.createElement('div');
    player2helper.setAttribute('id', 'player2helper');
    player2helper.style.color = 'white';
    player2helper.style.position = 'absolute';
    player2helper.style.right = '0';
    player2helper.style.width = '20%';
    player2helper.style.height = '10%';
    player2helper.style.borderBottomLeftRadius = '45%';
    player2helper.style.borderBottom = '3px solid ' + Config.racket.color2;
    player2helper.style.textAlign = 'center';
    player2helper.style.fontSize = '36px';
    player2helper.style.fontFamily = 'East Sea Dokdo, cursive';
    player2helper.style.backgroundColor = 'rgba(20, 20, 20, 0.5)';
    var player2helperText = document.createTextNode('Movement: Arrow keys');
    player2helper.appendChild(player2helperText);
    player2helper.appendChild(document.createElement('br'));
    var player2helperText2 = document.createTextNode('Rotation: K,L');
    player2helper.appendChild(player2helperText2);
    player2helper.style.display = 'none';
    document.body.appendChild(player2helper);

    // Create serve indicators for both players
    var player1indicator = document.createElement('div');
    player1indicator.setAttribute('id','player1indicator');
    player1indicator.style.color = 'white';
    player1indicator.style.position = 'absolute';
    player1indicator.style.left = '39.5%';
    player1indicator.style.top = '5%';
    player1indicator.style.width = '22px';
    player1indicator.style.height = '22px';
    player1indicator.style.borderRadius = '100%';
    player1indicator.style.backgroundColor = 'rgba(20, 20, 20, 0.5)';
    player1indicator.style.display = 'none';
    document.body.appendChild(player1indicator);

    var player2indicator = document.createElement('div');
    player2indicator.setAttribute('id','player2indicator');
    player2indicator.style.color = 'white';
    player2indicator.style.position = 'absolute';
    player2indicator.style.right = '39.5%';
    player2indicator.style.top = '5%';
    player2indicator.style.width = '22px';
    player2indicator.style.height = '22px';
    player2indicator.style.borderRadius = '100%';
    player2indicator.style.backgroundColor = 'rgba(20, 20, 20, 0.5)';
    player2indicator.style.display = 'none';
    document.body.appendChild(player2indicator);
}

// When ready, load these things
$(function() {
    window.addEventListener('keydown', computeKeyDown, false);
    window.addEventListener('keyup', computeKeyUp, false);
});