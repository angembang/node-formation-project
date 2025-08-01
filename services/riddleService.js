class RiddleService {
    constructor() {
        this.resetSecretnumber();
    }

    resetSecretnumber() {
        this.secretnumber = Math.floor(Math.random() * 100) + 1;
        console.log(`Nouveau nombre secret : ${this.secretnumber}`);
    }

    checkNumber(attempt) {
        if (isNaN(attempt)) {
            return { success: false, message: 'Veuillez entrer un nombre valide.', isWin: false };
        }

        const guess = parseInt(attempt, 10);
        if (guess < this.secretnumber) {
            return { success: true, message: 'Trop bas', isWin: false };
        } else if (guess > this.secretnumber) {
            return { success: true, message: 'Trop grand', isWin: false };
        } else {
            const winMessage = `Bravo! Le nombre était ${this.secretnumber}`;
            // reset the game
            this.resetSecretnumber(); 
            return { success: true, message: winMessage, isWin: true, guessedNumber: guess };
        }
    }
}

module.exports = RiddleService;