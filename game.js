import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(10, 20, 10);
scene.add(light);

// Falak és pálya
const walls = [];
const levelMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function buildMap() {
    for (let i = 0; i < levelMap.length; i++) {
        for (let j = 0; j < levelMap[i].length; j++) {
            if (levelMap[i][j] === 1) {
                const wall = new THREE.Mesh(
                    new THREE.BoxGeometry(2, 2, 2), 
                    new THREE.MeshPhongMaterial({ color: 0x4a4a4a })
                );
                wall.position.set(j * 2, 1, i * 2);
                scene.add(wall);
                walls.push(wall);
            }
        }
    }
}
buildMap();

// Fegyver létrehozása
const weapon = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.5), 
    new THREE.MeshBasicMaterial({ color: 0x333333 })
);
weapon.position.set(0.3, -0.3, -0.5);
camera.add(weapon); // Fegyver rögzítése a kamerához
scene.add(camera);

// Kontroller és kamera
const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => controls.lock());
camera.position.set(4, 1.6, 4);

// Mozgás kezelés
let move = { f: false, b: false, l: false, r: false };
document.addEventListener('keydown', (e) => {
    if(e.code === 'KeyW') move.f = true; if(e.code === 'KeyS') move.b = true;
    if(e.code === 'KeyA') move.l = true; if(e.code === 'KeyD') move.r = true;
});
document.addEventListener('keyup', (e) => {
    if(e.code === 'KeyW') move.f = false; if(e.code === 'KeyS') move.b = false;
    if(e.code === 'KeyA') move.l = false; if(e.code === 'KeyD') move.r = false;
});

// Lövés funkció
function shoot() {
    if (!controls.isLocked) return;
    
    // Visszarúgás
    weapon.position.z += 0.1;
    setTimeout(() => weapon.position.z -= 0.1, 100);

    const bullet = new THREE.Mesh(
        new THREE.SphereGeometry(0.1), 
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    bullet.position.copy(camera.position);
    bullet.quaternion.copy(camera.quaternion);
    scene.add(bullet);
    
    const animateBullet = () => {
        bullet.translateZ(-0.5);
        if (bullet.position.distanceTo(camera.position) > 20) {
            scene.remove(bullet);
        } else {
            requestAnimationFrame(animateBullet);
        }
    };
    animateBullet();
}
document.addEventListener('mousedown', shoot);

// Ütközésvizsgálat
function canMoveTo(position) {
    for (let wall of walls) {
        if (position.distanceTo(wall.position) < 1.4) return false;
    }
    return true;
}

function animate() {
    requestAnimationFrame(animate);
    if (controls.isLocked) {
        let oldPos = camera.position.clone();
        if(move.f) controls.moveForward(0.1);
        if(move.b) controls.moveForward(-0.1);
        if(move.l) controls.moveRight(-0.1);
        if(move.r) controls.moveRight(0.1);
        
        if (!canMoveTo(camera.position)) camera.position.copy(oldPos);
    }
    renderer.render(scene, camera);
}
animate();
