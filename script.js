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

const allEmojis = ['💖', '💕', '🌹', '✨', '💫', '🦋', '🎀', '🌸', '🌻'];
const PAIRS_COUNT = 6;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

function initGame() {
    const gameContainer = document.getElementById('memory-game');
    if (!gameContainer) return;

    // Randomly select 6 emojis from the pool of 9
    const shuffledEmojis = [...allEmojis].sort(() => Math.random() - 0.5);
    const selectedEmojis = shuffledEmojis.slice(0, PAIRS_COUNT);

    // Create pairs of cards
    const cardPairs = [...selectedEmojis, ...selectedEmojis];

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
            if (matchedPairs === PAIRS_COUNT) {
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

// ===================================
// THEME SWITCHER
// ===================================

function setTheme(theme) {
    document.body.classList.remove('theme-starry', 'theme-sunrise');
    document.body.classList.add(`theme-${theme}`);
    goToPage('anniversary-page');
}

// ===================================
// TYPEWRITER EFFECT
// ===================================

const letterText = `Today feels like a quiet marker in time - a moment to slow down and notice how naturally our lives have learned to move together.

Happy anniversary, my love.

What we share isn't loud or dramatic; it's steady, warm, and deeply real. Being with you has changed the way the world feels to me, like everything carries a little more color, a little more meaning, simply because you're in it.

I think about the beginning often - how nervous I was, how my hands betrayed me before my heart did, spilling tea on our first date while trying to act calm. I remember sitting there, pretending to listen while actually just staring at you, admiring the way you existed so effortlessly in front of me.

That moment still makes me smile, because somehow, even in my clumsiness, something honest started forming. Loving you didn't happen all at once - it unfolded slowly, layer by layer, until staying felt like the only option.

Being with you has taught me what peace really feels like. The way hugging you calms me, how everything inside me settles the moment I'm close to you - it's something I can't explain, only feel.

Your presence quiets the noise in my head. Your smile alone can change the direction of my entire day, like light breaking through when I didn't even realize it was cloudy.

I love you in the simplest, most human ways. I love kissing you, stealing moments when the world isn't watching. I love taking pictures of you - even though you don't like most of them - because to me, every one of them holds something I don't want to forget.

They're all my favorite. Each photo feels like proof of how beautiful you are, not just to look at, but to love.

What makes us special to me is how grounded we are. Our love isn't about perfection; it's about effort, honesty, and choosing each other on ordinary days.

So today, I'm celebrating us - the memories we've created, the comfort we've found in each other, the quiet strength of what we're building.

I choose you, clearly and intentionally, today and every day that follows.

I love you so much my ውዲቱ ❤️
Always 💕`;

let typewriterIndex = 0;
let typewriterTimeout = null;

function startTypewriter() {
    const textElement = document.getElementById('typewriter-text');
    const cursor = document.querySelector('.letter-cursor');
    const continueBtn = document.getElementById('anniversary-continue');

    if (!textElement) return;

    typewriterIndex = 0;
    textElement.textContent = '';

    function type() {
        if (typewriterIndex < letterText.length) {
            textElement.textContent += letterText.charAt(typewriterIndex);
            typewriterIndex++;

            // Variable speed for natural feel
            let delay = 20;
            const char = letterText.charAt(typewriterIndex - 1);
            if (char === '.' || char === '!' || char === '?') delay = 300;
            else if (char === ',') delay = 150;
            else if (char === '\n') delay = 200;

            typewriterTimeout = setTimeout(type, delay);
        } else {
            // Typing complete
            if (cursor) cursor.style.display = 'none';
            if (continueBtn) {
                continueBtn.style.display = 'inline-flex';
                continueBtn.classList.add('fade-in');
            }
        }
    }

    type();
}

// ===================================
// PHOTO CAROUSEL
// ===================================

const allPhotos = ['img.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg', 'img10.jpg'];
let shuffledPhotos = [];
let currentPhotoIndex = 0;

function initCarousel() {
    const slide = document.getElementById('carousel-slide');
    const dotsContainer = document.getElementById('carousel-dots');

    if (!slide || !dotsContainer) return;

    // Shuffle photos randomly
    shuffledPhotos = [...allPhotos].sort(() => Math.random() - 0.5);

    // Clear and add images
    slide.innerHTML = '';
    dotsContainer.innerHTML = '';

    shuffledPhotos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = photo;
        img.alt = `Memory ${index + 1}`;
        slide.appendChild(img);

        const dot = document.createElement('div');
        dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
        dot.onclick = () => goToPhoto(index);
        dotsContainer.appendChild(dot);
    });

    currentPhotoIndex = 0;
    updateCarousel();
}

function updateCarousel() {
    const slide = document.getElementById('carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    if (slide) {
        slide.style.transform = `translateX(-${currentPhotoIndex * 100}%)`;
    }

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentPhotoIndex);
    });
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % shuffledPhotos.length;
    updateCarousel();
    createSparkle(window.innerWidth / 2, window.innerHeight / 2);
}

function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + shuffledPhotos.length) % shuffledPhotos.length;
    updateCarousel();
    createSparkle(window.innerWidth / 2, window.innerHeight / 2);
}

function goToPhoto(index) {
    currentPhotoIndex = index;
    updateCarousel();
}

// ===================================
// REASONS I LOVE YOU
// ===================================

const reasons = [
    { emoji: '🌸', text: 'Your gentle kindness' },
    { emoji: '💖', text: 'Your pure heart' },
    { emoji: '✨', text: 'Your beautiful mind' },
    { emoji: '🌊', text: 'Your calm presence' },
    { emoji: '👀', text: 'Your sparkly eyes' },
    { emoji: '🤗', text: 'Your loving touch' },
    { emoji: '🎵', text: 'Your tender voice' },
    { emoji: '🌟', text: 'Your radiant face' },
    { emoji: '😊', text: 'Your killer smile' },
    { emoji: '💫', text: 'Your dreamy stare' },
    { emoji: '🫂', text: 'Your cozy hugs' }
];

let reasonsShown = 0;

function initReasons() {
    const list = document.getElementById('reasons-list');
    const continueBtn = document.getElementById('reasons-continue');

    if (!list) return;

    list.innerHTML = '';
    reasonsShown = 0;

    if (continueBtn) continueBtn.style.display = 'none';

    reasons.forEach((reason, index) => {
        const item = document.createElement('div');
        item.className = 'reason-item';
        item.innerHTML = `
            <span class="reason-emoji">${reason.emoji}</span>
            <span class="reason-text">${reason.text}</span>
        `;
        list.appendChild(item);
    });

    // Animate reasons one by one
    showNextReason();
}

function showNextReason() {
    const items = document.querySelectorAll('.reason-item');
    const continueBtn = document.getElementById('reasons-continue');

    if (reasonsShown < items.length) {
        items[reasonsShown].classList.add('visible');
        createSparkle(
            window.innerWidth / 2 + (Math.random() - 0.5) * 100,
            150 + reasonsShown * 50
        );
        reasonsShown++;
        setTimeout(showNextReason, 400);
    } else {
        // All reasons shown
        if (continueBtn) {
            continueBtn.style.display = 'inline-flex';
            continueBtn.classList.add('fade-in');
        }
    }
}

// ===================================
// ENHANCED PAGE NAVIGATION
// ===================================

const originalGoToPage = goToPage;
goToPage = function (pageId) {
    originalGoToPage(pageId);

    // Page-specific initializations
    if (pageId === 'gallery-page') {
        setTimeout(initCarousel, 300);
    } else if (pageId === 'reasons-page') {
        setTimeout(initReasons, 300);
    } else if (pageId === 'game-page') {
        setTimeout(initGame, 500);
    }
};

// Make functions global
window.goToPage = goToPage;
window.sayYes = sayYes;
window.resetGame = resetGame;
window.nextPhoto = nextPhoto;
window.prevPhoto = prevPhoto;

