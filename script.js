let clues = [];
let currentClueIndex = 0; // Keeps track of the current clue
let selectedDifficulty = '';
const costPerClue = {
    facile: 0.01,
    media: 0.05,
    difficile: 0.10
};

async function fetchClues(difficulty) {
    const url = `ergo_${difficulty}_clues.json`; // Construct the URL based on difficulty
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check if clues are properly formatted
        clues = data.clues; // Extract the clues array
        if (!Array.isArray(clues) || clues.length === 0) {
            throw new Error('No clues found for this difficulty');
        }

        // Filter clues based on the selected difficulty
        clues = clues.filter(clue => clue.difficulty === (difficulty === 'easy' ? 'facile' : difficulty === 'medium' ? 'medio' : 'difficile'));
        
        if (clues.length === 0) {
            throw new Error('No clues found for this difficulty');
        }

        displayClue(); // Show the first clue after fetching
    } catch (error) {
        console.error('Error fetching clues:', error);
        document.getElementById('clue-text').textContent = "Errore nel caricamento degli indizi!";
    }
}

// Function to display the current clue
function displayClue() {
    const clueTitle = document.getElementById('clue-title');
    const clueText = document.getElementById('clue-text');
    const choicesContainer = document.getElementById('choices-container');
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = ''; // Reset feedback

    // Display current clue
    clueTitle.textContent = `Indizio ${currentClueIndex + 1}`;
    clueText.textContent = clues[currentClueIndex].question;

    // Display multiple-choice options
    choicesContainer.innerHTML = ''; // Clear previous choices
    clues[currentClueIndex].choices.forEach(choice => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="radio" name="answer" value="${choice}" required>
            ${choice}
        `;
        choicesContainer.appendChild(label);
        choicesContainer.appendChild(document.createElement('br')); // Line break for better formatting
    });
}

// Event listener for the difficulty buttons
document.getElementById('easy').addEventListener('click', function() {
    selectedDifficulty = 'easy';
    document.getElementById('cost').textContent = costPerClue.easy; // Set cost for easy
    startGame();
});

document.getElementById('medium').addEventListener('click', function() {
    selectedDifficulty = 'medium';
    document.getElementById('cost').textContent = costPerClue.medium; // Set cost for medium
    startGame();
});

document.getElementById('hard').addEventListener('click', function() {
    selectedDifficulty = 'hard';
    document.getElementById('cost').textContent = costPerClue.hard; // Set cost for hard
    startGame();
});

// Function to start the game
function startGame() {
    document.getElementById('difficulty-selection').style.display = 'none'; // Hide difficulty selection
    document.getElementById('game-container').style.display = 'block'; // Show game container
    fetchClues(selectedDifficulty); // Fetch clues for the selected difficulty
}

// Event listener for the submit button
document.getElementById('submit-answer').addEventListener('click', function() {
    const userAnswer = document.querySelector('input[name="answer"]:checked'); // Get selected answer
    const feedbackElement = document.getElementById('feedback');

    if (!userAnswer) {
        feedbackElement.textContent = "Per favore, seleziona una risposta.";
        feedbackElement.style.color = "orange";
        return;
    }

    const userChoice = userAnswer.value; // Get the value of the selected radio button
    const correctAnswer = clues[currentClueIndex].answer; // Get the correct answer for the current clue

    if (userChoice === correctAnswer) {
        feedbackElement.textContent = "Corretto! Passa al prossimo indizio!";
        feedbackElement.style.color = "green";
        currentClueIndex++;

        if (currentClueIndex < clues.length) {
            setTimeout(() => {
                displayClue(); // Display the next clue
            }, 2000); // Delay before showing the next clue
        } else {
            feedbackElement.textContent = "Complimenti! Hai trovato tutti i tesori!";
            document.getElementById('user-answer').style.display = 'none'; // Hide input (not used anymore)
            document.getElementById('submit-answer').style.display = 'none'; // Hide button
        }
    } else {
        feedbackElement.textContent = "Sbagliato! Riprova.";
        feedbackElement.style.color = "red";
    }
});
