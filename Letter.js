var Letter = function (character) {
    this.character = character.toUpperCase();
    this.letterGuessedCorrectly = false;
    this.showCharacter = function () {
        if (character === " ") {
            this.letterGuessedCorrectly = true;

        } else {
            this.letterGuessedCorrectly = false;
        };

        Letter.prototype.showCharacter = function () {
            if (this.letterGuessedCorrectly) {
                return this.value;
            } else {
                return "_";
            };
        };
    };
};

module.exports = Letter //export Letter 