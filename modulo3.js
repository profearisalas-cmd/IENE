// Datos de las misiones (Múltiples ecuaciones y contextos)
const missions = [
    {
        title: "El Mototaxi",
        npcName: "El Vale (Mototaxi)",
        npcImg: "Vale",
        npcMsg: "¡Epa Lucho! La arrancada cuesta <strong>$2000</strong>. Y por cada cuadra extra te cobro <strong>$500</strong> pesitos.",
        luchoMsg: "Vale, tengo exactamente <strong>$4500</strong> en el bolsillo. ¿Para cuántas cuadras extras me alcanza la plata?",
        // La ecuación es: Fijo + Variable*X = Total  =>  2000 + 500x = 4500
        equationFormat: ['Fijo', '+', 'Variable', 'X', '=', 'Total'],
        correctValues: { Fijo: 2000, Variable: 500, Total: 4500 },
        options: [500, 4500, 2000],
        successText: "Excelente. La ecuación es <strong>2000 + 500x = 4500</strong>. Alcanza para 5 cuadras."
    },
    {
        title: "Puesto de Empanadas",
        npcName: "Doña Carmen",
        npcImg: "Carmen",
        npcMsg: "Mijo, el vaso de jugo de corozo vale <strong>$1500</strong> fijos, y cada empanada cuesta <strong>$1000</strong>.",
        luchoMsg: "Seño, le paso este billete de <strong>$5500</strong>. Deme un solo jugo y el resto de la plata en empanadas.",
        // Ecuación: 1500 + 1000x = 5500
        equationFormat: ['Fijo', '+', 'Variable', 'X', '=', 'Total'],
        correctValues: { Fijo: 1500, Variable: 1000, Total: 5500 },
        options: [5500, 1000, 1500],
        successText: "¡Bien hecho! La ecuación es <strong>1500 + 1000x = 5500</strong>. Lucho comprará 4 empanadas."
    },
    {
        title: "Recargas del Tío",
        npcName: "El Tío de Lucho",
        npcImg: "Felix",
        npcMsg: "Lucho, el saldo base de esta SIM es de <strong>$3000</strong>. Por cada día que pasa, me descuentan <strong>$200</strong> del plan.",
        luchoMsg: "Tío, si hoy revisé el saldo y me quedan <strong>$1600</strong>, ¿Cuántos días han pasado?",
        // Ecuación: 3000 - 200x = 1600
        equationFormat: ['Fijo', '-', 'Variable', 'X', '=', 'Total'],
        correctValues: { Fijo: 3000, Variable: 200, Total: 1600 },
        options: [200, 1600, 3000],
        successText: "¡Exacto! La ecuación es <strong>3000 - 200x = 1600</strong>. Han pasado 7 días."
    }
];

let currentMissionIndex = 0;
let currentSelectedSlot = null;

// Referencias DOM
const dialogueScene = document.getElementById('dialogueScene');
const equationSlots = document.getElementById('equationSlots');
const optionsPanel = document.getElementById('optionsPanel');
const checkBtn = document.getElementById('checkBtn');
const missionIndicator = document.getElementById('missionIndicator');
const victoryScreen = document.getElementById('victoryScreen');
const victoryCard = document.getElementById('victoryCard');

function initMission(index) {
    const mission = missions[index];
    missionIndicator.textContent = `Misión ${index + 1} de ${missions.length}: ${mission.title}`;
    
    // Renderizar Diálogo
    dialogueScene.innerHTML = `
        <div class="message received">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${mission.npcImg}&backgroundColor=b6e3f4" alt="${mission.npcName}" class="avatar">
            <div class="bubble">
                <strong>${mission.npcName}:</strong><br>
                ${mission.npcMsg}
            </div>
        </div>
        <div class="message sent">
            <div class="bubble">
                <strong>Lucho:</strong><br>
                ${mission.luchoMsg}
            </div>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucho&backgroundColor=ffd5dc" alt="Lucho" class="avatar">
        </div>
    `;

    // Renderizar Slots
    equationSlots.innerHTML = '';
    mission.equationFormat.forEach(item => {
        if (mission.correctValues[item]) {
            // Es un hueco para rellenar
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.textContent = '?';
            slot.id = `slot_${item}`;
            slot.setAttribute('data-correct', mission.correctValues[item]);
            slot.onclick = () => selectSlot(slot.id);
            equationSlots.appendChild(slot);
        } else {
            // Es un operador o la X
            const op = document.createElement('div');
            op.className = 'math-op';
            op.textContent = item;
            equationSlots.appendChild(op);
        }
    });

    // Renderizar Opciones (barajar opcionalmente)
    optionsPanel.innerHTML = '';
    const shuffledOptions = [...mission.options].sort(() => Math.random() - 0.5);
    shuffledOptions.forEach(val => {
        const btn = document.createElement('button');
        btn.className = 'number-block';
        btn.textContent = val;
        btn.onclick = () => placeNumber(val);
        optionsPanel.appendChild(btn);
    });

    // Resetear botón y feedback
    checkBtn.disabled = true;
    hideFeedback();
}

function selectSlot(slotId) {
    document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
    const slot = document.getElementById(slotId);
    slot.classList.add('selected');
    currentSelectedSlot = slot;
}

function placeNumber(value) {
    if (!currentSelectedSlot) {
        showFeedback("Primero toca una casilla vacía (los cuadros con '?').", "error");
        return;
    }
    currentSelectedSlot.textContent = value;
    currentSelectedSlot.classList.remove('selected');
    currentSelectedSlot.classList.add('filled');
    currentSelectedSlot = null;
    hideFeedback();
    checkAllFilled();
}

function checkAllFilled() {
    const slots = document.querySelectorAll('.slot');
    let allFilled = Array.from(slots).every(s => s.textContent !== '?');
    checkBtn.disabled = !allFilled;
}

function verifyEquation() {
    const slots = document.querySelectorAll('.slot');
    let isCorrect = true;

    slots.forEach(slot => {
        if (slot.textContent !== slot.getAttribute('data-correct')) {
            isCorrect = false;
            slot.style.borderColor = "#E74C3C";
            slot.style.color = "#E74C3C";
        } else {
            slot.style.borderColor = "#2ECC71";
            slot.style.color = "#2ECC71";
        }
    });

    if (isCorrect) {
        showVictory();
    } else {
        showFeedback("Mmm, algo no cuadra. Intenta intercambiar los números.", "error");
        setTimeout(() => {
            slots.forEach(slot => { slot.style.borderColor = ""; slot.style.color = ""; });
        }, 3000);
    }
}

function showVictory() {
    const mission = missions[currentMissionIndex];
    let nextActionHTML = "";
    
    if (currentMissionIndex < missions.length - 1) {
        nextActionHTML = `<button class="btn-primary" onclick="nextMission()">Siguiente Misión ➡</button>`;
    } else {
        nextActionHTML = `<button class="btn-primary" onclick="window.location.href='index.html'">Volver al Mapa</button>`;
    }

    victoryCard.innerHTML = `
        <h2>¡Ecuación Armada! 🧩</h2>
        <p>${mission.successText}</p>
        <div class="reward">🪙 + 1500 Pesos</div>
        ${nextActionHTML}
    `;
    
    setTimeout(() => {
        victoryScreen.style.display = 'flex';
    }, 500);
}

function nextMission() {
    victoryScreen.style.display = 'none';
    currentMissionIndex++;
    initMission(currentMissionIndex);
}

function showFeedback(msg, type) {
    const fb = document.getElementById('feedbackMsg');
    fb.textContent = msg;
    fb.className = `feedback-msg ${type}`;
    fb.classList.remove('hidden');
}

function hideFeedback() {
    document.getElementById('feedbackMsg').classList.add('hidden');
}

// Iniciar
document.addEventListener('DOMContentLoaded', () => initMission(0));
