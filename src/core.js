'use strict';

class Game {

    constructor() {
        window.addEventListener('keypress', e => this._handleInputChar(e.key));
        this.practise = 0;
        this.inputBuffer = "";
        this.stack = new Stack('stack');
        this.score = new ScoreDisplay('progress','timer','end-screen');
        this.score.setQuestionCount(20);
        this.currentLevel = new Level(this.score.questionCount);
        this._displayQuestions();
    }

    _handleInputChar(char) {
        this.inputBuffer += char;

        if (this.score.timerStopped == true) {
            if (this.score.endTime) {
                // TODO: handle this without reload
                location.reload();
            }
            this.score.startTimer();
        }

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
        // let questions = [];
        // let levelData = this.currentLevel.data;
        // for (let i = 0; i < levelData.length; i++) {
        //     questions.push(Object.keys(levelData[i])[0]);
        // }

        this.stack.inject(this.currentLevel.data);
    }

    clearCurrentQuiz() {
        this.inputBuffer = "";
        this.currentLevel.data.shift();
        this.stack.shift();
        this.score.incrementProgress();

        if (this.currentLevel.data.length == 0) {
            this.score.endTimer();
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
        this.training = false;
    }

    _getHTML() {
        return this.stack.innerHTML;
    }

    _setHTML(str) {
        this.stack.innerHTML = str;
    }

    shift() {
        this.stack.childNodes[0].className += "slide";
        setTimeout(function(){
            this.stack.removeChild(this.stack.childNodes[0]);
        },300);

    }

    inject(array) {
        let html = ""
        for (let i = 0; i < array.length; i++) {
            html += '<div ';
            if (this.training == true) {
                html += 'romaji="' + Object.values(array[i]) + '"';
            }
            html += '>' + Object.keys(array[i]) + '</div>';
        }

        this._setHTML(html);
    }

}

class Level {

    constructor(questionCount) {
        this.weight = [0.75, 0.2, 0.049, 0.001]
        this.kana = hiragana;
        this.list = Object.getOwnPropertyNames(this.kana);
        this.data = this.generateLevel(questionCount);
    }

    generateLevel(questionCount) {
        let level = [];
        let katakana = this.kana;
        let hira_start = 0x3041;
        let kata_start = 0x30A1;

        for (let i in katakana) {
            for (let prop in katakana[i]) {
                let hiraString = Object.keys(katakana[i][prop])[0];
                let hiraAnswer = Object.values(katakana[i][prop])[0];
                let kataString = "";

                for (let ch = 0; ch < hiraString.length; ch++) {
                    let keyCode = hiraString[ch].charCodeAt(0);
                    keyCode += kata_start - hira_start;
                    let keyChar = String.fromCharCode(keyCode);
                    kataString += keyChar;
                }
                this.kana[i].push({[kataString]: hiraAnswer});
            }
        }

        for (let i = 0;i < questionCount; i++) {
            let listGroup = Random.getItem(this.list,this.weight);
            let listItem = ~~(Math.random() * this.kana[listGroup].length);
            level.push(this.kana[listGroup][listItem]);
        }
        return level;
    }

}

class ScoreDisplay {

    constructor(progressId, timerId, endScreenId) {
        this.score = document.getElementById(progressId);
        this.timer = document.getElementById(timerId);
        this.endScreen = document.getElementById(endScreenId);
        this.questionCount = 100;
        this._init();
    }

    _init() {
        this.startTime = 0;
        this.endTime = 0;
        this.timerStopped = true;
        this.progress = 0;
        this.endScreen.className = "";
    }

    incrementProgress() {
        this.progress++;
        this.injectProgress();
    }

    setQuestionCount(questionCount) {
        this.questionCount = questionCount;
        this.injectProgress();
    }

    startTimer() {
        if (this.startTime == 0) {
            this.timerStopped = false;
            this.startTime = new Date;
            requestAnimationFrame(this.updateTimer.bind(this));
        }
    }

    updateTimer() {
        if(!this.timerStopped){
            requestAnimationFrame(this.updateTimer.bind(this));
            this.injectTime();
        }
    }

    endTimer() {
        this.endTime = new Date;
        this.timerStopped = true;
        var finalTime = this.getSecondsElapsed(this.startTime, this.endTime);
        this.injectTimerEnd(finalTime);
    }

    getSecondsElapsed(start, end) {
        return (end - start) / 1000;
    }

    getProgress() {
        return this.progress + '/' + this.questionCount;
    }

    getGrade() {
        return this.time / this.answered;
    }

    reset() {
        this._init();
    }

    injectTime() {
        let time = this.getSecondsElapsed(this.startTime, new Date)
        this.timer.innerHTML = time.toFixed(1);
    }

    injectProgress() {
        this.score.innerHTML = this.getProgress();
    }

    injectTimerEnd(finalTime) {
        this.endScreen.className += "active";
        this.endScreen.childNodes[3].innerHTML = finalTime.toFixed(1);;
    }

}

class Random {

    static getBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    static getItem(list, weight) {
        let total_weight = weight.reduce((prev, cur, i, arr) => prev + cur);

        let random_num = this.getBetween(0, total_weight);
        let weight_sum = 0;

        for (let i = 0; i < list.length; i++) {
            weight_sum += weight[i];
            weight_sum = +weight_sum.toFixed(2);

            if (random_num <= weight_sum) {
                return list[i];
            }
        }
    }

}

var hiragana = {

    kana: [

        {あ: 'a'},
        {い: 'i'},
        {う: 'u'},
        {え: 'e'},
        {お: 'o'},
        {か: 'ka'},
        {き: 'ki'},
        {く: 'ku'},
        {け: 'ke'},
        {こ: 'ko'},
        {さ: 'sa'},
        {す: 'su'},
        {せ: 'se'},
        {そ: 'so'},
        {し: 'shi'},
        {た: 'ta'},
        {ち: 'chi'},
        {つ: 'tsu'},
        {て: 'te'},
        {と: 'to'},
        {な: 'na'},
        {に: 'ni'},
        {ぬ: 'nu'},
        {ね: 'ne'},
        {の: 'no'},
        {は: 'ha'},
        {ひ: 'hi'},
        {ふ: 'fu'},
        {へ: 'he'},
        {ほ: 'ho'},
        {ま: 'ma'},
        {み: 'mi'},
        {む: 'mu'},
        {め: 'me'},
        {も: 'mo'},
        {や: 'ya'},
        {ゆ: 'yu'},
        {よ: 'yo'},
        {ら: 'ra'},
        {り: 'ri'},
        {る: 'ru'},
        {れ: 're'},
        {ろ: 'ro'},
        {わ: 'wa'},
        {を: 'wo'},
        {ん: 'n'},
    ],

    diacritics: [
        {ゔ: 'vu'},
        {が: 'ga'},
        {ぎ: 'gi'},
        {ぐ: 'gu'},
        {げ: 'ge'},
        {ご: 'go'},
        {ざ: 'za'},
        {ず: 'zu'},
        {ぜ: 'ze'},
        {ぞ: 'zo'},
        {じ: 'ji'},
        {だ: 'da'},
        {ぢ: 'di'},
        {づ: 'du'},
        {で: 'de'},
        {ど: 'do'},
        {ば: 'ba'},
        {び: 'bi'},
        {ぶ: 'bu'},
        {べ: 'be'},
        {ぼ: 'bo'},
        {ぱ: 'pa'},
        {ぴ: 'pi'},
        {ぷ: 'pu'},
        {ぺ: 'pe'},
        {ぽ: 'po'}
    ],

    digraphs: [
        {ゔぁ: 'va'},
        {ゔぃ: 'vi'},
        {ゔぇ: 've'},
        {ゔぉ: 'vo'},
        {きゃ: 'kya'},
        {きぃ: 'kyi'},
        {きゅ: 'kyu'},
        {ぎゃ: 'gya'},
        {ぎぃ: 'gyi'},
        {ぎゅ: 'gyu'},
        {ぎぇ: 'gye'},
        {ぎょ: 'gyo'},
        {しゃ: 'sha'},
        {しゅ: 'shu'},
        {しょ: 'sho'},
        {じゃ: 'ja'},
        {じゅ: 'ju'},
        {じょ: 'jo'},
        {ちゃ: 'cha'},
        {ちゅ: 'chu'},
        {ちょ: 'cho'},
        {にゃ: 'nya'},
        {にゅ: 'nyu'},
        {にょ: 'nyo'},
        {ひゃ: 'hya'},
        {ひゅ: 'hyu'},
        {ひょ: 'hyo'},
        {びゃ: 'bya'},
        {びゅ: 'byu'},
        {びょ: 'byo'},
        {ぴゃ: 'pya'},
        {ぴゅ: 'pyu'},
        {ぴょ: 'pyo'},
        {ふぁ: 'fa'},
        {ふぃ: 'fi'},
        {ふぇ: 'fe'},
        {ふぉ: 'fo'},
        {みゃ: 'mya'},
        {みゅ: 'myu'},
        {みょ: 'myo'},
        {りゃ: 'rya'},
        {りゅ: 'ryu'},
        {りょ: 'ryo'},
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
    ],

    obsolete: [
        {ゐ: 'wi'},
        {ゑ: 'we'}
    ]

};

var game = new Game;