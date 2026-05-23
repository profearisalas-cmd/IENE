// Niveles del Simulador de Balanza
const levels = [
    { leftBoxes: 2, leftCoins: 2, rightBoxes: 0, rightCoins: 8, boxWeight: 3 },  // 2X + 2 = 8 -> X=3
    { leftBoxes: 3, leftCoins: 1, rightBoxes: 0, rightCoins: 10, boxWeight: 3 }, // 3X + 1 = 10 -> X=3
    { leftBoxes: 2, leftCoins: 6, rightBoxes: 0, rightCoins: 14, boxWeight: 4 }  // 2X + 6 = 14 -> X=4
];

let currentLevelIndex = 0;
let gameState = {};

// Referencias al DOM
const leftPan = document.getElementById('leftPan');
const rightPan = document.getElementById('rightPan');
const scaleBeam = document.getElementById('scaleBeam');
const leftExpr = document.getElementById('leftExpression');
const rightExpr = document.getElementById('rightExpression');
const equalSign = document.getElementById('equalSign');
const speechBubble = document.getElementById('speechBubble');
const victoryScreen = document.getElementById('victoryScreen');
const levelIndicator = document.getElementById('levelIndicator');

// Inicializar simulador
function initLevel(index) {
    // Clonar el estado del nivel para no modificar el original
    gameState = { ...levels[index] };
    levelIndicator.textContent = `Nivel ${index + 1} de ${levels.length}: Descubre el valor de la caja (X)`;
    speechBubble.textContent = "¡Hey! Vamos a dejar una sola caja solita a la izquierda. ¡Mantén el equilibrio!";
    
    renderPan(leftPan, gameState.leftBoxes, gameState.leftCoins, 'left');
    renderPan(rightPan, gameState.rightBoxes, gameState.rightCoins, 'right');
    updatePhysicsAndMath();
}

// Renderizar elementos en platillos
function renderPan(panElement, boxes, coins, side) {
    panElement.innerHTML = ''; 
    for (let i = 0; i < boxes; i++) {
        const box = document.createElement('div');
        box.className = 'item-box';
        box.textContent = 'X';
        box.onclick = () => alert("¡Concéntrate en quitar las monedas primero o dividir a ambos lados!");
        panElement.appendChild(box);
    }
    for (let i = 0; i < coins; i++) {
        const coin = document.createElement('div');
        coin.className = 'item-coin';
        coin.textContent = '1';
        coin.onclick = () => removeSingleItem(side, 'coin');
        panElement.appendChild(coin);
    }
}

function removeSingleItem(side, type) {
    if (side === 'left' && gameState.leftCoins > 0) gameState.leftCoins--;
    if (side === 'right' && gameState.rightCoins > 0) gameState.rightCoins--;
    
    renderPan(leftPan, gameState.leftBoxes, gameState.leftCoins, 'left');
    renderPan(rightPan, gameState.rightBoxes, gameState.rightCoins, 'right');
    updatePhysicsAndMath();
}

function operateBothSides(operation, type) {
    if (operation === 'subtract' && type === 'coin') {
        if (gameState.leftCoins > 0 && gameState.rightCoins > 0) {
            gameState.leftCoins--;
            gameState.rightCoins--;
            speechBubble.textContent = "¡Bien! Si quitas lo mismo a ambos lados, se mantiene el equilibrio.";
        } else {
            speechBubble.textContent = "Ups... No hay suficientes monedas en ambos lados para quitar.";
        }
    }
    
    if (operation === 'add' && type === 'coin') {
        gameState.leftCoins++;
        gameState.rightCoins++;
        speechBubble.textContent = "Añadir lo mismo a ambos lados también mantiene el equilibrio.";
    }

    if (operation === 'divide' && type === 'boxes') {
        const divisor = gameState.leftBoxes;
        if (divisor > 1) {
            if (gameState.leftCoins % divisor === 0 && gameState.rightCoins % divisor === 0) {
                gameState.leftBoxes /= divisor;
                gameState.leftCoins /= divisor;
                gameState.rightCoins /= divisor;
                speechBubble.textContent = `¡Excelente! Dividir todo entre ${divisor} mantiene la igualdad perfecta.`;
            } else {
                speechBubble.textContent = "Mmm... las monedas no se pueden dividir exactamente ahora. ¡Quita monedas iguales a ambos lados primero!";
            }
        } else {
            speechBubble.textContent = "¡Ya tienes una sola caja! No es necesario seguir dividiendo.";
        }
    }

    renderPan(leftPan, gameState.leftBoxes, gameState.leftCoins, 'left');
    renderPan(rightPan, gameState.rightBoxes, gameState.rightCoins, 'right');
    updatePhysicsAndMath();
}

function updatePhysicsAndMath() {
    const leftWeight = (gameState.leftBoxes * gameState.boxWeight) + gameState.leftCoins;
    const rightWeight = (gameState.rightBoxes * gameState.boxWeight) + gameState.rightCoins;
    
    const difference = Math.max(Math.min(rightWeight - leftWeight, 10), -10); 
    const rotation = difference * 2; 
    
    scaleBeam.style.transform = `rotate(${rotation}deg)`;
    leftPan.style.transform = `rotate(${-rotation}deg)`;
    rightPan.style.transform = `rotate(${-rotation}deg)`;

    const leftText = `${gameState.leftBoxes > 0 ? gameState.leftBoxes + 'X' : ''} ${gameState.leftBoxes > 0 && gameState.leftCoins > 0 ? '+' : ''} ${gameState.leftCoins > 0 ? gameState.leftCoins : ''}`;
    const rightText = `${gameState.rightBoxes > 0 ? gameState.rightBoxes + 'X' : ''} ${gameState.rightBoxes > 0 && gameState.rightCoins > 0 ? '+' : ''} ${gameState.rightCoins > 0 ? gameState.rightCoins : ''}`;
    
    leftExpr.textContent = leftText || "0";
    rightExpr.textContent = rightText || "0";

    if (leftWeight === rightWeight) {
        equalSign.textContent = "=";
        equalSign.style.color = "var(--primary)";
        if (gameState.leftBoxes === 1 && gameState.leftCoins === 0 && leftWeight === rightWeight) {
            checkWin();
        } else if (leftWeight !== rightWeight) { 
            equalSign.textContent = "≠";
        }
    } else if (leftWeight > rightWeight) {
        equalSign.textContent = ">";
        equalSign.style.color = "var(--accent)";
        speechBubble.textContent = "¡Cuidado! Pesa más a la izquierda.";
    } else {
        equalSign.textContent = "<";
        equalSign.style.color = "var(--accent)";
        speechBubble.textContent = "¡Ey! Pesa más a la derecha.";
    }
}

function checkWin() {
    speechBubble.textContent = `¡Lo lograste! X vale ${gameState.rightCoins}.`;
    setTimeout(() => {
        document.getElementById('xValueResult').textContent = gameState.rightCoins;
        
        const btnNext = document.querySelector('.victory-card .btn-primary');
        if(currentLevelIndex < levels.length - 1) {
            btnNext.textContent = "Siguiente Nivel ➡";
        } else {
            btnNext.textContent = "Volver al Mapa 🗺️";
        }
        
        victoryScreen.style.display = "flex";
        fireConfetti();
    }, 1000);
}

function nextLevel() {
    victoryScreen.style.display = "none";
    currentLevelIndex++;
    if(currentLevelIndex < levels.length) {
        initLevel(currentLevelIndex);
    } else {
        alert("¡Has superado todas las balanzas! Eres un genio.");
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', () => initLevel(currentLevelIndex));

// Confeti
function fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    
    let particles = [];
    for(let i=0; i<100; i++) {
        particles.push({
            x: canvas.width/2, y: canvas.height/2,
            r: Math.random() * 6 + 2,
            dx: Math.random() * 10 - 5,
            dy: Math.random() * -10 - 5,
            color: `hsl(${Math.random()*360}, 100%, 50%)`
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p => {
            p.x += p.dx; p.y += p.dy; p.dy += 0.2;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = p.color; ctx.fill();
        });
    }
    animate();
}
