import * as THREE from 'three';
import Renderer from './Renderer';
import Scene from './Scene';

// HTML container which is filled with the app content
var container;

// array of the different views we're having (two players)
var views = [
    {
        left: 0,
        top: 0,
        width: 0.5,
        height: 1.0,
        background: new THREE.Color(0.5, 0.5, 0.7),
        position: new THREE.Vector3(0, 300, 1000),
        lookAt: new THREE.Vector3(0, 0, 0)
    },
    {
        left: 0.5,
        top: 0,
        width: 0.5,
        height: 1.0,
        background: new THREE.Color(0.5, 0.7, 0.7),
        position: new THREE.Vector3(0, 300, -1000),
        lookAt: new THREE.Vector3(0, 0, 0)
    }
];

// it defines a unique scene with a court. It will be seen from two positions
var scene;

//
var renderer;

function computeKey(event){
    // to be filled with the keyboard commands to play
}

function init(){
    // getting the HTML container in which we will draw everything
    container = document.getElementById('container');
    
    // a view, a camera
    for(var i=0; i<views.length; i++){
        var view = views[i];
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 5000);
        camera.position.fromArray(view.position);
        view.camera = camera;
    }

    // the scene with the court, players & stuff
    scene = new Scene(renderer.getDomElement());

    // the renderer
    renderer = new Renderer(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.getDomElement());
}

function render(){
    // to be filled with a request animation, and with one scene with two cameras
}
