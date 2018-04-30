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

$("#instructions").hide();

$("#instructionsButton").click(function(){
    $("#glcanvas").hide();
    $("#restartButton").hide();
    $("#instructionsButton").hide();
    $("#instructions").show();
});

$("#confirmStartButton").click(function(){
    $("#glcanvas").show();
    $("#restartButton").show();
    $("#instructionsButton").show();
    $("#instructions").hide();
});

$("#restartButton").click(function(){
    score = 0;
    restart = true;
});

var restart = false;

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
//camera.position.y = 10;

var loader = new THREE.TextureLoader();

var sphereDiameter = 10;
var sphereRadius = sphereDiameter / 2;
var geometry = new THREE.SphereGeometry(sphereDiameter, 32, 32);

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

var catcherDiameter = 20;
var catcherRadius = catcherDiameter / 2;
var catcherGeometry = new THREE.CylinderGeometry( catcherDiameter, catcherDiameter, 10, 24 );
var catcher = new THREE.Mesh(catcherGeometry);
createCatcher(catcher);



//create the pillow textured catcher and add it to the scene

function createCatcher(catcher){
    var texture = loader.load("resources/pillow-texture.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 3, 3 );
    texture.anisotropy = 16;
    var catcherMaterial = new THREE.MeshLambertMaterial( { map: texture } );
    catcher.material = catcherMaterial;

    catcher.receiveShadow = true;
    catcher.castShadow = true;
    catcher.position.set(0, -49, -85);      //change catcher position in scene
    scene.add(catcher);
}


//create the wooden basket and add it to the scene

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
    woodenBasket.position.set(160, -49, -160);    //change basket position scene
    scene.add(woodenBasket);
}


//sphere movement and creation

function createSphere(sphere, material){
    sphere.castShadow = true;
    scene.add(sphere);
    modifySphere(sphere, material);
}

function modifySphere(sphere, material){
    var sphereXpos = Math.floor(Math.random() * 440) - 220;
    var sphereColor = Math.floor(Math.random() * 4);
    material.color = new THREE.Color( colorArray[sphereColor]);
    sphere.material = material;
    sphere.position.z = -Math.floor(Math.random() * 200) - 100;
    sphere.position.y = 120;
    sphere.position.x = sphereXpos;
}

function floatSphere(sphere, material, rotSpeedX, rotSpeedY, fallSpeedY){
    sphere.rotation.x += rotSpeedX;
    sphere.rotation.y += rotSpeedY;

    if(sphere.position.y  - sphereRadius >= -49.5) {
        if(isSphereOnCatcher(sphere)) {
            updateScoreboard();
            modifySphere(sphere, material);
        }
        else
            sphere.position.y -= fallSpeedY;
    }
    else {
        modifySphere(sphere, material);
    }
}

function isSphereOnCatcher(sphere){
    var zPos = sphere.position.z;
    var xPos = sphere.position.x;
    var yPos = sphere.position.y - sphereRadius;
    if(((zPos + sphereRadius <= catcher.position.z + catcherRadius)
            && (zPos + sphereRadius >= catcher.position.z - catcherRadius)) ||
        ((zPos - sphereRadius <= catcher.position.z + catcherRadius)
            && (zPos - sphereRadius >= catcher.position.z - catcherRadius))) {

        if (((xPos + sphereRadius <= catcher.position.x + catcherRadius)
                && (xPos + sphereRadius >= catcher.position.x - catcherRadius)) ||
            ((xPos - sphereRadius <= catcher.position.x + catcherRadius)
                && (xPos - sphereRadius >= catcher.position.x - catcherRadius))){
            if (yPos <= catcher.position.y) {

                return true;

            }
        }
    }
    return false;
}

var score = 0;

function updateScoreboard(){
    score++;
    displayScore();
    //console.log(score);
}

var curDate = new Date();
var then = curDate.getSeconds();
var sumSec = 0;
var id;


//lighting the scene

function addLights(){
    scene.add( new THREE.AmbientLight( 0xcccccc ) );
    var spotlight = new THREE.SpotLight(0xffffff);
    spotlight.position.set(0, 300, -50);
    spotlight.castShadow = true;
    spotlight.shadow.camera.far = 1000;
    scene.add(spotlight);

  /*  var helper = new THREE.CameraHelper( spotlight.shadow.camera );
    scene.add( helper );*/
}


//create the floor

var floor;

function createFloor(){
    var groundTexture = loader.load('resources/wooden-floor.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 5, 5 );
    groundTexture.anisotropy = 16;

    var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
    floor = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1000, 1000 ), groundMaterial );
    floor.position.y = - 50;
    floor.rotation.x = - Math.PI / 2;  //make the floor parallel with the camera
    floor.receiveShadow = true;
    scene.add( floor );
}



//remove all elements of the scene before showing the "game won" scene

function clearCanvas(){
    geometry.dispose();
    material1.dispose(); material2.dispose(); material3.dispose(); material4.dispose(); material5.dispose();
    scene.remove( sphere1 ); scene.remove( sphere2 ); scene.remove( sphere3 ); scene.remove( sphere4 ); scene.remove( sphere5 );
    scene.remove(catcher);
    scene.remove(woodenBasket);
    scene.remove(scoreText);
    renderer.setClearColor (0xffffff, 1);
    renderer.clear(true, true, true);
}



//score keeping geometry

var fontLoader = new THREE.FontLoader();
var textGeometry;
var scoreText;
var scoreFont;

fontLoader.load( 'fonts/helvetiker_regular.typeface.json',
    function (font ) {
        scoreFont = font;
    }
);

function displayScore(){
    scene.remove(scoreText);
    textGeometry = new THREE.TextGeometry( score + '', {
        font: scoreFont,
        size: 30,
        height: 5,
        curveSegments: 2,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 0.5,
        bevelSegments: 5
    });
    scoreText = new THREE.Mesh(textGeometry);
    scoreText.rotation.x = 0.1;
    if(score < 10)
        scoreText.position.set(130, -11, -140);
    else
        scoreText.position.set(120, -11, -140);
    scene.add(scoreText);

}

function render() {
    var newDate = new Date();
    sumSec = newDate.getSeconds();
    if(restart) {

        window.location.replace(window.location.href);

    }
    else
        if(score === 20){
            cancelAnimationFrame(id);
            clearCanvas();
            main();
        }
        else {
            id = requestAnimationFrame(render);
            floatSphere(sphere1, material1, 1, 2, 0.91);
            floatSphere(sphere2, material2, 1, 1, 0.35);
            floatSphere(sphere3, material3, 2, 1, 0.73);
            floatSphere(sphere4, material4, 1, 3, 0.25);
            floatSphere(sphere5, material5, 3, 2, 0.55);
            renderer.render( scene, camera );
        }
};


createFloor();
addLights();
render();



