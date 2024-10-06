let clues = [];
let currentClueIndex = 0;
let difficultyLevel = 'easy'; // Livello iniziale scelto dall'utente
let cluePrice = 0.01; // Prezzo iniziale per il livello facile
let questionsAnswered = 0; // Contatore delle domande risposte

// Carica i file JSON per ciascun livello
const difficultyFiles = {
    easy: 'ergo_clues_easy.json',
    medium: 'ergo_clues_medium.json',
    hard: 'ergo_clues_hard.json'
};

// Gestisci la selezione del livello di difficoltà
document.getElementById('easy').addEventListener('click', () => startGame('easy'));
document.getElementById('medium').addEventListener('click', () => startGame('medium'));
document.getElementById('hard').addEventListener('click', () => startGame('hard'));

// Funzione che inizia il gioco con il livello selezionato
function startGame(selectedDifficulty) {
    difficultyLevel = selectedDifficulty;
    currentClueIndex = 0;
    questionsAnswered = 0;

    // Nascondi la selezione della difficoltà e mostra il gioco
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    fetchClues();
}

// Carica gli indizi dal file JSON in base al livello selezionato
async function fetchClues() {
    const url = difficultyFiles[difficultyLevel];

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        clues = await response.json();
        clues = clues.clues; // Accedi all'array clues
        displayClue(); // Mostra il primo indizio
    } catch (error) {
        console.error('Error fetching clues:', error);
        document.getElementById('clue-text').textContent = "Errore nel caricamento degli indizi!";
    }
}

// Mostra il prossimo indizio
function displayClue() {
    const clueTitle = document.getElementById('clue-title');
    const clueText = document.getElementById('clue-text');
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = ''; // Reset del feedback

    // Mostra il nuovo indizio
    clueTitle.textContent = `Indizio ${currentClueIndex + 1}`;
    clueText.textContent = clues[currentClueIndex].question;

    // Aggiorna il costo dell'indizio
    document.getElementById('price').textContent = `Costo attuale per indizio: ${cluePrice.toFixed(2)} ERG`;
}

// Gestisci la risposta dell'utente
document.getElementById('submit-answer').addEventListener('click', function() {
    const userAnswer = document.getElementById('user-answer').value.trim().toLowerCase();
    const correctAnswer = clues[currentClueIndex].answer.toLowerCase();
    const feedbackElement = document.getElementById('feedback');

    if (userAnswer === '') {
        feedbackElement.textContent = "Per favore, inserisci una risposta.";
        feedbackElement.style.color = "orange";
        return;
    }

    if (userAnswer === correctAnswer) {
        feedbackElement.textContent = "Corretto! Passa al prossimo indizio!";
        feedbackElement.style.color = "green";
        currentClueIndex++;
        questionsAnswered++;

        // Verifica se il livello di difficoltà deve aumentare
        if (questionsAnswered % 5 === 0) {
            increaseDifficulty();
        }

        // Verifica se sono passate 20 domande per raddoppiare il prezzo
        if (questionsAnswered > 20) {
            cluePrice *= 2;
        }

        if (currentClueIndex < clues.length) {
            setTimeout(() => {
                document.getElementById('user-answer').value = ''; // Pulisci l'input
                displayClue(); // Mostra il prossimo indizio
            }, 2000); // Ritardo di 2 secondi prima del prossimo indizio
        } else {
            feedbackElement.textContent = "Complimenti! Hai trovato tutti i tesori!";
            document.getElementById('user-answer').style.display = 'none';
            document.getElementById('submit-answer').style.display = 'none';
        }
    } else {
        feedbackElement.textContent = "Sbagliato! Riprova.";
        feedbackElement.style.color = "red";
    }
});

// Aumenta il livello di difficoltà ogni 5 domande
function increaseDifficulty() {
    if (difficultyLevel === 'easy') {
        difficultyLevel = 'medium';
        cluePrice = 0.05;
        fetchClues(); // Carica le nuove domande
    } else if (difficultyLevel === 'medium') {
        difficultyLevel = 'hard';
        cluePrice = 0.10;
        fetchClues(); // Carica le nuove domande
    }
}

