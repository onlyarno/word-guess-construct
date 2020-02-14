var Word = require("./Word.js");
var inquirer = require("inquirer");
var isLetter = require('is-letter');
var userGuessedCorrectly = false;
var wordList = ["apple", "orange", "banana", "watermelon", "mango", "kiwi", "grapefruit", "pomegranate", "durian", "dragonfruit", "lemon", "lime"];//Our word bank - predefined list of words to choose from.

var randomFruit;
var someFruit;

var wins = 0;
var losses = 0;
var guessesRemaining = 10;

require('events').EventEmitter.prototype._maxListeners = 100;

var userGuess = "";

var lettersAlreadyGuessedList = "";
var lettersAlreadyGuessedListArray = [];

var slotsFilledIn = 0;

confirmStart();

function confirmStart() {
    var readyToStartGame = [
        {
            type: 'text',
            name: 'playerName',
            message: 'What is your name?'
        },
        {
            type: 'confirm',
            name: 'readyToPlay',
            message: "Do you wanna play a game? I'm thinking of a fruit; guess its letters. 10 mistakes maximum. Ready?",
            default: true
        }
    ];

    inquirer.prompt(readyToStartGame).then(answers => {

        if (answers.readyToPlay) {
            console.log(("Great! Welcome, " + answers.playerName + ". Let's do dis..."));
            startGame();
        }

        else {

            console.log(("Good bye, " + answers.playerName + "!"));
            return;
        }
    });
}


function startGame() {

    guessesRemaining = 10;

    chooseRandomWord();

    lettersAlreadyGuessedList = "";
    lettersAlreadyGuessedListArray = [];
}

function chooseRandomWord() {

    randomFruit = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

    someFruit = new Word(randomFruit);

    console.log(("Your 'fruit' contains " + randomFruit.length + " letters."));
    console.log(("'FRUIT' TO GUESS:"));

    someFruit.splitWord();
    someFruit.generateLetters();
    guessLetter();
}


function guessLetter() {

    if (slotsFilledIn < someFruit.letters.length || guessesRemaining > 0) {
        inquirer.prompt([
            {
                name: "letter",
                message: "Guess a letter:",

                validate: function (value) {
                    if (isLetter(value)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        ]).then(function (guess) {

            guess.letter.toUpperCase();
            console.log(("You guessed: " + guess.letter.toUpperCase()));

            userGuessedCorrectly = false;

            if (lettersAlreadyGuessedListArray.indexOf(guess.letter.toUpperCase()) > -1) {

                console.log(("You already guessed that letter. Enter another one."));
                console.log(("*****************************************************************************"));
                guessLetter();
            }


            else if (lettersAlreadyGuessedListArray.indexOf(guess.letter.toUpperCase()) === -1) {

                lettersAlreadyGuessedList = lettersAlreadyGuessedList.concat(" " + guess.letter.toUpperCase());
                lettersAlreadyGuessedListArray.push(guess.letter.toUpperCase());

                console.log((('Letters guessed so far: ') + lettersAlreadyGuessedList));


                for (i = 0; i < someFruit.letters.length; i++) {

                    if (guess.letter.toUpperCase() === someFruit.letters[i].character && someFruit.letters[i].letterGuessedCorrectly === false) {

                        someFruit.letters[i].letterGuessedCorrectly === true;

                        userGuessedCorrectly = true;
                        someFruit.underscores[i] = guess.letter.toUpperCase();

                        slotsFilledIn++
                    }
                }

                console.log(("WORD TO GUESS:"));
                someFruit.splitWord();
                someFruit.generateLetters();


                if (userGuessedCorrectly) {
                    console.log(('CORRECT!'));
                    console.log(("*****************************************************************************"));

                    checkIfUserWon();
                }


                else {
                    console.log(('INCORRECT!'));

                    guessesRemaining--;
                    console.log(("You have " + guessesRemaining + " guesses left."));
                    console.log(("*****************************************************************************"));

                    checkIfUserWon();
                }
            }
        });
    }
}


function checkIfUserWon() {

    if (guessesRemaining === 0) {
        console.log(("*****************************************************************************"));
        console.log(('YOU LOST. BETTER LUCK NEXT TIME.'));
        console.log(("The 'fruit' was: " + randomFruit));

        losses++;

        console.log(("Wins: " + wins));
        console.log(("Losses: " + losses));
        console.log(("*****************************************************************************"));

        playAgain();
    }

    else if (slotsFilledIn === someFruit.letters.length) {
        console.log(("*****************************************************************************"));
        console.log(("YOU WON!"));

        wins++;

        console.log(("Wins: " + wins));
        console.log(("Losses: " + losses));
        console.log(("*****************************************************************************"));

        playAgain();
    }

    else {

        guessLetter("");
    }

}


function playAgain() {
    var playGameAgain = [
        {
            type: 'confirm',
            name: 'playAgain',
            message: 'Do you want to play again?',
            default: true
        }
    ];

    inquirer.prompt(playGameAgain).then(userWantsTo => {
        if (userWantsTo.playAgain) {

            lettersAlreadyGuessedList = "";
            lettersAlreadyGuessedListArray = [];

            slotsFilledIn = 0;
            console.log(("Great! Welcome back. Let's begin..."));

            startGame();
        }

        else {

            console.log(("Good bye!"));
            return;
        }
    });
}