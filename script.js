let clues = [];
let currentClueIndex = 0; // Keeps track of the current clue
let selectedDifficulty = ''; // To store the selected difficulty level

// Funzione per caricare gli indizi in base alla difficoltà selezionata
async function fetchClues(difficulty) {
    const url = `ergo_${difficulty}_clues.json`; // Costruisce l'URL in base alla difficoltà
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        clues = await response.json();

        // Check if clues are properly formatted
        if (!Array.isArray(clues.clues) || clues.clues.length === 0) {
            throw new Error('No clues found');
        }

        displayClue(); // Mostra il primo indizio dopo aver caricato i dati
    } catch (error) {
        console.error('Error fetching clues:', error);
        document.getElementById('clue-text').textContent = "Errore nel caricamento degli indizi!";
    }
}

// Funzione per visualizzare l'indizio corrente
function displayClue() {
    const clueTitle = document.getElementById('clue-title');
    const clueText = document.getElementById('clue-text');
    const feedbackElement = document.getElementById('feedback');
    const choicesContainer = document.getElementById('choices-container');
    feedbackElement.textContent = ''; // Resetta il feedback

    // Visualizza l'indizio corrente
    const currentClue = clues.clues[currentClueIndex];
    clueTitle.textContent = `Indizio ${currentClueIndex + 1}`;
    clueText.textContent = currentClue.question;

    // Pulisce le scelte precedenti
    choicesContainer.innerHTML = '';

    // Visualizza le scelte di risposta
    currentClue.choices.forEach((choice, index) => {
        const choiceElement = document.createElement('div');
        choiceElement.innerHTML = `<input type="radio" name="answer" value="${choice}" id="choice${index}"> <label for="choice${index}">${choice}</label>`;
        choicesContainer.appendChild(choiceElement);
    });
}

// Funzione per verificare la risposta dell'utente
function checkAnswer(userAnswer) {
    const currentClue = clues.clues[currentClueIndex];
    const correctAnswer = currentClue.answer; // Ottiene la risposta corretta

    // Controlla se la risposta dell'utente è corretta
    if (userAnswer === correctAnswer) {
        return 'Corretto! Passa al prossimo indizio!';
    } else if (isCloseEnough(userAnswer, correctAnswer)) {
        return 'Quasi! Prova a riflettere su questa risposta.';
    } else {
        return 'Sbagliato! Riprova.';
    }
}

// Funzione per determinare se la risposta dell'utente è "vicina" alla risposta corretta
function isCloseEnough(userAnswer, correctAnswer) {
    // Modifica questa logica per adattarla alla tua definizione di "vicinanza"
    return userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer);
}

// Aggiunge gli ascoltatori di eventi per i pulsanti di selezione della difficoltà
document.getElementById('easy').addEventListener('click', function() {
    selectedDifficulty = 'easy';
    startGame();
});

document.getElementById('medium').addEventListener('click', function() {
    selectedDifficulty = 'medium';
    startGame();
});

document.getElementById('hard').addEventListener('click', function() {
    selectedDifficulty = 'hard';
    startGame();
});

// Inizia il gioco nascondendo la selezione della difficoltà e mostrando il contenitore del gioco
function startGame() {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    fetchClues(selectedDifficulty); // Fetch clues based on selected difficulty
}

// Aggiungi l'ascoltatore di eventi per il pulsante di invio della risposta
document.getElementById('submit-answer').addEventListener('click', function() {
    const selectedChoice = document.querySelector('input[name="answer"]:checked');
    const feedbackElement = document.getElementById('feedback');

    if (!selectedChoice) {
        feedbackElement.textContent = "Per favore, seleziona una risposta.";
        feedbackElement.style.color = "orange";
        return;
    }

    const userAnswer = selectedChoice.value; // Ottiene la risposta selezionata
    const feedbackMessage = checkAnswer(userAnswer); // Verifica la risposta dell'utente
    feedbackElement.textContent = feedbackMessage; // Mostra il feedback

    if (feedbackMessage.startsWith('Corretto')) {
        currentClueIndex++;
        if (currentClueIndex < clues.clues.length) {
            setTimeout(() => {
                displayClue(); // Mostra il prossimo indizio
            }, 2000); // Ritardo prima di mostrare il prossimo indizio
        } else {
            feedbackElement.textContent = "Complimenti! Hai trovato tutti i tesori!";
            document.getElementById('choices-container').style.display = 'none'; // Nascondi le scelte
            document.getElementById('submit-answer').style.display = 'none'; // Nascondi il pulsante
        }
    } else {
        feedbackElement.style.color = "red";
    }
});
