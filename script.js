/* ===================================
   STARRY NIGHT - Van Gogh Inspired
   Interactive Background & Animations
   =================================== */

// ===================================
// STARRY BACKGROUND CANVAS
// ===================================

class StarryNight {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.shootingStars = [];
        this.resize();
        this.initStars();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initStars() {
        const starCount = Math.floor((this.canvas.width * this.canvas.height) / 8000);

        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                // Van Gogh swirl motion
                swirlRadius: Math.random() * 3 + 1,
                swirlSpeed: Math.random() * 0.001 + 0.0005,
                swirlPhase: Math.random() * Math.PI * 2
            });
        }
    }

    drawStar(star, time) {
        // Calculate swirl position
        const swirlX = Math.cos(time * star.swirlSpeed + star.swirlPhase) * star.swirlRadius;
        const swirlY = Math.sin(time * star.swirlSpeed + star.swirlPhase) * star.swirlRadius;

        const x = star.x + swirlX;
        const y = star.y + swirlY;

        // Calculate twinkling
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const opacity = star.opacity + twinkle * 0.3;
        const radius = star.radius + twinkle * 0.5;

        // Draw star with glow
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
        gradient.addColorStop(0, `rgba(255, 248, 225, ${opacity})`);
        gradient.addColorStop(0.3, `rgba(255, 213, 79, ${opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Draw core
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 248, 225, ${opacity + 0.2})`;
        this.ctx.fill();
    }

    drawVanGoghSwirl(time) {
        // Draw subtle swirling patterns in the background
        const centerX = this.canvas.width * 0.7;
        const centerY = this.canvas.height * 0.3;

        for (let i = 0; i < 3; i++) {
            const angle = (time * 0.0002) + (i * Math.PI * 2 / 3);
            const radius = 100 + i * 50;

            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(26, 39, 68, ${0.3 - i * 0.08})`;
            this.ctx.lineWidth = 30 - i * 5;
            this.ctx.lineCap = 'round';

            for (let j = 0; j < 100; j++) {
                const t = j / 100;
                const spiralAngle = angle + t * Math.PI * 2;
                const spiralRadius = radius * (1 - t * 0.5);
                const x = centerX + Math.cos(spiralAngle) * spiralRadius;
                const y = centerY + Math.sin(spiralAngle) * spiralRadius;

                if (j === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }

            this.ctx.stroke();
        }
    }

    animate() {
        const time = performance.now();

        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a1628');
        gradient.addColorStop(0.5, '#1a2744');
        gradient.addColorStop(1, '#0d1e38');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Van Gogh swirls
        this.drawVanGoghSwirl(time);

        // Draw stars
        for (const star of this.stars) {
            this.drawStar(star, time);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// CLICK SPARKLES
// ===================================

const sparkleEmojis = ['✨', '💫', '⭐', '💖', '💕', '🌟', '💗'];

function createSparkle(x, y) {
    const container = document.getElementById('sparkles-container');
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];

    // Random offset from click position
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 40;

    sparkle.style.left = (x + offsetX) + 'px';
    sparkle.style.top = (y + offsetY) + 'px';
    sparkle.style.fontSize = (Math.random() * 1 + 1) + 'rem';

    container.appendChild(sparkle);

    // Remove after animation
    setTimeout(() => sparkle.remove(), 2000);
}

function handleClick(e) {
    // Create multiple sparkles on click
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createSparkle(e.clientX, e.clientY), i * 50);
    }
}

document.addEventListener('click', handleClick);

// ===================================
// PAGE NAVIGATION
// ===================================

function goToPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId);
    targetPage.classList.add('active');

    // Trigger animations based on page
    if (pageId === 'anniversary-page') {
        animateAnniversaryPage();
    } else if (pageId === 'poetry-page') {
        animatePoemLines();
    } else if (pageId === 'valentine-page') {
        resetValentinePage();
    }
}

// ===================================
// ANNIVERSARY PAGE ANIMATIONS
// ===================================

function animateAnniversaryPage() {
    const lines = document.querySelectorAll('.anniversary-message p');
    const poemTransition = document.querySelector('.poem-transition');

    // Animate each paragraph with staggered delay
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, 300 + index * 800); // Slower for longer text
    });

    // Animate poem transition after all paragraphs
    if (poemTransition) {
        const transitionDelay = 300 + lines.length * 800 + 500;
        setTimeout(() => {
            poemTransition.classList.add('visible');
        }, transitionDelay);
    }
}

// ===================================
// PHOTO LOADING
// ===================================

function loadPhoto(input, placeholder) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Remove placeholder content
            const icon = placeholder.querySelector('.photo-icon');
            const text = placeholder.querySelector('.photo-text');
            if (icon) icon.style.display = 'none';
            if (text) text.style.display = 'none';

            // Add image
            let img = placeholder.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                placeholder.appendChild(img);
            }
            img.src = e.target.result;
            placeholder.classList.add('has-photo');

            // Add sparkle effect
            const rect = placeholder.getBoundingClientRect();
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    createSparkle(
                        rect.left + Math.random() * rect.width,
                        rect.top + Math.random() * rect.height
                    );
                }, i * 50);
            }
        };
        reader.readAsDataURL(file);
    }
}

// Make loadPhoto global
window.loadPhoto = loadPhoto;

// ===================================
// POETRY PAGE ANIMATIONS
// ===================================

function animatePoemLines() {
    const lines = document.querySelectorAll('.poem-line');
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, 200 + index * 300);
    });
}

// ===================================
// VALENTINE PAGE INTERACTIONS
// ===================================

let noClickCount = 0;
const noResponses = [
    "Are you sure? 🥺",
    "Really though? 💔",
    "But I made this for you... 🌹",
    "Okay okay, let me ask again...",
    "Pretty please? 🙏✨",
    "I'll keep asking! 💕",
    "You're just being cute now 😏",
    "Hehe, you can't resist forever! 💖"
];

function resetValentinePage() {
    noClickCount = 0;
    const noBtn = document.getElementById('no-btn');
    noBtn.textContent = "Hmm, let me think...";
    noBtn.style.transform = '';
}

function setupNoButton() {
    const noBtn = document.getElementById('no-btn');

    noBtn.addEventListener('click', () => {
        noClickCount++;

        if (noClickCount >= noResponses.length) {
            noClickCount = 0;
        }

        noBtn.textContent = noResponses[noClickCount - 1] || noResponses[0];

        // Make button move/shrink playfully
        if (noClickCount > 2) {
            const randomX = (Math.random() - 0.5) * 100;
            const randomY = (Math.random() - 0.5) * 50;
            noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(${1 - noClickCount * 0.05})`;
        }

        // After many clicks, shrink it significantly
        if (noClickCount > 5) {
            noBtn.style.opacity = 0.5;
            noBtn.style.fontSize = '0.9rem';
        }
    });

    // Make it wiggle when hovering yes
    const yesBtn = document.querySelector('.yes-btn');
    yesBtn.addEventListener('mouseenter', () => {
        const noBtn = document.getElementById('no-btn');
        noBtn.style.transform = 'scale(0.95)';
    });
    yesBtn.addEventListener('mouseleave', () => {
        const noBtn = document.getElementById('no-btn');
        if (noClickCount <= 2) {
            noBtn.style.transform = '';
        }
    });
}

// ===================================
// CELEBRATION
// ===================================

function sayYes() {
    // Hide question, show celebration
    document.getElementById('valentine-question').classList.add('hidden');
    document.getElementById('celebration').classList.remove('hidden');

    // Create confetti explosion
    createConfetti();

    // Create floating hearts
    createFloatingHearts();

    // Celebration sparkles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createSparkle(x, y);
        }, i * 100);
    }
}

function createConfetti() {
    const container = document.getElementById('confetti-container');
    const confettiEmojis = ['🎉', '💖', '💕', '✨', '💗', '🌟', '💝', '🎊', '💫'];
    const colors = ['#ffd54f', '#e8a4b8', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96f2d7'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = '-' + Math.random() + 's';

            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }, i * 50);
    }
}

function createFloatingHearts() {
    const container = document.getElementById('sparkles-container');
    const hearts = ['💖', '💕', '💗', '💝', '❤️', '💓'];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'sparkle';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = (window.innerHeight + 20) + 'px';
            heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
            heart.style.animation = 'none';
            heart.style.transition = 'top 3s ease-out, opacity 3s ease-out';

            container.appendChild(heart);

            // Animate upward
            requestAnimationFrame(() => {
                heart.style.top = '-100px';
                heart.style.opacity = '0';
            });

            setTimeout(() => heart.remove(), 3500);
        }, i * 100);
    }
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize starry background
    const canvas = document.getElementById('starry-canvas');
    new StarryNight(canvas);

    // Setup No button interactions
    setupNoButton();

    // Reset animations (in case of cached state)
    document.querySelectorAll('.anniversary-message p').forEach(line => {
        line.classList.remove('visible');
    });
});

// ===================================
// LOVE MEMORY MATCH GAME
// ===================================

const gameEmojis = ['💖', '💕', '🌹', '✨', '💫', '🦋', '🎀', '🌸', '🌻'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

function initGame() {
    const gameContainer = document.getElementById('memory-game');
    if (!gameContainer) return;

    // Create pairs of cards
    const cardPairs = [...gameEmojis, ...gameEmojis];

    // Shuffle cards
    cards = cardPairs.sort(() => Math.random() - 0.5);

    // Clear container
    gameContainer.innerHTML = '';

    // Create card elements
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;

        card.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back">${emoji}</div>
        `;

        card.addEventListener('click', () => flipCard(card));
        gameContainer.appendChild(card);
    });

    // Reset state
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    canFlip = true;

    updateStats();

    // Hide win screen
    const winScreen = document.getElementById('game-win');
    if (winScreen) {
        winScreen.classList.add('hidden');
        winScreen.classList.remove('show');
    }
}

function flipCard(card) {
    // Check if we can flip
    if (!canFlip) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    // Flip the card
    card.classList.add('flipped');
    flippedCards.push(card);

    // Create sparkle on flip
    const rect = card.getBoundingClientRect();
    createSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // Check for match
    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        checkMatch();
    }
}

function checkMatch() {
    canFlip = false;

    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.emoji === card2.dataset.emoji;

    if (isMatch) {
        // Match found!
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            updateStats();

            // Celebration sparkles
            [card1, card2].forEach(card => {
                const rect = card.getBoundingClientRect();
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        createSparkle(
                            rect.left + Math.random() * rect.width,
                            rect.top + Math.random() * rect.height
                        );
                    }, i * 50);
                }
            });

            flippedCards = [];
            canFlip = true;

            // Check win condition
            if (matchedPairs === gameEmojis.length) {
                setTimeout(showWin, 500);
            }
        }, 300);
    } else {
        // No match - flip back
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function updateStats() {
    const movesEl = document.getElementById('moves');
    const pairsEl = document.getElementById('pairs');

    if (movesEl) movesEl.textContent = moves;
    if (pairsEl) pairsEl.textContent = matchedPairs;
}

function showWin() {
    const winScreen = document.getElementById('game-win');
    if (winScreen) {
        winScreen.classList.remove('hidden');
        setTimeout(() => winScreen.classList.add('show'), 50);
    }

    // Celebration!
    createConfetti();
    createFloatingHearts();
}

function resetGame() {
    initGame();
}

// Initialize game when going to game page
const originalGoToPage = goToPage;
goToPage = function (pageId) {
    originalGoToPage(pageId);
    if (pageId === 'game-page') {
        setTimeout(initGame, 500);
    }
};

// Make functions global
window.goToPage = goToPage;
window.sayYes = sayYes;
window.resetGame = resetGame;
