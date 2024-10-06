let clues = [];
let currentClueIndex = 0; // Indice dell'indizio corrente
let questionsAnswered = 0; // Numero di domande a cui l'utente ha risposto
let cluePrice = 0.01; // Prezzo iniziale per ottenere un indizio
let difficultyLevel = 'easy'; // Livello di difficoltà iniziale

// Funzione per recuperare gli indizi da un file JSON locale in base al livello di difficoltà
async function fetchClues() {
    const url = `ergo_clue_${difficultyLevel}.json`; // Costruisce il nome del file in base alla difficoltà
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        clues = await response.json();
        
        // Verifica se gli indizi sono formattati correttamente
        if (!Array.isArray(clues) || clues.length === 0) {
            throw new Error('Nessun indizio trovato');
        }

        displayClue(); // Mostra il primo indizio dopo il recupero
    } catch (error) {
        console.error('Errore nel recupero degli indizi:', error);
        document.getElementById('clue-text').textContent = "Errore nel caricamento degli indizi!";
    }
}

// Funzione per visualizzare l'indizio corrente
function displayClue() {
    const clueTitle = document.getElementById('clue-title');
    const clueText = document.getElementById('clue-text');
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = ''; // Reset feedback

    // Mostra l'indizio corrente
    clueTitle.textContent = `Indizio ${currentClueIndex + 1}`;
    clueText.textContent = clues[currentClueIndex].question;
}

// Funzione per verificare se la risposta dell'utente è simile a quella corretta
function isSimilarAnswer(userAnswer, correctAnswer) {
    const threshold = 70; // Soglia di similarità per considerare una risposta corretta
    const score = getFuzzyMatchScore(userAnswer, correctAnswer);
    return score >= threshold;
}

// Funzione per calcolare il punteggio di similarità tra due risposte
function getFuzzyMatchScore(userAnswer, correctAnswer) {
    return Math.round((1 - (levenshteinDistance(userAnswer, correctAnswer) / Math.max(userAnswer.length, correctAnswer.length))) * 100);
}

// Funzione di Levenshtein per calcolare la distanza tra due stringhe
function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Sostituzione
                    Math.min(
                        matrix[i][j - 1] + 1, // Inserimento
                        matrix[i - 1][j] + 1 // Rimozione
                    )
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

// Funzione per aumentare la difficoltà
function increaseDifficulty() {
    if (questionsAnswered % 5 === 0 && questionsAnswered > 0) {
        if (cluePrice === 0.01) {
            cluePrice = 0.05; // Aumenta il prezzo a livello medio
            difficultyLevel = 'medium'; // Cambia il livello di difficoltà
        } else if (cluePrice === 0.05) {
            cluePrice = 0.10; // Aumenta il prezzo a livello difficile
            difficultyLevel = 'hard'; // Cambia il livello di difficoltà
        }
    }
}

// Listener per il pulsante di invio della risposta
document.getElementById('submit-answer').addEventListener('click', function() {
    const userAnswer = document.getElementById('user-answer').value.trim().toLowerCase();
    const correctAnswer = clues[currentClueIndex].answer.toLowerCase();
    const feedbackElement = document.getElementById('feedback');

    if (userAnswer === '') {
        feedbackElement.textContent = "Per favore, inserisci una risposta.";
        feedbackElement.style.color = "orange";
        return;
    }

    // Usa la funzione di similarità per confrontare le risposte
    if (isSimilarAnswer(userAnswer, correctAnswer)) {
        feedbackElement.textContent = "Corretto! Passa al prossimo indizio!";
        feedbackElement.style.color = "green";
        currentClueIndex++;
        questionsAnswered++;

        // Verifica se il livello di difficoltà deve aumentare
        increaseDifficulty();

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

// Funzione per iniziare il gioco e selezionare il livello di difficoltà
function startGame(selectedDifficulty) {
    difficultyLevel = selectedDifficulty; // Imposta il livello di difficoltà
    fetchClues(); // Recupera gli indizi
}

// Esempio di utilizzo: chiama startGame('easy') per iniziare il gioco con il livello facile
