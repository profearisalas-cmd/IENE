// Base de datos simulada de posts (Retos de otros estudiantes)
let posts = [
    {
        id: 1,
        author: "María S.",
        avatar: "Maria",
        color: "ffdfbf",
        time: "Hace 2 horas",
        content: "Mi mamá hace fritos. Hoy vendió 3 empanadas y además alguien le pagó $5000 que le debían. En total llegó a la casa con $11000. ¿A cómo da cada empanada?",
        secretEq: "3x + 5000 = 11000",
        solved: false
    },
    {
        id: 2,
        author: "Carlos",
        avatar: "Carlos",
        color: "c0aede",
        time: "Hace 5 horas",
        content: "En la tienda fié 2 libras de queso. Aparte compré un pan de $2000 en efectivo. Si la cuenta total fue de $14000, ¿cuánto cuesta la libra de queso?",
        secretEq: "2x + 2000 = 14000",
        solved: false
    },
    {
        id: 3,
        author: "Profe Jairo",
        avatar: "Jairo",
        color: "b6e3f4",
        time: "Ayer",
        content: "Reto Especial: El pasaje en buseta está caro. Si pagué 4 pasajes y me cobraron 200 por una bolsa de agua, pagando $11400 en total... armen esa ecuación.",
        secretEq: "4x + 200 = 11400",
        solved: false
    }
];

const wallGrid = document.getElementById('wallGrid');

function renderPosts() {
    wallGrid.innerHTML = '';
    
    posts.forEach(post => {
        const card = document.createElement('article');
        card.className = 'post-card';
        
        // Formatear la ecuación para que la validación sea laxa (quitando espacios y pasando a minúscula)
        const checkFunction = `checkAnswer(${post.id}, '${post.secretEq}')`;
        
        card.innerHTML = `
            <div class="post-header">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${post.avatar}&backgroundColor=${post.color}" alt="${post.author}" class="post-avatar">
                <div>
                    <div class="post-author">${post.author}</div>
                    <div class="post-date">${post.time}</div>
                </div>
            </div>
            <div class="post-content">
                "${post.content}"
            </div>
            <div class="post-interaction">
                <label>Escribe la ecuación:</label>
                <div class="input-row">
                    <input type="text" id="input_${post.id}" placeholder="Ej: 2x + 1 = 5" ${post.solved ? 'disabled' : ''} value="${post.solved ? post.secretEq : ''}">
                    <button onclick="${checkFunction}" ${post.solved ? 'disabled' : ''}>Enviar</button>
                </div>
                <div class="feedback" id="feedback_${post.id}">
                    ${post.solved ? '✅ ¡Correcto! Eres un Jaguar.' : ''}
                </div>
            </div>
        `;
        wallGrid.appendChild(card);
    });
}

function checkAnswer(id, correctEq) {
    const inputEl = document.getElementById(`input_${id}`);
    const feedbackEl = document.getElementById(`feedback_${id}`);
    
    // Normalizar strings para comparar: quitar todos los espacios y minúsculas
    const normalize = (str) => str.replace(/\s+/g, '').toLowerCase();
    
    const userVal = normalize(inputEl.value);
    const correctVal = normalize(correctEq);
    
    // Validar también si el usuario la escribe al revés, ej: 5000+3x=11000
    // (Para simplificar el prototipo, comparamos la cadena exacta y una versión sencilla invertida en suma)
    
    if (userVal === correctVal) {
        feedbackEl.textContent = "✅ ¡Correcto! Has resuelto este reto.";
        feedbackEl.className = "feedback success";
        inputEl.disabled = true;
        
        // Actualizar estado
        const post = posts.find(p => p.id === id);
        if(post) post.solved = true;
        
        checkFinalVictory();
    } else {
        feedbackEl.textContent = "❌ Mmm no. Revisa bien qué valor es fijo y cuál va con la X.";
        feedbackEl.className = "feedback error";
    }
}

// Lógica de publicación de nuevo reto
const createModal = document.getElementById('createModal');

function openModal() {
    createModal.classList.add('active');
}

function closeModal() {
    createModal.classList.remove('active');
}

function submitChallenge(e) {
    e.preventDefault();
    
    const text = document.getElementById('challengeText').value;
    const eq = document.getElementById('challengeEq').value;
    
    const newPost = {
        id: Date.now(),
        author: "Lucho (Tú)",
        avatar: "Lucho",
        color: "ffd5dc",
        time: "Hace un momento",
        content: text,
        secretEq: eq,
        solved: true // El tuyo ya está resuelto por ti
    };
    
    // Añadir al principio
    posts.unshift(newPost);
    renderPosts();
    closeModal();
    
    // Limpiar form
    document.getElementById('challengeText').value = '';
    document.getElementById('challengeEq').value = '';
}

function checkFinalVictory() {
    // Si todos los posts iniciales están resueltos
    const allSolved = posts.every(p => p.solved);
    if(allSolved) {
        setTimeout(() => {
            document.getElementById('finalVictory').classList.add('active');
        }, 1000);
    }
}

// Iniciar
document.addEventListener('DOMContentLoaded', renderPosts);
