'use strict';

class Game {
    constructor() {
        window.addEventListener('keypress', e => this.handleInputChar(e.key));
        this.currentLevel = new Level;
        this.stack = new Stack('stack');
        this.stack.injectKeysFromMap(this.currentLevel.data);
        this.inputBuffer = "";
    }

    handleInputChar(char) {
        this.buffer += char;
        if(this.buffer.length > 4){
            this.buffer = buffer.substring(1);
        }
        console.log(char, romaji, romajiLength);
    }

    getCurrentQuestion() {
        this.currentLevel.data.entries().next().value[0];
    }

    getCurrentAnswer() {
        this.currentLevel.data.entries().next().value[1];
    }

    clearCurrentQuiz() {
        this.buffer = "";
        this.currentLevel.delete(this.currentLevel.data.entries().next());
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

    //todo decouple
    injectKeysFromMap(map) {
        let buffer = "";
        for (let [k, _] of map) {
            buffer += '<div>' + k + '</div>';
        }

        this._setHTML(buffer);
    }
}

class Level {
    constructor() {
        this.data = this.generateLevel();
    }

    generateLevel() {
        return new Map([
            ["し", "shi"],
            ["あ", "a"],
            ["い", "i"],
            ["う", "u"],
            ["え", "e"],
            ["お", "o"],
            ["か", "ka"],
            ["つ", "tsu"],
            ["め", "me"],
            ["ぽ", "po"]
        ]);
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