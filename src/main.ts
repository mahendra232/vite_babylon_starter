import './style.css'

import * as BABYLON from 'babylonjs'
// import Keycode from "keycode.js";

const canvas = document.getElementById('app') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

// This creates a basic Babylon Scene object (non-mesh)
const scene = new BABYLON.Scene(engine);

// This creates and positions a free camera (non-mesh)
const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

// This targets the camera to scene origin
camera.setTarget(BABYLON.Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

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

// Resize the engine on window resize
window.addEventListener('resize', function () {
  engine.resize();
});

// Scene render loop
engine.runRenderLoop(function () {
  scene.render();
});