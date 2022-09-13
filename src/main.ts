import './style.css';

import * as BABYLON from 'babylonjs';
import { Keycode } from "keycode.js";
import { float } from 'babylonjs';

const canvas = document.getElementById('app') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

// This creates a basic Babylon Scene object (non-mesh)
const scene = new BABYLON.Scene(engine);

// Camera
const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, 1.15, 10, new BABYLON.Vector3(0, 6, 0), scene, true);

camera.setPosition(new BABYLON.Vector3(50, 20, 0));

// This attaches the camera to the canvas
camera.attachControl(canvas, false);

camera.lowerBetaLimit = 0.1;
camera.upperBetaLimit = (Math.PI / 2) * 0.9;
camera.lowerRadiusLimit = 10;
camera.upperRadiusLimit = 15;

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// Our built-in 'sphere' shape. Params: name, options, scene
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

// Move the sphere upward 1/2 its height
sphere.position.y = 1;

// Our built-in 'ground' shape. Params: name, options, scene
BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

// Sky Box
const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://assets.babylonjs.com/textures/TropicalSunnyDay", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skybox.material = skyboxMaterial;

// Create TPV System:START

// Set Camera Target
camera.setTarget(sphere, true, true);

const speed: float = 0.5;
var keyboardPressed: boolean | string = false;
window.addEventListener("keydown", function (e) {

  keyboardPressed = e.code;

});

window.addEventListener('keyup', function () {

  keyboardPressed = false;

})

scene.onBeforeRenderObservable.add(() => {

  // Character Move
  if (keyboardPressed) {
    var cameraForwardRayPosition = camera.getForwardRay().direction
    var cameraForwardRayPositionWithoutY = new BABYLON.Vector3(cameraForwardRayPosition.x, 0, cameraForwardRayPosition.z)

    sphere.lookAt(sphere.position.add(cameraForwardRayPositionWithoutY), 0, 0, 0);

    switch (keyboardPressed) {
      case Keycode.KeyW:
        sphere.position = sphere.position.add(new BABYLON.Vector3(cameraForwardRayPosition.x * speed, 0, cameraForwardRayPosition.z * speed));
        break;

      case Keycode.KeyS:
        sphere.position = sphere.position.add(new BABYLON.Vector3(-cameraForwardRayPosition.x * speed, 0, -cameraForwardRayPosition.z * speed));
        break;

      case Keycode.KeyA:
        sphere.locallyTranslate(new BABYLON.Vector3(-speed, 0, 0));
        break;

      case Keycode.KeyD:
        sphere.locallyTranslate(new BABYLON.Vector3(speed, 0, 0));
        break;
    }

  }

});

// Create TPV System:END

// Resize the engine on window resize
window.addEventListener('resize', function () {
  engine.resize();
});

//Mouse
//We start without being locked.
var isLocked = false;

// On click event, request pointer lock
scene.onPointerDown = function () {

    //true/false check if we're locked, faster than checking pointerlock on each single click.
    if (!isLocked) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
    }

    //continue with shooting requests or whatever :P
    //evt === 1 (mouse wheel click (not scrolling))
    //evt === 2 (right mouse click)
};


// Event listener when the pointerlock is updated (or removed by pressing ESC for example).
const pointerlockchange = function () {
    var controlEnabled = document.pointerLockElement || null;

    // If the user is already locked
    if (!controlEnabled) {
        //camera.detachControl(canvas);
        isLocked = false;
    } else {
        //camera.attachControl(canvas);
        isLocked = true;
    }
};

// Attach events to the document
document.addEventListener("pointerlockchange", pointerlockchange, false);
document.addEventListener("mspointerlockchange", pointerlockchange, false);
document.addEventListener("mozpointerlockchange", pointerlockchange, false);
document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
// Mouse: END

// Scene render loop
engine.runRenderLoop(function () {
  scene.render();
});