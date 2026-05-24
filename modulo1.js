// Estado del juego
let currentSelectedSlot = null;
let coins = 1500;

// Referencias DOM
const blackboardBody = document.getElementById('blackboardBody');
const slotVar = document.getElementById('slot-var');
const slotVal = document.getElementById('slot-val');
const checkBtn = document.getElementById('checkBtn');
const feedbackMsg = document.getElementById('feedbackMsg');
const victoryScreen = document.getElementById('victoryScreen');
const currentCoinsDisplay = document.getElementById('current-coins');

// Cargar monedas locales si existen (opcional)
document.addEventListener('DOMContentLoaded', () => {
    const savedCoins = localStorage.getItem('coins_ecuaciones');
    if (savedCoins) {
        coins = parseInt(savedCoins);
        currentCoinsDisplay.textContent = coins.toLocaleString();
    }
});

// Función para interactividad del pizarrón de frutas
function selectFruit(id, variable, price, emoji) {
    // Quitar selección previa de las tarjetas
    document.querySelectorAll('.fruit-card').forEach(card => card.classList.remove('selected'));
    
    // Encontrar y destacar la tarjeta seleccionada
    const selectedCard = event.currentTarget;
    selectedCard.classList.add('selected');
    
    // Actualizar pizarrón con código secreto
    blackboardBody.innerHTML = `
        <div class="code-line"><span class="label">Producto:</span> ${emoji} ${id.toUpperCase()}</div>
        <div class="code-line"><span class="label">Precio:</span> $${price.toLocaleString()} pesos</div>
        <div class="code-line highlight"><span class="label">Código Algebraico:</span> <span class="math">${variable} = ${price}</span></div>
    `;
    
    // Efecto de audio simple (si estuviera disponible)
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(`El código para ${id} es ${variable} igual a ${price}`));
    }
}

// Lógica de construcción del código (Slots)
function focusSlot(slotId) {
    // Quitar selección previa
    document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
    
    const slot = document.getElementById(slotId);
    slot.classList.add('selected');
    currentSelectedSlot = slot;
    hideFeedback();
}

function placeValue(val) {
    if (!currentSelectedSlot) {
        showFeedback("¡Toca primero una de las casillas vacías (?) arriba!", "error");
        return;
    }
    
    currentSelectedSlot.textContent = val;
    currentSelectedSlot.classList.remove('selected');
    currentSelectedSlot.classList.add('filled');
    currentSelectedSlot = null;
    
    checkAllFilled();
}

function checkAllFilled() {
    const isVarFilled = slotVar.textContent !== '?';
    const isValFilled = slotVal.textContent !== '?';
    checkBtn.disabled = !(isVarFilled && isValFilled);
}

function verifyChallenge() {
    const varAnswer = slotVar.textContent;
    const valAnswer = slotVal.textContent;
    
    let isVarCorrect = varAnswer === 'A';
    let isValCorrect = valAnswer === '1500';
    
    // Dar retroalimentación visual sobre las casillas
    if (isVarCorrect) {
        slotVar.style.borderColor = "#2ECC71";
        slotVar.style.color = "#2ECC71";
    } else {
        slotVar.style.borderColor = "#E74C3C";
        slotVar.style.color = "#E74C3C";
    }
    
    if (isValCorrect) {
        slotVal.style.borderColor = "#2ECC71";
        slotVal.style.color = "#2ECC71";
    } else {
        slotVal.style.borderColor = "#E74C3C";
        slotVal.style.color = "#E74C3C";
    }
    
    if (isVarCorrect && isValCorrect) {
        showFeedback("¡Excelente! Has codificado el Aguacate correctamente. ¡Código: A = 1500!", "success");
        setTimeout(() => {
            showVictory();
        }, 1200);
    } else {
        showFeedback("Mmm, revisa las opciones. Recuerda que la letra representa la inicial y el número el precio.", "error");
        setTimeout(() => {
            if (slotVar.textContent !== 'A') {
                slotVar.textContent = '?';
                slotVar.classList.remove('filled');
                slotVar.style.borderColor = "";
                slotVar.style.color = "";
            }
            if (slotVal.textContent !== '1500') {
                slotVal.textContent = '?';
                slotVal.classList.remove('filled');
                slotVal.style.borderColor = "";
                slotVal.style.color = "";
            }
            checkBtn.disabled = true;
        }, 2500);
    }
}

function showVictory() {
    // Reproducir confeti si existe la librería
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
    }
    
    // Sumar recompensa
    coins += 1000;
    localStorage.setItem('coins_ecuaciones', coins);
    
    victoryScreen.style.display = 'flex';
}

function finishModule() {
    // Redireccionar al mapa principal
    window.location.href = 'index.html';
}

function showFeedback(msg, type) {
    feedbackMsg.textContent = msg;
    feedbackMsg.className = `feedback-msg ${type}`;
    feedbackMsg.classList.remove('hidden');
}

function hideFeedback() {
    feedbackMsg.classList.add('hidden');
}
