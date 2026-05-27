import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Fények
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// Padló
const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.MeshPhongMaterial({ color: 0x444444 }));
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Kocka (hogy legyen mit látni)
const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshPhongMaterial({ color: 0xff0000 }));
cube.position.set(0, 1, -10);
scene.add(cube);

// Kontroller
const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => controls.lock());

camera.position.set(0, 1.6, 0);

// Mozgás
let move = { f: false, b: false, l: false, r: false };
document.addEventListener('keydown', (e) => {
    if(e.code === 'KeyW') move.f = true; if(e.code === 'KeyS') move.b = true;
    if(e.code === 'KeyA') move.l = true; if(e.code === 'KeyD') move.r = true;
});
document.addEventListener('keyup', (e) => {
    if(e.code === 'KeyW') move.f = false; if(e.code === 'KeyS') move.b = false;
    if(e.code === 'KeyA') move.l = false; if(e.code === 'KeyD') move.r = false;
});

function animate() {
    requestAnimationFrame(animate);
    if (controls.isLocked) {
        if(move.f) controls.moveForward(0.1);
        if(move.b) controls.moveForward(-0.1);
        if(move.l) controls.moveRight(-0.1);
        if(move.r) controls.moveRight(0.1);
    }
    renderer.render(scene, camera);
}
animate();