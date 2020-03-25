var inquirer = require("inquirer");

var Word = require("./word.js");
var figlet = require('figlet');
var chalk = require('chalk');

var guesses = 10;
var points = 0;

var wordsToGuess = ["Firefly", "Serenity", "Star Wars", "Star Trek", "Star Ocean", "Mechwarrior", "Outlaw Star", "Gundam Wing", "Blade Runner", "Alien", "The Matrix"];
var randomWord;
var chosenWord;

function startGame() {

    console.log(chalk.blue("Your mission is to guess famous Sci-fi franchises!"));
}

function chooseRandomWord() {
    randomWord = wordsToGuess[Math.floor(Math.random() * wordsToGuess.length)]
    chosenWord = new Word(randomWord);
}

function guessWord() {
    if (guesses > 0 && points < 5) {
        console.log(chosenWord.display());
         inquirer.prompt([
            {
            name: "txt",
            message: "Guess a letter!",
                validate: function (str) {
                    if (str.length != 1) return false;
                    var regEx = new RegExp("^[a-zA-Z\s]{1,1}$");
                    return regEx.test(str);
                }
            }
        ]).then(function (guessedLetter) {
            var guess = guessedLetter.txt;
            chosenWord.checkGuess(guess);
            if (randomWord.toLowerCase().indexOf(guess.toLowerCase()) === -1) {
                guesses--;
                console.log(chalk.red("Nope! " + guesses + " guesses remaining"))
            } 
            else {
                if (points < 5) {
                console.log(chalk.green("Right!"))
                }
            }
            if (randomWord === chosenWord.display()) {
                console.log(chosenWord.display());
                guesses = 10;
                points++;
                if (points < 5) {
                    console.log(chalk.green("Good job! Next mission!"));
                    chooseRandomWord();
                }
                else {
                    winGame();
                }
            }
            if (guesses === 0) {
                loseGame();
            }
            guessWord();
        });
    }
}
function loseGame() {
    console.log(chalk.red("Mission failure! Game over!"));
    inquirer.prompt([
        {
            name: "confirm",
            type: "confirm",
            message: "Would you like to play again?",
            default: true
        }
    ])
        .then(function (inquirerResponse) {
            if (inquirerResponse.confirm) {
                guesses = 10;
                points = 0;
                chooseRandomWord();
                guessWord();
            }
            else {
                console.log(chalk.blue("Do, or do not, there is no try!"));
                process.exit();
            }
        })
}
function winGame() {
    figlet("Mission success! Congrats!", function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    })
    inquirer.prompt([
        {
            name: "confirm",
            type: "confirm",
            message: "Would you like to play again?",
            default: true
        }
    ])
        .then(function (inquirerResponse) {
            if (inquirerResponse.confirm) {
                guesses = 10;
                points = 0;
                chooseRandomWord();
                guessWord();
            }
            else {
                console.log(chalk.blue("Purple alert. User terminated function."))
                process.exit();
            }
        })

}
startGame();
chooseRandomWord();
guessWord();