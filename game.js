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

// 1. Pálya
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
                const wall = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshPhongMaterial({ color: 0x4a4a4a }));
                wall.position.set(j * 2, 1, i * 2);
                scene.add(wall);
                walls.push(wall);
            }
        }
    }
}
buildMap();

// 2. Fegyver (kék doboz)
const weapon = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.5), new THREE.MeshPhongMaterial({ color: 0x0077ff }));
weapon.position.set(0.3, -0.3, -0.5);
camera.add(weapon);
scene.add(camera);

// 3. Vezérlés
const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => controls.lock());
camera.position.set(4, 1.6, 4);

let move = { f: false, b: false, l: false, r: false };
document.addEventListener('keydown', (e) => {
    if(e.code === 'KeyW') move.f = true; if(e.code === 'KeyS') move.b = true;
    if(e.code === 'KeyA') move.l = true; if(e.code === 'KeyD') move.r = true;
});
document.addEventListener('keyup', (e) => {
    if(e.code === 'KeyW') move.f = false; if(e.code === 'KeyS') move.b = false;
    if(e.code === 'KeyA') move.l = false; if(e.code === 'KeyD') move.r = false;
});

// 4. Lövés
function shoot() {
    weapon.position.z += 0.1;
    setTimeout(() => weapon.position.z -= 0.1, 100);
    const bullet = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    bullet.position.copy(camera.position);
    bullet.quaternion.copy(camera.quaternion);
    scene.add(bullet);
    const animateBullet = () => {
        bullet.translateZ(-0.5);
        if (bullet.position.distanceTo(camera.position) > 20) scene.remove(bullet);
        else requestAnimationFrame(animateBullet);
    };
    animateBullet();
}
document.addEventListener('mousedown', shoot);

// 5. Animáció és Mozgás (Szigorú ütközéssel)
function animate() {
    requestAnimationFrame(animate);
    let oldPos = camera.position.clone();
    
    // Mozgás a kamera nézési iránya szerint
    if(move.f) camera.translateZ(-0.1);
    if(move.b) camera.translateZ(0.1);
    if(move.l) camera.translateX(-0.1);
    if(move.r) camera.translateX(0.1);
    
    // Ütközésvizsgálat
    for (let wall of walls) {
        if (camera.position.distanceTo(wall.position) < 1.4) {
            camera.position.copy(oldPos);
            break;
        }
    }
    renderer.render(scene, camera);
}
animate();
