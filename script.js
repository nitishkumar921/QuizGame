let quizData = [];
let score = 0;
let usedQuestions = [];
let currentQuestion;

// Asynchronous function to load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('./questions.json');
        quizData = await response.json();
        resetGame();
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

function getRandomQuestion() {
    if (usedQuestions.length === quizData.length) {
        alert(`Congratulations! You completed all ${quizData.length} questions. Final Score: ${score}`);
        resetGame();
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * quizData.length);
    } while (usedQuestions.includes(randomIndex));

    usedQuestions.push(randomIndex);
    return randomIndex;
}

function loadQuestion() {
    currentQuestion = getRandomQuestion();
    if (currentQuestion === undefined) return;

    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");
    const quizItem = quizData[currentQuestion];

    questionEl.textContent = quizItem.question;
    const buttons = optionsEl.querySelectorAll("button");

    quizItem.options.forEach((option, index) => {
        buttons[index].textContent = option;
        buttons[index].disabled = false;
        buttons[index].style.backgroundColor = "#3498db";
    });

    // Hide the "Next" button until answered
    document.getElementById("next").style.display = "none";
}

function checkAnswer(selected) {
    const correct = quizData[currentQuestion].answer;
    const buttons = document.getElementById("options").querySelectorAll("button");

    if (selected === correct) {
        score++;
        buttons[selected].style.backgroundColor = "green";
    } else {
        buttons[selected].style.backgroundColor = "red";
        buttons[correct].style.backgroundColor = "green";
        gameOver();
        return;
    }

    buttons.forEach(button => (button.disabled = true));
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("next").style.display = "inline-block";
}

function gameOver() {
    setTimeout(() => {
        const restart = confirm(`Game Over! Your final score is: ${score}. Do you want to play again?`);
        if (restart) {
            resetGame();
        }
    }, 1000);
}

function resetGame() {
    score = 0;
    usedQuestions = [];
    loadQuestion();
}

document.getElementById("next").addEventListener("click", loadQuestion);

// Load questions when the page loads
loadQuestions();
