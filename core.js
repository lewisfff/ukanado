'use strict';

class Game {

    constructor() {
        window.addEventListener('keypress', e => this._handleInputChar(e.key));
        this.currentLevel = new Level;
        this.stack = new Stack('stack');
        this.score = new ScoreDisplay;
        this._displayQuestions();
        this.inputBuffer = "";
    }

    _handleInputChar(char) {
        this.inputBuffer += char;
        if (this.inputBuffer.length > this.getCurrentAnswer().length) {
            this.inputBuffer = this.inputBuffer.substring(1);
        }

        if (this._answeredCorrectly()) {
            this._clearCurrentQuiz();
        }
    }

    _answeredCorrectly() {
        if (this.inputBuffer == this.getCurrentAnswer()) {
            return true;
        }
        return false;
    }

    _displayQuestions() {
        let questions = [];
        let levelData = this.currentLevel.data;
        for (let i = 0; i < levelData.length; i++) {
            questions.push(Object.keys(levelData[i])[0]);
        }

        this.stack.inject(questions);
    }

    clearCurrentQuiz() {
        this.inputBuffer = "";
        this.currentLevel.data.shift();
        this.stack.shift();

        if (this.currentLevel.data.length == 0) {
            console.info('end game');
        }
    }

    getCurrentQuestion() {
        return Object.keys(this.currentLevel.data[0])[0];
    }

    getCurrentAnswer() {
        return Object.values(game.currentLevel.data[0])[0];
    }

}

class Stack {

    constructor(stackId) {
        this.stack = document.getElementById(stackId);
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

class ScoreDisplay {

    constructor(progressId, timerId) {
        this.progress = document.getElementById(progressId);
        this.timer = document.getElementById(timerId);
        this._init();
    }

    _init() {
        this.startTime = 0;
        this.endTime = 0;
        this.timerStopped = false;
        this.progress = 0;
    }

    incrementProgress() {
        this.progress++;
    }

    startTimer() {
        if (this.startTime == 0) {
            this.startTime = new Date;
            requestAnimationFrame(this.updateTimer.bind(this));
        }
    }

    updateTimer() {
        if(!this.timerStopped){
            requestAnimationFrame(this.updateTimer.bind(this));
            this.injectTime(this.getSecondsElapsed(this.startTime, new Date));
            // console.log(this.getSecondsElapsed());
        }
    }

    endTimer() {
        if (this.timerUpdateId == 0) {
            this.endTime = new Date;
        }
        if (this.updateTimer) {
            this.timerStopped = true;
        }
        this.getSecondsElapsed(this.startTime, this.endTime);
    }

    getSecondsElapsed(start, end) {
        console.log(end - start)
        return (end - start);
    }

    getGrade() {
        return this.time / this.answered;
    }

    reset() {
        this._init();
    }

    _inject() {
        this._injectTime();
    }

    injectTime(array) {
        console.log(array);
    }

}

var game = new Game;