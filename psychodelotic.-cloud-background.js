
function init() {
    // Create renderer
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 4000);
    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setClearColor(0x000000, .5); // The second parameter (0) represents transparency (0-1)
    renderer.domElement.style.position = 'fixed'
    renderer.domElement.style.zIndex = '-3'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.top = '0'
    document.body.appendChild(renderer.domElement);

    let ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);

    let directionalLight = new THREE.DirectionalLight(0xff8c19);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    let orangeLight = new THREE.PointLight('orange', 100, 450, 1);
    orangeLight.position.set(200, 300, 100);
    scene.add(orangeLight);

    let redLight = new THREE.PointLight(0xd8547e, 25, 450, 1);
    redLight.position.set(200, 300, 100);
    scene.add(redLight);

    let blueLight = new THREE.PointLight(0x3677ac, 25, 450, 1);
    blueLight.position.set(300, 300, 200);
    scene.add(blueLight);

    let whiteLight = new THREE.PointLight('white', 25, 450, 1);
    whiteLight.position.set(300, 300, 200);
    scene.add(whiteLight);

    // Load the smoke texture
    const textureLoader = new THREE.TextureLoader();
    const smokeTexture = textureLoader.load('../images/smoke.png');

    // Create 50 planes with smoke texture
    const planes = [];

    const colors = [0xff0000, 0xffffff, 0x0000ff, 0xffa500]; // Red, White, Blue, Orange

    for (let i = 0; i < 50; i++) {
        const planeGeometry = new THREE.PlaneGeometry(50, 50);

        const planeMaterial = new THREE.MeshPhongMaterial({
            map: smokeTexture,
            transparent: true,
            opacity: .85,
            depthTest: false,
            color: colors[i % colors.length],
        });

        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        scene.add(planeMesh);

        planeMesh.position.set(
            Math.random() * 60 - 30,
            Math.random() * 60 - 30,
            Math.random() * 60 - 30
        );

        const lookAtVector = new THREE.Vector3();
        lookAtVector.subVectors(camera.position, planeMesh.position);
        planeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), lookAtVector.normalize());

        const speed = Math.random() * 0.005;

        planeMesh.userData.speed = speed;
        planes.push(planeMesh);
    }

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the planes
        for (const plane of planes) {
            plane.rotateOnAxis(new THREE.Vector3(0, 0, 1), plane.userData.speed);
        }

        // Animate the point lights
        orangeLight.position.x = Math.sin(Date.now() * 0.001) * 200;
        orangeLight.position.y = Math.cos(Date.now() * 0.001) * 200;

        redLight.position.x = Math.sin(Date.now() * 0.001) * 300;
        redLight.position.y = Math.cos(Date.now() * 0.001) * 300;

        blueLight.position.x = Math.sin(Date.now() * 0.002) * 400;
        blueLight.position.y = Math.cos(Date.now() * 0.002) * 400;

        whiteLight.position.x = Math.sin(Date.now() * 0.002) * 400;
        whiteLight.position.y = Math.cos(Date.now() * 0.002) * 400;


        // Move the cube
        orangeLight.position.x += .5;
        orangeLight.position.y += .5

        //Move the cube
        blueLight.position.x += .5;
        blueLight.position.y -= .5;

        // Render the scene
        renderer.render(scene, camera);
    }

    // Start the animation loop
    animate();
}

// Call the init function to start the scene
init();
