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
            this.clearCurrentQuiz();
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
        let level = []
        for (let i = 0;i < 100; i++) {
            level.push(hiragana[~~(Math.random() * hiragana.length)]);
        }
        return level;
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
        // console.log(end - start)
        return (end - start) / 1000;
    }

    getGrade() {
        return this.time / this.answered;
    }

    reset() {
        this._init();
    }

    _inject() {
        this.injectTime();
    }

    injectTime(array) {
        console.log(array);
    }

}

var hiragana = [
    {あ: 'a'},
    {い: 'i'},
    {う: 'u'},
    {え: 'e'},
    {お: 'o'},
    {ゔぁ: 'va'},
    {ゔぃ: 'vi'},
    {ゔ: 'vu'},
    {ゔぇ: 've'},
    {ゔぉ: 'vo'},
    {か: 'ka'},
    {き: 'ki'},
    {きゃ: 'kya'},
    {きぃ: 'kyi'},
    {きゅ: 'kyu'},
    {く: 'ku'},
    {け: 'ke'},
    {こ: 'ko'},
    {が: 'ga'},
    {ぎ: 'gi'},
    {ぐ: 'gu'},
    {げ: 'ge'},
    {ご: 'go'},
    {ぎゃ: 'gya'},
    {ぎぃ: 'gyi'},
    {ぎゅ: 'gyu'},
    {ぎぇ: 'gye'},
    {ぎょ: 'gyo'},
    {さ: 'sa'},
    {す: 'su'},
    {せ: 'se'},
    {そ: 'so'},
    {ざ: 'za'},
    {ず: 'zu'},
    {ぜ: 'ze'},
    {ぞ: 'zo'},
    {し: 'shi'},
    {しゃ: 'sha'},
    {しゅ: 'shu'},
    {しょ: 'sho'},
    {じ: 'ji'},
    {じゃ: 'ja'},
    {じゅ: 'ju'},
    {じょ: 'jo'},
    {た: 'ta'},
    {ち: 'chi'},
    {ちゃ: 'cha'},
    {ちゅ: 'chu'},
    {ちょ: 'cho'},
    {つ: 'tsu'},
    {て: 'te'},
    {と: 'to'},
    {だ: 'da'},
    {ぢ: 'di'},
    {づ: 'du'},
    {で: 'de'},
    {ど: 'do'},
    {な: 'na'},
    {に: 'ni'},
    {にゃ: 'nya'},
    {にゅ: 'nyu'},
    {にょ: 'nyo'},
    {ぬ: 'nu'},
    {ね: 'ne'},
    {の: 'no'},
    {は: 'ha'},
    {ひ: 'hi'},
    {ふ: 'fu'},
    {へ: 'he'},
    {ほ: 'ho'},
    {ひゃ: 'hya'},
    {ひゅ: 'hyu'},
    {ひょ: 'hyo'},
    {ふぁ: 'fa'},
    {ふぃ: 'fi'},
    {ふぇ: 'fe'},
    {ふぉ: 'fo'},
    {ば: 'ba'},
    {び: 'bi'},
    {ぶ: 'bu'},
    {べ: 'be'},
    {ぼ: 'bo'},
    {びゃ: 'bya'},
    {びゅ: 'byu'},
    {びょ: 'byo'},
    {ぱ: 'pa'},
    {ぴ: 'pi'},
    {ぷ: 'pu'},
    {ぺ: 'pe'},
    {ぽ: 'po'},
    {ぴゃ: 'pya'},
    {ぴゅ: 'pyu'},
    {ぴょ: 'pyo'},
    {ま: 'ma'},
    {み: 'mi'},
    {む: 'mu'},
    {め: 'me'},
    {も: 'mo'},
    {みゃ: 'mya'},
    {みゅ: 'myu'},
    {みょ: 'myo'},
    {や: 'ya'},
    {ゆ: 'yu'},
    {よ: 'yo'},
    {ら: 'ra'},
    {り: 'ri'},
    {る: 'ru'},
    {れ: 're'},
    {ろ: 'ro'},
    {りゃ: 'rya'},
    {りゅ: 'ryu'},
    {りょ: 'ryo'},
    {わ: 'wa'},
    {を: 'wo'},
    {ん: 'n'},
    {ゐ: 'wi'},
    {ゑ: 'we'},
    {きぇ: 'kye'},
    {きょ: 'kyo'},
    {じぃ: 'jyi'},
    {じぇ: 'jye'},
    {ちぃ: 'cyi'},
    {ちぇ: 'che'},
    {ひぃ: 'hyi'},
    {ひぇ: 'hye'},
    {びぃ: 'byi'},
    {びぇ: 'bye'},
    {ぴぃ: 'pyi'},
    {ぴぇ: 'pye'},
    {みぇ: 'mye'},
    {みぃ: 'myi'},
    {りぃ: 'ryi'},
    {りぇ: 'rye'},
    {にぃ: 'nyi'},
    {にぇ: 'nye'},
    {しぃ: 'syi'},
    {しぇ: 'she'},
    {いぇ: 'ye'},
    {うぁ: 'wha'},
    {うぉ: 'who'},
    {うぃ: 'wi'},
    {うぇ: 'we'},
    {ゔゃ: 'vya'},
    {ゔゅ: 'vyu'},
    {ゔょ: 'vyo'},
    {すぁ: 'swa'},
    {すぃ: 'swi'},
    {すぅ: 'swu'},
    {すぇ: 'swe'},
    {すぉ: 'swo'},
    {くゃ: 'qya'},
    {くゅ: 'qyu'},
    {くょ: 'qyo'},
    {くぁ: 'qwa'},
    {くぃ: 'qwi'},
    {くぅ: 'qwu'},
    {くぇ: 'qwe'},
    {くぉ: 'qwo'},
    {ぐぁ: 'gwa'},
    {ぐぃ: 'gwi'},
    {ぐぅ: 'gwu'},
    {ぐぇ: 'gwe'},
    {ぐぉ: 'gwo'},
    {つぁ: 'tsa'},
    {つぃ: 'tsi'},
    {つぇ: 'tse'},
    {つぉ: 'tso'},
    {てゃ: 'tha'},
    {てぃ: 'thi'},
    {てゅ: 'thu'},
    {てぇ: 'the'},
    {てょ: 'tho'},
    {とぁ: 'twa'},
    {とぃ: 'twi'},
    {とぅ: 'twu'},
    {とぇ: 'twe'},
    {とぉ: 'two'},
    {ぢゃ: 'dya'},
    {ぢぃ: 'dyi'},
    {ぢゅ: 'dyu'},
    {ぢぇ: 'dye'},
    {ぢょ: 'dyo'},
    {でゃ: 'dha'},
    {でぃ: 'dhi'},
    {でゅ: 'dhu'},
    {でぇ: 'dhe'},
    {でょ: 'dho'},
    {どぁ: 'dwa'},
    {どぃ: 'dwi'},
    {どぅ: 'dwu'},
    {どぇ: 'dwe'},
    {どぉ: 'dwo'},
    {ふぅ: 'fwu'},
    {ふゃ: 'fya'},
    {ふゅ: 'fyu'},
    {ふょ: 'fyo'}
];

var game = new Game;