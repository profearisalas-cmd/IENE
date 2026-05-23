// Función central para navegación no lineal entre vistas
function navigateTo(viewId) {
    // Ocultar todas las vistas
    const views = document.querySelectorAll('.slide-view');
    views.forEach(view => {
        view.classList.remove('active');
    });

    // Mostrar la vista seleccionada
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        window.scrollTo(0, 0); // Regresar el scroll arriba
    }
}

// Interacción en VISTA 2: Pestañas (Tabs) de Contexto
function showTab(groupName, tabId) {
    // Desactivar todos los botones de este grupo
    const buttons = document.querySelectorAll('.interactive-panel .tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Ocultar todos los contenidos de las pestañas
    const contents = document.querySelectorAll('.content-panel .tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Activar el botón presionado
    const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(tabId));
    if (activeBtn) activeBtn.classList.add('active');

    // Mostrar el contenido correspondiente
    const targetContent = document.getElementById(tabId);
    if (targetContent) targetContent.classList.add('active');
}

// Interacción en VISTA 3: Acordeón de Diseño
function toggleAccordion(element) {
    element.classList.toggle('active');
}
