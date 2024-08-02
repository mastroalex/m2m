function createBabylonScene(container) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);
    ground.material = groundMaterial;
    const groundTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/ground.jpg", scene);
    groundMaterial.diffuseTexture = groundTexture;

    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "alien.glb", scene, function (newMeshes) {
        newMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    });

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
}

// Make the function accessible globally
window.createBabylonScene = createBabylonScene;

function createBabylonScene2(container) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);
    ground.material = groundMaterial;
    const groundTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/ground.jpg", scene);
    //groundMaterial.diffuseTexture = groundTexture;

    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "alien.glb", scene, function (newMeshes) {
        newMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    });

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
}

// Make the function accessible globally
window.createBabylonScene2 = createBabylonScene2;