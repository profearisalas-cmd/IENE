document.addEventListener('DOMContentLoaded', () => {
    console.log("AVA Ecuaciones en mi Barrio - Dashboard Cargado");

    // Microinteracción: Sonido al hacer hover en módulos interactivos
    const activeCards = document.querySelectorAll('.module-card.active');
    activeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Aquí se podría reproducir un sonido sutil
            // const hoverSound = new Audio('assets/hover.mp3');
            // hoverSound.play();
        });
    });
});

function iniciarModulo2() {
    const overlay = document.getElementById('simulatorOverlay');
    overlay.classList.add('active');
    
    // Simulación de carga del módulo de la balanza
    setTimeout(() => {
        window.location.href = "simulador.html";
    }, 1500);
}

function cerrarSimulador() {
    const overlay = document.getElementById('simulatorOverlay');
    overlay.classList.remove('active');
}
