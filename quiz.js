let quizData = [];
let currentQuestionIndex = 0;
let userScores = [0, 0];
let currentPlayer = 0;

const player1Name = localStorage.getItem('player1');
const player2Name = localStorage.getItem('player2');
const selectedCategory = localStorage.getItem('selectedCategory');

async function fetchQuestions(category) {
    const response = await fetch(`https://opentdb.com/api.php?amount=6&type=multiple&category=${category}`);
    const data = await response.json();
    return data.results;
}

function decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

async function startQuiz() {
    quizData = await fetchQuestions(selectedCategory);
    renderQuestion();
}

function renderQuestion() {
    const questionData = quizData[currentQuestionIndex];
    document.querySelector('.question').textContent = decodeHtmlEntities(questionData.question);
    const optionsElement = document.querySelector('.options');
    optionsElement.innerHTML = '';
    const options = [...questionData.incorrect_answers, questionData.correct_answer];
    shuffleArray(options);

    options.forEach(option => {
        const decodedOption = decodeHtmlEntities(option);
        const label = document.createElement('label');
        label.classList.add('option-label');
        label.innerHTML = `<input type="radio" name="options" value="${decodedOption}"> ${decodedOption}`;
        optionsElement.appendChild(label);
    });

    document.querySelector('.error-msg').classList.add('hidden');
    updatePlayerTurnDisplay();
}

function updatePlayerTurnDisplay() {
    const playerTurnDisplay = document.querySelector('.player-turn');
    playerTurnDisplay.textContent = `It's ${currentPlayer === 0 ? player1Name : player2Name}'s turn!`;
    playerTurnDisplay.classList.toggle('player1', currentPlayer === 0);
    playerTurnDisplay.classList.toggle('player2', currentPlayer === 1);
}

document.getElementById('next-question').addEventListener('click', () => {
     const selectedOption = document.querySelector('input[name="options"]:checked');
     if (!selectedOption) {
        document.querySelector('.error-msg').textContent = 'Please select an answer!';
        document.querySelector('.error-msg').classList.remove('hidden');
        return;
     }

    const correctAnswer = quizData[currentQuestionIndex].correct_answer;
    const questionDifficulty = getDifficulty(currentQuestionIndex);

    if (selectedOption.value === correctAnswer) {
        userScores[currentPlayer] += questionDifficulty.points;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        currentPlayer = (currentPlayer + 1) % 2;
        renderQuestion();
    } else {
        endGame();
    }
});

function endGame() {
    document.querySelector('.container').classList.add('hidden');
    document.querySelector('.end-area').classList.remove('hidden');
    const totalScoreElement = document.querySelector('.total-score');

    if (userScores[0] > userScores[1]) {
        totalScoreElement.innerHTML = `<h1>${player1Name} Score: ${userScores[0]} | ${player2Name} Score: ${userScores[1]} - ${player1Name} Wins!</h1>`;
    } else if (userScores[1] > userScores[0]) {
        totalScoreElement.innerHTML = `<h1>${player1Name} Score: ${userScores[0]} | ${player2Name} Score: ${userScores[1]} - ${player2Name} Wins!</h1>`;
    } else {
        totalScoreElement.innerHTML = `<h1>${player1Name} Score: ${userScores[0]} | ${player2Name} Score: ${userScores[1]} - It's a Tie!</h1>`;
    }
}

document.getElementById('restart-game').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});

document.getElementById('exit-game').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'thanks.html';
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getDifficulty(questionIndex) {
    if (questionIndex < 2) return { level: 'easy', points: 10 };
    if (questionIndex < 4) return { level: 'medium', points: 15 };
    return { level: 'hard', points: 20 };
}
startQuiz();

