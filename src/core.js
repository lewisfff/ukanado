'use strict';

class Game {
    constructor() {
        document.getElementById('start').addEventListener('click', () => this.start());
        this.settings = new Settings();
        document.getElementById('toggle-hiragana').addEventListener('change', (event) => {
            this.settings.setHiragana(event.target.checked);
        });
        document.getElementById('toggle-katakana').addEventListener('change', (event) => {
            this.settings.setKatakana(event.target.checked);
        });
        document.getElementById('toggle-common').addEventListener('change', (event) => {
            this.settings.setCommon(event.target.checked);
        });
        document.getElementById('toggle-digraphs').addEventListener('change', (event) => {
            this.settings.setDigraphs(event.target.checked);
        });
        document.getElementById('toggle-diacritics').addEventListener('change', (event) => {
            this.settings.setDiacritics(event.target.checked);
        });
    }

    start() {
        if (!this.settings.types.hiragana && !this.settings.types.katakana) {
            alert("Please select either Hiragana or Katakana.");
            return;
        }
        if (!this.settings.types.common && !this.settings.types.digraphs && !this.settings.types.diacritics) {
            alert("Please select either Common, Digraphs, or Diacritics.");
            return;
        }
        this.practice = 0;
        this.inputBuffer = "";
        this.stack = new Stack('stack');
        this.score = new ScoreDisplay('progress', 'timer', 'end-screen');
        this.score.setQuestionCount(20);
        this.currentLevel = new Level(this.score.questionCount, this.settings);
        this.displayQuestions();
        document.getElementById('settings').classList.add('hidden');
        window.addEventListener('keypress', (e) => this.handleInputChar(e));
    }
    
    handleInputChar = (e) => {
        this.inputBuffer += e.key;

        if (this.score.timerStopped) {
            if (this.score.endTime) {
                // TODO: handle this without reload
                location.reload();
            }
            this.score.startTimer();
        }

        if (this.inputBuffer.length > this.getCurrentAnswer()[0].length) {
            this.inputBuffer = this.inputBuffer.substring(1);
        }
        
        if (this.answeredCorrectly()) {
            this.clearCurrentQuiz();
        }
    };
    
    answeredCorrectly() {
        const currentAnswer = this.getCurrentAnswer();
        return currentAnswer.some((answer) => answer.endsWith(this.inputBuffer));
    }
    
    displayQuestions() {
        this.stack.inject(this.currentLevel.data);
    }
    
    clearCurrentQuiz() {
        this.inputBuffer = "";
        this.currentLevel.data.shift();
        this.stack.shift();
        this.score.incrementProgress();
        
        if (this.currentLevel.data.length === 0) {
            this.score.endTimer();
        }
    }
    
    getCurrentQuestion() {
        return Object.keys(this.currentLevel.data[0])[0];
    }
    
    getCurrentAnswer() {
        return Object.values(this.currentLevel.data[0])[0];
    }
}

class Settings {
    constructor() {
        this.types = {
            hiragana: true,
            katakana: true,
            common: true,
            digraphs: true,
            diacritics: true
        };
        this.resetCheckboxes();
    }

    resetCheckboxes() {
        Object.keys(this.types).forEach(type => {
            document.getElementById(`toggle-${type}`).checked = this.types[type];
        });
    }

    setHiragana(value) {
        this.types.hiragana = value;
    }
    
    setKatakana(value) {
        this.types.katakana = value;
    }
    
    setCommon(value) {
        this.types.common = value;
    }
    
    setDigraphs(value) {
        this.types.digraphs = value;
    }
    
    setDiacritics(value) {
        this.types.diacritics = value;
    }
}

class Stack {
    constructor(stackId) {
        this.stack = document.getElementById(stackId);
        this.training = false;
    }
    
    shift() {
        this.stack.firstChild.classList.add("slide");
        setTimeout(() => {
            this.stack.removeChild(this.stack.firstChild);
        }, 300);
    }
    
    inject(array) {
        const html = array.map((item) => this.itemToHtml(item)).join("");
        this.stack.innerHTML = html;
    }

    itemToHtml(item) {
        const key = Object.keys(item)[0];
        const value = Object.values(item)[0];
        const romajiAttribute = this.training ? `romaji="${value}"` : "";
        return `<div ${romajiAttribute}>${key}</div>`;
    }
}

class Level {
    constructor(questionCount, settings) {
        this.kana = JSON.parse(JSON.stringify(hiragana)); // create a deep copy of hiragana
        this.settings = settings;
        this.list = this.getListFromSettings();
        this.data = this.generateLevel(questionCount);
    }

    getListFromSettings() {
        let list = [];
        if (this.settings.types.common) list.push('common');
        if (this.settings.types.digraphs) list.push('digraphs');
        if (this.settings.types.diacritics) list.push('diacritics');
        return list;
    }
    
    generateLevel(questionCount) {
        const level = [];
        const hira_start = 0x3041;
        const kata_start = 0x30A1;

        // generate katakana from hiragana
        const katakana = JSON.parse(JSON.stringify(this.kana)); // create a deep copy
        for (let i in katakana) {
            for (let prop in katakana[i]) {
                const hiraString = Object.keys(katakana[i][prop])[0];
                const hiraAnswer = Object.values(katakana[i][prop])[0];
                let kataString = "";

                for (let ch = 0; ch < hiraString.length; ch++) {
                    let keyCode = hiraString[ch].charCodeAt(0);
                    keyCode += kata_start - hira_start;
                    const keyChar = String.fromCharCode(keyCode);
                    kataString += keyChar;
                }

                katakana[i][prop] = { [kataString]: hiraAnswer };
            }
        }

        // prepare the set of questions based on settings
        let questionSet = {};
        if (this.settings.types.hiragana) {
            for (let key in this.kana) {
                if (!questionSet[key]) questionSet[key] = [];
                questionSet[key] = questionSet[key].concat(this.kana[key]);
            }
        }
        if (this.settings.types.katakana) {
            for (let key in katakana) {
                if (!questionSet[key]) questionSet[key] = [];
                questionSet[key] = questionSet[key].concat(katakana[key]);
            }
        }
    
        for (let i = 0; i < questionCount; i++) {
            const listGroup = Random.getItem(this.list);
            const listItem = Math.floor(Math.random() * questionSet[listGroup].length);
            level.push(questionSet[listGroup][listItem]);
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
        this.init();
    }
    
    init() {
        this.startTime = 0;
        this.endTime = 0;
        this.timerStopped = true;
        this.progress = 0;
        this.endScreen.classList.remove("active");
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
        if (this.startTime === 0) {
            this.timerStopped = false;
            this.startTime = new Date();
            requestAnimationFrame(this.updateTimer);
        }
    }
    
    updateTimer = () => {
        if (!this.timerStopped) {
            requestAnimationFrame(this.updateTimer);
            this.injectTime();
        }
    };
    
    endTimer() {
        this.endTime = new Date();
        this.timerStopped = true;
        const finalTime = this.getSecondsElapsed(this.startTime, this.endTime);
        this.injectTimerEnd(finalTime);
    }
    
    getSecondsElapsed(start, end) {
        return (end - start) / 1000;
    }
    
    getProgress() {
        return `${this.progress}/${this.questionCount}`;
    }
    
    getGrade() {
        return this.time / this.answered;
    }
    
    reset() {
        this.init();
    }
    
    injectTime() {
        const time = this.getSecondsElapsed(this.startTime, new Date());
        this.timer.innerHTML = time.toFixed(1);
    }
    
    injectProgress() {
        this.score.innerHTML = this.getProgress();
    }
    
    injectTimerEnd(finalTime) {
        this.endScreen.classList.add("active");
        this.endScreen.childNodes[3].innerHTML = finalTime.toFixed(1);
    }
}

class Random {
    static getBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    static getItem(list) {
        return list[Math.floor(Math.random() * list.length)];
    }
}

const hiragana = {
    common: [
        { あ: ['a'] },
        { い: ['i'] },
        { う: ['u'] },
        { え: ['e'] },
        { お: ['o'] },
        { か: ['ka'] },
        { き: ['ki'] },
        { く: ['ku'] },
        { け: ['ke'] },
        { こ: ['ko'] },
        { さ: ['sa'] },
        { し: ['shi', 'si'] },
        { す: ['su'] },
        { せ: ['se'] },
        { そ: ['so'] },
        { た: ['ta'] },
        { ち: ['chi', 'ti'] },
        { つ: ['tsu'] },
        { て: ['te'] },
        { と: ['to'] },
        { な: ['na'] },
        { に: ['ni'] },
        { ぬ: ['nu'] },
        { ね: ['ne'] },
        { の: ['no'] },
        { は: ['ha'] },
        { ひ: ['hi'] },
        { ふ: ['fu', 'hu'] },
        { へ: ['he'] },
        { ほ: ['ho'] },
        { ま: ['ma'] },
        { み: ['mi'] },
        { む: ['mu'] },
        { め: ['me'] },
        { も: ['mo'] },
        { や: ['ya'] },
        { ゆ: ['yu'] },
        { よ: ['yo'] },
        { ら: ['ra'] },
        { り: ['ri'] },
        { る: ['ru'] },
        { れ: ['re'] },
        { ろ: ['ro'] },
        { わ: ['wa'] },
        { を: ['wo'] },
        { ん: ['n'] },
    ],
    digraphs: [
        { きゃ: ['kya'] },
        { きゅ: ['kyu'] },
        { きょ: ['kyo'] },
        { しゃ: ['sha'] },
        { しゅ: ['shu'] },
        { しょ: ['sho'] },
        { ちゃ: ['cha'] },
        { ちゅ: ['chu'] },
        { ちょ: ['cho'] },
        { にゃ: ['nya'] },
        { にゅ: ['nyu'] },
        { にょ: ['nyo'] },
        { ひゃ: ['hya'] },
        { ひゅ: ['hyu'] },
        { ひょ: ['hyo'] },
        { みゃ: ['mya'] },
        { みゅ: ['myu'] },
        { みょ: ['myo'] },
        { りゃ: ['rya'] },
        { りゅ: ['ryu'] },
        { りょ: ['ryo'] },
        { ぎゃ: ['gya'] },
        { ぎゅ: ['gyu'] },
        { ぎょ: ['gyo'] },
        { じゃ: ['ja', 'jya'] },
        { じゅ: ['ju', 'jyu'] },
        { じょ: ['jo', 'jyo'] },
        { びゃ: ['bya'] },
        { びゅ: ['byu'] },
        { びょ: ['byo'] },
        { ぴゃ: ['pya'] },
        { ぴゅ: ['pyu'] },
        { ぴょ: ['pyo'] },
    ],
    diacritics: [
        { が: ['ga'] },
        { ぎ: ['gi'] },
        { ぐ: ['gu'] },
        { げ: ['ge'] },
        { ご: ['go'] },
        { ざ: ['za'] },
        { じ: ['ji'] },
        { ず: ['zu'] },
        { ぜ: ['ze'] },
        { ぞ: ['zo'] },
        { だ: ['da'] },
        { ぢ: ['ji', 'di'] },
        { づ: ['zu', 'du'] },
        { で: ['de'] },
        { ど: ['do'] },
        { ば: ['ba'] },
        { び: ['bi'] },
        { ぶ: ['bu'] },
        { べ: ['be'] },
        { ぼ: ['bo'] },
        { ぱ: ['pa'] },
        { ぴ: ['pi'] },
        { ぷ: ['pu'] },
        { ぺ: ['pe'] },
        { ぽ: ['po'] },
    ],
};

const game = new Game();
