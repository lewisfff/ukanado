'use strict';

class Game {

    constructor() {
        window.addEventListener('keypress', e => this.handleInputChar(e.key));
        this.currentLevel = new Level;
        this.stack = new Stack('stack');
        this.displayQuestions();
        this.inputBuffer = "";
    }

    handleInputChar(char) {
        this.inputBuffer += char;
        if(this.inputBuffer.length > this.getCurrentAnswer().length){
            this.inputBuffer = this.inputBuffer.substring(1);
        }

        if(this.answeredCorrectly()){
            this.clearCurrentQuiz();
        }
    }

    answeredCorrectly() {
        if(this.inputBuffer == this.getCurrentAnswer()){
            return true;
        }
        return false;
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
        this.stack.shift();

        if(this.currentLevel.data.length == 0) {
            console.info('end game');
        }
    }

    displayQuestions() {
        let questions = [];
        let levelData = this.currentLevel.data;
        for (let i = 0; i < levelData.length; i++) {
            questions.push(Object.keys(levelData[i])[0]);
        }

        this.stack.inject(questions);
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
        this.stack.removeChild(this.stack.childNodes[0]);
    }

    inject(array) {
        let html = ""
        for (let i = 0; i < array.length; i++) {
            html += "<div>" + array[i] + "</div>";
        }

        this._setHTML(html);
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

var game = new Game;