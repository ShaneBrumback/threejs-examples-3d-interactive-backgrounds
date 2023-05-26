////////////////////////////////////////////////////////////////////////////////////////////
///                                                                                      ///
///  Developer Interactive UIUX  2021-2022                                               ///
///  Contact Shane Brumback https://www.shanebrumback.com                                ///
///  Message me for questions about any of my projects                                   ///
///                                                                                      ///
///                                                                                      ///
////////////////////////////////////////////////////////////////////////////////////////////



//Load the required resources from threejs
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import * as THREE from '../build/three.module.js';
import { EffectComposer } from '../jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../jsm/postprocessing/UnrealBloomPass.js';
import Stats from '../jsm/libs/stats.module.js';
import { GUI } from '../jsm/libs/lil-gui.module.min.js';

//set up the variables for the app
let scene, camera, renderer, controls, manager, sound, stats,
    analyser, composer, bloomPass, meshCube, cubeLight, gui, guiElement;

let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let previousTime = 0;
const rotationSpeed = 0.08; // Adjust this value to control the rotation speed


//create the parameters for post processing
const params = {
    exposure: 10,
    bloomStrength: .5,
    bloomThreshold: 1.5,
    bloomRadius: .15
};

init();



//initialize threejs
function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 4000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setClearColor(0x000000, .5); // The second parameter (0) represents transparency (0-1)
    renderer.domElement.style.position = 'fixed'
    renderer.domElement.style.zIndex = '-1'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.top = '0'
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(604, -337, 316);
    camera.updateProjectionMatrix();
    controls.update();

    guiElement = document.getElementById("divGui");

    //Stats display (not using at the moment)
    stats = new Stats();
    //guiElement.appendChild(stats.domElement);
    stats.domElement.id = 'stats';

    bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    const renderScene = new RenderPass(scene, camera);

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    composer.renderToScreen = true;

    loadCube();

    cubeLight = new THREE.PointLight(0xFFFFFF);
    cubeLight.position.set(0, 0, 0);
    scene.add(cubeLight);

    const hemiLight = new THREE.AmbientLight(0x404040, 1); // soft white light
    hemiLight.position.set(0, 300, 0);
    scene.add(hemiLight);

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(75, 300, 75);
    scene.add(dirLight);


    // Create a new AudioListener
    var listener = new THREE.AudioListener();

    // Create a new AudioLoader
    var audioLoader = new THREE.AudioLoader();

    // Create a new Audio object and set the listener
    var audio = new THREE.Audio(listener);

    // Load the audio file
    audioLoader.load('sounds/falcon-9-virtual-music.wav', function (buffer) {
        // Set the audio buffer
        audio.setBuffer(buffer);

        // Set audio properties (optional)
        audio.setLoop(true);
        audio.setVolume(0.5);

        // Play the audio
        //audio.play();
    });


    // Add the audio object to your scene or object
    scene.add(audio);

    // Create an event listener for the play icon
    document.getElementById('playIcon').addEventListener('click', function () {
        audio.play();
        document.getElementById('playIcon').style.display = 'none';
        document.getElementById('pauseIcon').style.display = 'inline-block';
    });

    // Create an event listener for the pause icon
    document.getElementById('pauseIcon').addEventListener('click', function () {
        audio.pause();
        document.getElementById('pauseIcon').style.display = 'none';
        document.getElementById('playIcon').style.display = 'inline-block';
    });


    window.addEventListener('pointermove', onPointerMove);

    var playButton = document.getElementById('divPlayButton');
    //playButton.addEventListener('pointerdown', playNow);

    window.addEventListener('resize', onWindowResize);


    // Start the animation loop
    animate(performance.now());

}

//handles pc and mobile pointer movement
function onPointerMove(event) {

    if (event.isPrimary === false) return;

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

//handles window resize events
function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);

    try {


        if (window.innerWidth <= 800) {

            document.getElementById("divGui").style.display = 'none';

        } else {

            document.getElementById("divGui").style.display = 'block';
        }

    } catch (error) {

    }



}

//handles animating the canvas and 
//sound interactive objects
function animate(currentTime) {

    requestAnimationFrame(animate);
    controls.update();

    camera.position.x += (mouseX - camera.position.x) * 0.005;
    camera.position.y += (- mouseY - camera.position.y) * 0.005;

    const time = Date.now() * 0.001;

    if (sound) {

        let freq = Math.round(getAverageFrequency() / 2);
        bloomPass.threshold = freq / 100;
        renderer.toneMappingExposure = Math.pow(1 + (freq / 50), 4.0) * Math.sin(time * .10);
        bloomPass.strength = .5;
        bloomPass.radius = freq / 200;
        document.getElementById("divRange").style.width = ((freq * (500)) / 100) + 'px';
        document.getElementById("divRangeFooter").style.width = ((freq * (500)) / 100) + 'px';

    }

   // meshCube.rotation.x = time * 0.25;
   // meshCube.rotation.y = time * 0.5;

    // Calculate delta time
    const deltaTime = (currentTime - previousTime) / 1000;

    // Update cube rotation based on delta time
    meshCube.rotation.y += rotationSpeed * deltaTime;
    meshCube.rotation.z += (rotationSpeed * 2) * deltaTime;

    // Store current time for next frame
    previousTime = currentTime;

    camera.lookAt(meshCube.position);
    camera.updateProjectionMatrix();


    //stats.update();  (not using at the moment)

    //composer.render();

    // Render the scene
    renderer.render(scene, camera);

 
};


//handles loading 1000000 polygons
function loadCube() {


    const triangles = 100000;

    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const normals = [];
    const colors = [];

    const color = new THREE.Color();

    const n = 800, n2 = n / 2;  // triangles spread in the cube
    const d = 12, d2 = d / 2;   // individual triangle size

    const pA = new THREE.Vector3();
    const pB = new THREE.Vector3();
    const pC = new THREE.Vector3();

    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();

    for (let i = 0; i < triangles; i++) {

        // positions

        const x = Math.random() * n - n2;
        const y = Math.random() * n - n2;
        const z = Math.random() * n - n2;

        const ax = x + Math.random() * d - d2;
        const ay = y + Math.random() * d - d2;
        const az = z + Math.random() * d - d2;

        const bx = x + Math.random() * d - d2;
        const by = y + Math.random() * d - d2;
        const bz = z + Math.random() * d - d2;

        const cx = x + Math.random() * d - d2;
        const cy = y + Math.random() * d - d2;
        const cz = z + Math.random() * d - d2;

        positions.push(ax, ay, az);
        positions.push(bx, by, bz);
        positions.push(cx, cy, cz);

        // flat face normals

        pA.set(ax, ay, az);
        pB.set(bx, by, bz);
        pC.set(cx, cy, cz);

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);

        cb.normalize();

        const nx = cb.x;
        const ny = cb.y;
        const nz = cb.z;

        normals.push(nx, ny, nz);
        normals.push(nx, ny, nz);
        normals.push(nx, ny, nz);

        // colors

        const vx = (x / n) + 0.5;
        const vy = (y / n) + 0.5;
        const vz = (z / n) + 0.5;

        color.setRGB(vx, vy, vz);

        const alpha = Math.random();

        colors.push(color.r, color.g, color.b, alpha);
        colors.push(color.r, color.g, color.b, alpha);
        colors.push(color.r, color.g, color.b, alpha);

    }

    function disposeArray() {

        this.array = null;

    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3).onUpload(disposeArray));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3).onUpload(disposeArray));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4).onUpload(disposeArray));

    geometry.computeBoundingSphere();

    const material = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
        side: THREE.DoubleSide,
        vertexColors: true,
        transparent: false,
        opacity: .95
    });

    meshCube = new THREE.Mesh(geometry, material);
    meshCube.scale.set(.5, .5, .5);
    scene.add(meshCube);


}