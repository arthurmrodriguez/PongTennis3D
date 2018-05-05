import * as THREE from 'three';
import Scene from './Scene';

// Main variables
var container, scene, renderer, views;

// Array of different views we're having (two players)
views = [
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

    // Getting the HTML container in which we will draw everything
    container = document.getElementById('container');

    // Every single view will have a camera attached
    for(var i=0; i<views.length; i++){
        var view = views[i];
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 5000);
        camera.position.fromArray(view.position);
        view.camera = camera;
    }

    // The scene with the court, players & stuff
    scene = new Scene();

    // The renderer
    renderer = createRenderer();
    container.appendChild(renderer.getDomElement());
}

function animate(){
    render();
    requestAnimationFrame(animate);
}


function render(){


    for ( var ii = 0; ii < views.length; ++ii ) {

        var view = views[ii];
        var camera = view.camera;
        renderer.setViewport( left, top, width, height );
        renderer.setScissor( left, top, width, height );
        renderer.setScissorTest( true );
        renderer.setClearColor( view.background );
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render( scene, camera );
    }


}








