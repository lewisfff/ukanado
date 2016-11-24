'use strict';

class Game {
    constructor() {
        window.addEventListener('keypress', e => this.handleInputChar(e.key));
        this.currentLevel = new Level;
        this.stack = new Stack('stack');
        this.stack.injectKeys(this.currentLevel.data);
        this.inputBuffer = "";
    }

    handleInputChar(char) {
        this.inputBuffer += char;
        if(this.inputBuffer.length > this.getCurrentAnswer().length){
            this.inputBuffer = this.inputBuffer.substring(1);
        }

        if(this.checkAnswer()){
            this.clearCurrentQuiz();
        }
    }
    
    checkAnswer() {
        if(this.inputBuffer == this.getCurrentAnswer()){
            console.log('answer: '+ this.inputBuffer + 
                ' is equal to question: '+ this.getCurrentAnswer() + 
                ' (' + this.getCurrentQuestion() + ').');
            return true;
        } else {
            console.log('answer: '+ this.inputBuffer + 
                ' is NOT equal to question: '+ this.getCurrentAnswer() + 
                ' (' + this.getCurrentQuestion() + ').');
            return false;
        }
    }

    getCurrentQuestion() {
        return Object.keys(this.currentLevel.data[0])[0];
    }

    getCurrentAnswer() {
        return Object.values(game.currentLevel.data[0])[0];
    }

    clearCurrentQuiz() {
        this.inputBuffer = "";
        this.currentLevel.data.shift();
    }

    moveToNextQuestion() {
        if(this.currentLevel.Length == 1) {
            console.info('end game');

            return false;
        }
    }
}

class Stack {
    constructor(id) {
        this.stack = document.getElementById(id);
    }

    _getHTML() {
        return this.stack.innerHTML;
    }

    _setHTML(str) {
        this.stack.innerHTML = str;
    }

    shift() {
        this.stack.removeChild(0);
    }

    injectKeys(array) {
        let buffer = "";
        var arrayLength = array.length
        for (var i = 0; i < arrayLength; i++) {
            buffer += '<div>' + Object.keys(array[i])[0] + '</div>';
        }
        this._setHTML(buffer);
    }
}

class Level {
    constructor() {
        this.data = this.generateLevel();
    }

    generateLevel() {
        return [
            {"し": "shi"},
            {"あ": "a"},
            {"い": "i"},
            {"う": "u"},
            {"え": "e"},
            {"お": "o"},
            {"か": "ka"},
            {"つ": "tsu"},
            {"め": "me"},
            {"ぽ": "po"}
        ];
    }
}

class Char {
    constructor() {

    }
}

// window.addEventListener('keypress', onKeyHandler);


let game = new Game;
console.log(game.currentLevel);
// function onKeyHandler(event) {
//     console.log(event.key);
//     game.
// }

// console.table(level1.generateLevel());