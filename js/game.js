var colorArray = ["yellow", "red", "green", "blue"];

var aspect = window.innerWidth / window.innerHeight;

var canvas = document.getElementById("glcanvas");

var renderer = new THREE.WebGLRenderer({canvas: canvas});
var scene = new THREE.Scene();
scene.background =  new THREE.Color("skyblue");

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
camera.position.z = 5;

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-50, 50, 20);
scene.add(spotLight);

var material1 = new THREE.MeshPhongMaterial();
var material2  = new THREE.MeshPhongMaterial();
var material3  = new THREE.MeshPhongMaterial();
var material4  = new THREE.MeshPhongMaterial();
var geometry = new THREE.BoxGeometry( 0.25, 0.25, 0.25 );
var cube1 = new THREE.Mesh( geometry, material1 );
var cube2 = new THREE.Mesh( geometry, material2 );
var cube3 = new THREE.Mesh( geometry, material3 );
var cube4 = new THREE.Mesh( geometry, material4 );

createCube(cube1, material1);
createCube(cube2, material2);
createCube(cube3, material3);
createCube(cube4, material4);

function createCube(cube, material){
    scene.add(cube);
    modifyCube(cube, material);
}

function modifyCube(cube, material){
    var cubeXpos = Math.floor(Math.random() * 16) - 8;
    var cubeColor = Math.floor(Math.random() * 4);
    material.color = new THREE.Color( colorArray[cubeColor]);
    cube.material = material;
    cube.position.y = 5;
    cube.position.x = cubeXpos;
}

function floatCube(cube, material, rotSpeedX, rotSpeedY, fallSpeedY){
    cube.rotation.x += rotSpeedX;
    cube.rotation.y += rotSpeedY;
    if(cube.position.y > -5)
        cube.position.y -= fallSpeedY;
    else {
        modifyCube(cube, material);
    }
}

var curDate = new Date();
var then = curDate.getSeconds();
var sumSec = 0;
var id;

function render() {
    var newDate = new Date();
    sumSec = newDate.getSeconds();
   /* if(sumSec - then > 3) {
        cancelAnimationFrame(id);
        clearCanvas();
        //main();
    }*/
    //else {
        id = requestAnimationFrame(render);
        floatCube(cube1, material1, 0.03, 0.01, 0.1);
        floatCube(cube2, material2, 0.06, 0.01, 0.05);
        floatCube(cube3, material3, 0.03, 0.01, 0.13);
        floatCube(cube4, material4, 0.03, 0.05, 0.07);
        renderer.render( scene, camera );
    //}
};

function clearCanvas(){
    geometry.dispose();
    material1.dispose(); material2.dispose(); material3.dispose(); material4.dispose();
    scene.remove( cube1 ); scene.remove( cube2 ); scene.remove( cube3 ); scene.remove( cube4 );
    renderer.setClearColor (0xffffff, 1);
    renderer.clear(true, true, true);
}
render();


