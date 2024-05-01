const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

let allCards = [];
let gameBoard = document.getElementById('game-board');
let cardElements = [];
let score = 0;
let matchesFound = 0;
let flippedCards = [];
let timeLeft = 60;
let timer;

initializeGame();

function initializeGame() {
    suits.forEach(suit => {
        values.forEach(value => {
            allCards.push(`./cards/${value}_of_${suit}.png`);
        });
    });

    allCards.sort(() => 0.5 - Math.random());

    let selectedCards = allCards.slice(0, 8).flatMap(card => [card, card]);

    selectedCards.sort(() => 0.5 - Math.random());

    gameBoard.innerHTML = '';
    cardElements = selectedCards.map((card, index) => {
        let cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.value = card;
        cardElement.dataset.index = index;
        cardElement.tabIndex = 0;
        gameBoard.appendChild(cardElement);
        return cardElement;
    });

    cardElements.forEach((cardElement) => {
        cardElement.addEventListener('click', cardClick);
    });

    document.addEventListener('keydown', (event) => {
        let currentCard = document.activeElement;
        let currentIndex = Number(currentCard.dataset.index);
        let nextIndex;

        switch (event.key) {
            case 'ArrowUp':
                nextIndex = currentIndex - 4;
                break;
            case 'ArrowDown':
                nextIndex = currentIndex + 4;
                break;
            case 'ArrowLeft':
                nextIndex = currentIndex - 1;
                break;
            case 'ArrowRight':
                nextIndex = currentIndex + 1;
                break;
            case 'Enter':
                if (currentCard.className === 'card') {
                    currentCard.click();
                }
                return; 
            default:
                return;
        }

        if (nextIndex >= 0 && nextIndex < cardElements.length) {
            cardElements[nextIndex].focus();
        }

        event.preventDefault();
    });
}

function cardClick() {
    if (!timer) {
        startTimer();
    }
    let cardElement = this;
    if (flippedCards.length < 2 && !flippedCards.includes(cardElement)) {
        cardElement.style.backgroundImage = `url(${cardElement.dataset.value})`;
        flippedCards.push(cardElement);

        if (flippedCards.length === 2) {
            if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
                score += 10;
                matchesFound += 1;
                updateScoreBoard();
                flippedCards = [];
                if (matchesFound === cardElements.length / 2) {
                    setTimeout(() => {
                        alert(`Game over! Your final score is: ${score}`);
                        resetGame();
                    }, 100);
                }
            } else {
                setTimeout(() => {
                    flippedCards.forEach((card) => {
                        card.style.backgroundImage = 'url("./cards/cover.png")';
                    });
                    score -= 5;
                    updateScoreBoard();
                    flippedCards = [];
                }, 400);
            }
        }
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            resetGame();
        }
    }, 1000);
}

function updateScoreBoard() {
    document.getElementById('score').textContent = score;
    document.getElementById('matches').textContent = matchesFound;
}

function resetGame() {
    clearInterval(timer);
    score = 0;
    matchesFound = 0;
    flippedCards = [];
    allCards = [];
    updateScoreBoard();
    initializeGame();
}
