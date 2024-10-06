let clues = [];
let currentClueIndex = 0; // Keeps track of the current clue
let selectedDifficulty = ''; // Store selected difficulty

// Event listeners for difficulty selection
document.getElementById('easy').addEventListener('click', function() {
    selectedDifficulty = 'easy';
    startGame(); // Start the game
});

document.getElementById('medium').addEventListener('click', function() {
    selectedDifficulty = 'medium';
    startGame(); // Start the game
});

document.getElementById('hard').addEventListener('click', function() {
    selectedDifficulty = 'hard';
    startGame(); // Start the game
});

function startGame() {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    fetchClues(selectedDifficulty); // Fetch clues based on selected difficulty
}

async function fetchClues(difficulty) {
    const url = `ergo_${difficulty}_clues.json`; // Build the URL based on difficulty
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        clues = await response.json();
        
        // Filter clues based on difficulty
        clues = clues.clues.filter(clue => clue.difficulty === difficulty);

        // Check if clues are properly formatted
        if (!Array.isArray(clues) || clues.length === 0) {
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

    // Clear previous choices
    choicesContainer.innerHTML = '';

    // Display choices
    clues[currentClueIndex].choices.forEach(choice => {
        const label = document.createElement('label');
        const input = document.createElement('input');

        input.type = 'radio';
        input.name = 'answer';
        input.value = choice;

        label.appendChild(input);
        label.appendChild(document.createTextNode(choice));
        choicesContainer.appendChild(label);
        choicesContainer.appendChild(document.createElement('br'));
    });
}

// Event listener for the submit button
document.getElementById('submit-answer').addEventListener('click', function() {
    const feedbackElement = document.getElementById('feedback');
    const userAnswer = document.querySelector('input[name="answer"]:checked');

    if (!userAnswer) {
        feedbackElement.textContent = "Per favore, seleziona una risposta.";
        feedbackElement.style.color = "orange";
        return;
    }

    const correctAnswer = clues[currentClueIndex].answer; // Get the correct answer for the current clue

    // Check for similarity if the answer is incorrect
    if (userAnswer.value === correctAnswer) {
        feedbackElement.textContent = "Corretto! Passa al prossimo indizio!";
        feedbackElement.style.color = "green";
        currentClueIndex++;

        if (currentClueIndex < clues.length) {
            setTimeout(() => {
                displayClue(); // Display the next clue
            }, 2000); // Delay before showing the next clue
        } else {
            feedbackElement.textContent = "Complimenti! Hai trovato tutti i tesori!";
            document.getElementById('user-answer').style.display = 'none'; // Hide input
            document.getElementById('submit-answer').style.display = 'none'; // Hide button
        }
    } else {
        feedbackElement.textContent = "Sbagliato! Riprova.";
        feedbackElement.style.color = "red";
    }
});
