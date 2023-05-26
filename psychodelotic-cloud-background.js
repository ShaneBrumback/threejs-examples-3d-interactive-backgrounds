function init() {
    // Create the scene, camera, and renderer
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 4000);
    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Configure renderer settings
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'fixed'
    renderer.domElement.style.zIndex = '-3'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.top = '0'
    document.body.appendChild(renderer.domElement);

    // Add ambient light to the scene
    let ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);

    // Add directional light to the scene
    let directionalLight = new THREE.DirectionalLight(0xff8c19);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    // Add point lights to the scene
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

    // Create an array to store the planes
    const planes = [];

    // Define colors for the planes
    const colors = [0xff0000, 0xffffff, 0x0000ff, 0xffa500]; // Red, White, Blue, Orange

    // Create 50 planes with smoke texture
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

        // Set random positions for the planes
        planeMesh.position.set(
            Math.random() * 60 - 30,
            Math.random() * 60 - 30,
            Math.random() * 60 - 30
        );

        // Set the plane's orientation towards the camera
        const lookAtVector = new THREE.Vector3();
        lookAtVector.subVectors(camera.position, planeMesh.position);
        planeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), lookAtVector.normalize());

        // Set a random rotation speed for each plane
        const speed = Math.random() * 0.005;
        planeMesh.userData.speed = speed;
        planes.push(planeMesh);
    }

    // Adjust the camera aspect ratio and update renderer size on window resize
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

        // Move the point lights
        orangeLight.position.x += .5;
        orangeLight.position.y += .5;

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
