let clues = [];
let currentClueIndex = 0;

async function fetchClues() {
    try {
        const response = await fetch('ergo_clues.json'); // Recupera il file JSON locale
        if (!response.ok) {
            throw new Error(`Errore nel caricamento degli indizi: ${response.status}`);
        }
        clues = await response.json();

        if (!Array.isArray(clues.clues) || clues.clues.length === 0) {
            throw new Error("Nessun indizio trovato nel file JSON");
        }

        displayClue(); // Mostra il primo indizio
    } catch (error) {
        console.error("Errore:", error);
        document.getElementById('clue-text').textContent = "Errore nel caricamento degli indizi!";
    }
}

function displayClue() {
    const clueTitle = document.getElementById('clue-title');
    const clueText = document.getElementById('clue-text');
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = ''; // Reset feedback

    // Mostra l'indizio corrente
    clueTitle.textContent = `Indizio ${currentClueIndex + 1}`;
    clueText.textContent = clues.clues[currentClueIndex].question;
}

document.getElementById('submit-answer').addEventListener('click', function() {
    const userAnswer = document.getElementById('user-answer').value.trim().toLowerCase();
    const correctAnswer = clues.clues[currentClueIndex].answer.toLowerCase();
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

        if (currentClueIndex < clues.clues.length) {
            setTimeout(() => {
                document.getElementById('user-answer').value = ''; // Pulisci input
                displayClue(); // Mostra il prossimo indizio
            }, 2000);
        } else {
            feedbackElement.textContent = "Complimenti! Hai trovato tutti i tesori!";
            document.getElementById('user-answer').style.display = 'none'; // Nascondi input
            document.getElementById('submit-answer').style.display = 'none'; // Nascondi bottone
        }
    } else {
        feedbackElement.textContent = "Sbagliato! Riprova.";
        feedbackElement.style.color = "red";
    }
});

// Carica gli indizi quando la pagina viene caricata
fetchClues();

