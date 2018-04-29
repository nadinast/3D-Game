function onUserKeyDown(event) {
    var keyCode = event.which;
    if(keyCode == 37)  //left key pressed
        catcher.position.x -= 4;
    else if(keyCode == 39) // right key pressed
        catcher.position.x += 4;
    else if(keyCode == 38)
        catcher.position.z -= 4;
    else if(keyCode == 40)
        catcher.position.z += 4;
}
document.addEventListener("keydown", onUserKeyDown, false);

var colorArray = ["yellow", "red", "green", "blue"];

var aspect = window.innerWidth / window.innerHeight;

var canvas = document.getElementById("glcanvas");

var renderer = new THREE.WebGLRenderer({canvas: canvas});

var scene = new THREE.Scene();
scene.background =  new THREE.Color("skyblue");

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

var camera = new THREE.PerspectiveCamera( 60, aspect, 0.1, 1000 );
camera.position.z = 20;

var loader = new THREE.TextureLoader();

var geometry = new THREE.SphereGeometry(0.5, 32, 32);
var material1 = new THREE.MeshPhongMaterial({reflectivity: .5, refractionRatio: 1});
var material2 = new THREE.MeshPhongMaterial({reflectivity: .5, refractionRatio: 1});
var material3 = new THREE.MeshPhongMaterial({reflectivity: .5, refractionRatio: 1});
var material4 = new THREE.MeshPhongMaterial({reflectivity: .5, refractionRatio: 1});;
var material5 = new THREE.MeshPhongMaterial({reflectivity: .5, refractionRatio: 1});;
var sphere1 = new THREE.Mesh( geometry, material1 );
var sphere2 = new THREE.Mesh( geometry, material2 );
var sphere3 = new THREE.Mesh( geometry, material3 );
var sphere4 = new THREE.Mesh( geometry, material4 );
var sphere5 = new THREE.Mesh( geometry, material5 );
createSphere(sphere1, material1);
createSphere(sphere2, material2);
createSphere(sphere3, material3);
createSphere(sphere4, material4);
createSphere(sphere5, material5);

var woodenBasket;
createWoodenBasket(woodenBasket);

var catcherGeometry = new THREE.CylinderGeometry( 20, 20, 10, 24 );
var catcher = new THREE.Mesh(catcherGeometry);
createCatcher(catcher);

function createCatcher(catcher){
    var texture = loader.load("resources/pillow-texture.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 3, 3 );
    texture.anisotropy = 16;
    var catcherMaterial = new THREE.MeshLambertMaterial( { map: texture } );
    catcher.material = catcherMaterial;

    catcher.receiveShadow = true;
    catcher.castShadow = true;
    catcher.position.set(0, -47, -85);      //change catcher position in scene
    scene.add(catcher);

}

function createWoodenBasket(woodenBasket){
    var geometry = new THREE.CylinderGeometry( 23, 10, 70, 24);
    var texture = loader.load("resources/basket-texture.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 5, 5 );
    texture.anisotropy = 32;
    var boxMaterial = new THREE.MeshLambertMaterial( { map: texture } );
    woodenBasket = new THREE.Mesh(geometry, boxMaterial );

    woodenBasket.receiveShadow = true;
    woodenBasket.castShadow = true;
    woodenBasket.rotation.x = 0.05;
    woodenBasket.position.set(160, -47, -160);    //change basket position scene
    scene.add(woodenBasket);
}

function createSphere(sphere, material){
    sphere.castShadow = true;
    scene.add(sphere);
    modifySphere(sphere, material);
}

function modifySphere(sphere, material){
    var sphereXpos = Math.floor(Math.random() * 20) - 10;
    var sphereColor = Math.floor(Math.random() * 4);
    material.color = new THREE.Color( colorArray[sphereColor]);
    sphere.material = material;
    sphere.position.z = -Math.floor(Math.random() * 20);
    sphere.position.y = Math.abs(sphere.position.z) + 20;
    sphere.position.x = sphereXpos;
}

function floatSphere(sphere, material, rotSpeedX, rotSpeedY, fallSpeedY){
    sphere.rotation.x += rotSpeedX;
    sphere.rotation.y += rotSpeedY;
    if(sphere.position.y > -12)
        sphere.position.y -= fallSpeedY;
    else {
        modifySphere(sphere, material);
    }
}

var curDate = new Date();
var then = curDate.getSeconds();
var sumSec = 0;
var id;

function addLights(){
    scene.add( new THREE.AmbientLight( 0xcccccc ) );
    var spotlight = new THREE.SpotLight(0xffffff);
    spotlight.position.set(0, 12, 12);
    spotlight.castShadow = true;
    spotlight.shadow.camera.far = 1000;
    scene.add(spotlight);

    var helper = new THREE.CameraHelper( spotlight.shadow.camera );
    scene.add( helper );
}

var floor;

function createFloor(){
    var groundTexture = loader.load('resources/wooden-floor.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 5, 5 );
    groundTexture.anisotropy = 16;

    var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
    floor = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), groundMaterial );
    floor.position.y = - 50;
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add( floor );
}

function clearCanvas(){
    geometry.dispose();
    material1.dispose(); material2.dispose(); material3.dispose(); material4.dispose();
    scene.remove( sphere1 ); scene.remove( sphere2 ); scene.remove( sphere3 ); scene.remove( sphere4 );
    renderer.setClearColor (0xffffff, 1);
    renderer.clear(true, true, true);
}

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
        floatSphere(sphere1, material1, 0.03, 0.01, 0.1);
        floatSphere(sphere2, material2, 0.04, 0.01, 0.05);
        floatSphere(sphere3, material3, 0.03, 0.01, 0.13);
        floatSphere(sphere4, material4, 0.05, 0.05, 0.07);
        floatSphere(sphere5, material5, 0.09, 0.03, 0.05);
        renderer.render( scene, camera );
    //}
};

createFloor();
addLights();
render();



