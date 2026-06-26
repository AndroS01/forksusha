// ==========================================
// ГЛОБАЛЬНІ ЗМІННІ ТА НАЛАШТУВАННЯ
// ==========================================
let score = 0;
const targetScore = 10; // Скільки сердечок треба впіймати для перемоги
let gameInterval;
const gameZone = document.getElementById('game-zone');

// ВПИШИ СВІЙ КОД ТУТ (маленькими літерами, без пробілів):
// 2 літери твої + 2 літери її + 2 літери гри + 2 літери фільму + дата (ДД.ММ.РРРР)
const CORRECT_CODE = "окбунеандоре01.06.2025"; 

// Текст твого листа, який буде друкуватися в реальному часі
const finalLetterText = "Я хочу щоб в нас все відновилось і між нами знову загорілась ця іскра, буду робити все що в моїх силах.Я люблю тебе і хочу бачити нас як найкращу пару. А тепер розгадай мій останній, найголовніший секрет... ❤️";


// ==========================================
// 1. ЕФЕКТ ПОЯВИ СЕРДЕЧКА ПРИ КЛІКУ НА ЕКРАН
// ==========================================
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.classList.contains('game-heart')) return;

    const heart = document.createElement('div');
    heart.classList.add('click-heart');
    
    const clickHearts = ['❤️', '💖', '💗', '💕'];
    heart.innerText = clickHearts[Math.floor(Math.random() * clickHearts.length)];
    
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    
    const xMove = (Math.random() * 100 - 50) + 'px';
    heart.style.setProperty('--x-move', xMove);
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
});


// ==========================================
// 2. КЕРУВАННЯ ЕКРАНАМИ ТА МІНІ-ГРА
// ==========================================
function changeScreen(currentId, nextId) {
    document.getElementById(`sec-${currentId}`).classList.remove('active');
    document.getElementById(`sec-${nextId}`).classList.add('active');
}

function startGame() {
    changeScreen('start', 'game');
    gameZone.classList.add('active');
    score = 0;
    document.getElementById('score').innerText = score;
    gameInterval = setInterval(spawnGameHeart, 800);
}

function spawnGameHeart() {
    if (!gameZone.classList.contains('active')) return;

    const heart = document.createElement('div');
    heart.classList.add('game-heart');
    
    const gameHearts = ['❤️', '💖', '💝', '💗', '💓'];
    heart.innerText = gameHearts[Math.floor(Math.random() * gameHearts.length)];
    
    const randomX = Math.random() * (window.innerWidth - 50);
    heart.style.left = randomX + 'px';
    
    const duration = Math.random() * 2 + 2;
    heart.style.animationDuration = duration + 's';
    
    heart.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        score++;
        document.getElementById('score').innerText = score;
        
        heart.style.transform = 'scale(1.5)';
        heart.style.opacity = '0';
        setTimeout(() => heart.remove(), 150);
        
        if (score >= targetScore) {
            endGame();
        }
    });

    gameZone.appendChild(heart);

    setTimeout(() => {
        if (heart.parentNode) heart.remove();
    }, duration * 1000);
}

function endGame() {
    clearInterval(gameInterval);
    gameZone.classList.remove('active');
    gameZone.innerHTML = ''; 
    changeScreen('game', 'final');
    setTimeout(openLetter, 800);
}


// ==========================================
// 3. РОБОТА З ЛИСТОМ ТА ДРУКОМ TEXTWRITER
// ==========================================
function openLetter() {
    const letterBox = document.getElementById('letter-box');
    letterBox.classList.add('open');
    
    let i = 0;
    letterBox.innerHTML = '';
    
    function typeWriter() {
        if (i < finalLetterText.length) {
            letterBox.innerHTML += finalLetterText.charAt(i);
            i++;
            setTimeout(typeWriter, 40);
        } else {
            const codeContainer = document.getElementById('code-container');
            codeContainer.classList.add('show');
        }
    }
    setTimeout(typeWriter, 600);
}


// ==========================================
// 4. ПЕРЕВІРКА КОДУ, ЗАТЕМНЕННЯ ТА МЕГА-САЛЮТИ
// ==========================================
function checkCode() {
    const inputField = document.getElementById('secret-code-input');
    const userCode = inputField.value.trim().toLowerCase();

    if (userCode === CORRECT_CODE) {
        document.body.classList.add('glitch-fade');
        inputField.blur(); 
        
        setTimeout(() => {
            document.body.classList.remove('glitch-fade');
            document.getElementById('sec-final').style.display = 'none';
            
            const superFinal = document.getElementById('super-final');
            superFinal.classList.add('show');
            
            // 1. Запускаємо головні великі вибухи
            triggerMegaBurst();

            // 2. Включаємо нескінченний дощ із сердечок на фоні
            setInterval(spawnEndlessFinalHearts, 150);
        }, 2500); 
    } else {
        if (userCode.length >= CORRECT_CODE.length) {
            inputField.style.borderColor = '#ff4d4d';
            inputField.style.boxShadow = '0 0 15px rgba(255, 77, 77, 0.6)';
            setTimeout(() => {
                inputField.style.borderColor = 'var(--primary-pink)';
                inputField.style.boxShadow = 'none';
            }, 1000);
        }
    }
}

// Потужний каскадний вибух (8 точок по черзі)
function triggerMegaBurst() {
    const iterations = [
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
        { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 }, 
        { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 }, 
        { x: window.innerWidth * 0.3, y: window.innerHeight * 0.7 },
        { x: window.innerWidth * 0.7, y: window.innerHeight * 0.7 },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2 }, 
        { x: window.innerWidth * 0.1, y: window.innerHeight * 0.5 }, 
        { x: window.innerWidth * 0.9, y: window.innerHeight * 0.5 }
    ];

    iterations.forEach((pos, index) => {
        setTimeout(() => {
            explodeHeartsAtPos(pos.x, pos.y);
        }, index * 250); 
    });
}

// Один конкретний вибух (80 елементів розлітаються колом)
function explodeHeartsAtPos(x, y) {
    const burstCount = 70; 
    const hearts = ['❤️', '💖', '💝', '💕', '💗', '🥰', '💜', '🔮', '✨'];
    
    for (let i = 0; i < burstCount; i++) {
        const p = document.createElement('div');
        p.classList.add('burst-heart');
        p.innerText = hearts[Math.floor(Math.random() * hearts.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 250 + 100; 
        const tx = Math.cos(angle) * velocity + 'px';
        const ty = Math.sin(angle) * velocity + 'px';
        const scale = Math.random() * 1.5 + 0.6;

        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.setProperty('--tw-x', tx);
        p.style.setProperty('--tw-y', ty);
        p.style.setProperty('--tw-s', scale);

        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1200);
    }
}

// Нескінченні випадкові спалахи у супер-фіналі
function spawnEndlessFinalHearts() {
    const superFinal = document.getElementById('super-final');
    // Перевірка: якщо супер-фінал ще не активний, нічого не робимо
    if (!superFinal.classList.contains('show')) return;

    const hearts = ['❤️', '💖', '💝', '💕', '💗', '💜', '✨'];
    const p = document.createElement('div');
    p.classList.add('burst-heart');
    p.innerText = hearts[Math.floor(Math.random() * hearts.length)];

    // Сердечка з'являються у випадковому місці екрана
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 150 + 50; 
    const tx = Math.cos(angle) * velocity + 'px';
    const ty = Math.sin(angle) * velocity + 'px';
    const scale = Math.random() * 1.2 + 0.5;

    p.style.left = startX + 'px';
    p.style.top = startY + 'px';
    p.style.setProperty('--tw-x', tx);
    p.style.setProperty('--tw-y', ty);
    p.style.setProperty('--tw-s', scale);

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
}