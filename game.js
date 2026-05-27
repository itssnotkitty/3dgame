// ... (A kód többi része marad, ezt cseréld ki alul)

// 3. Vezérlés - EGYSZERŰSÍTVE
const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => controls.lock());
camera.position.set(4, 1.6, 4);

// 5. Animáció és Mozgás (Szigorú ütközéssel + manuális mozgatás)
function animate() {
    requestAnimationFrame(animate);
    
    // Csak akkor mozgatunk, ha az egér le van zárva (vagy ha tesztelni akarod, vedd ki az 'if'-et)
    if (controls.isLocked) {
        let oldPos = camera.position.clone();
        
        // Mozgás manuálisan, függetlenül a PointerLock-tól
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
    }
    renderer.render(scene, camera);
}
animate();
