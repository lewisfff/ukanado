'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var Game = function () {
    function Game() {
        var _this = this;

        classCallCheck(this, Game);

        window.addEventListener('keypress', function (e) {
            return _this._handleInputChar(e.key);
        });
        this.practise = 0;
        this.inputBuffer = "";
        this.stack = new Stack('stack');
        this.score = new ScoreDisplay('progress', 'timer', 'end-screen');
        this.score.setQuestionCount(20);
        this.currentLevel = new Level(this.score.questionCount);
        this._displayQuestions();
    }

    createClass(Game, [{
        key: '_handleInputChar',
        value: function _handleInputChar(char) {
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
    }, {
        key: '_answeredCorrectly',
        value: function _answeredCorrectly() {
            if (this.inputBuffer == this.getCurrentAnswer()) {
                return true;
            }
            return false;
        }
    }, {
        key: '_displayQuestions',
        value: function _displayQuestions() {
            var questions = [];
            var levelData = this.currentLevel.data;
            for (var i = 0; i < levelData.length; i++) {
                questions.push(Object.keys(levelData[i])[0]);
            }

            this.stack.inject(questions);
        }
    }, {
        key: 'clearCurrentQuiz',
        value: function clearCurrentQuiz() {
            this.inputBuffer = "";
            this.currentLevel.data.shift();
            this.stack.shift();
            this.score.incrementProgress();

            if (this.currentLevel.data.length == 0) {
                this.score.endTimer();
            }
        }
    }, {
        key: 'getCurrentQuestion',
        value: function getCurrentQuestion() {
            return Object.keys(this.currentLevel.data[0])[0];
        }
    }, {
        key: 'getCurrentAnswer',
        value: function getCurrentAnswer() {
            return Object.values(game.currentLevel.data[0])[0];
        }
    }]);
    return Game;
}();

var Stack = function () {
    function Stack(stackId) {
        classCallCheck(this, Stack);

        this.stack = document.getElementById(stackId);
    }

    createClass(Stack, [{
        key: '_getHTML',
        value: function _getHTML() {
            return this.stack.innerHTML;
        }
    }, {
        key: '_setHTML',
        value: function _setHTML(str) {
            this.stack.innerHTML = str;
        }
    }, {
        key: 'shift',
        value: function shift() {
            this.stack.childNodes[0].className += "slide";
            setTimeout(function () {
                this.stack.removeChild(this.stack.childNodes[0]);
            }, 300);
        }
    }, {
        key: 'inject',
        value: function inject(array) {
            var html = "";
            for (var i = 0; i < array.length; i++) {
                html += "<div>" + array[i] + "</div>";
            }

            this._setHTML(html);
        }
    }]);
    return Stack;
}();

var Level = function () {
    function Level(questionCount) {
        classCallCheck(this, Level);

        this.weight = [0.75, 0.2, 0.049, 0.001];
        this.kana = hiragana;
        this.list = Object.getOwnPropertyNames(this.kana);
        this.data = this.generateLevel(questionCount);
    }

    createClass(Level, [{
        key: 'generateLevel',
        value: function generateLevel(questionCount) {
            var level = [];
            var katakana = this.kana;
            var hira_start = 0x3041;
            var kata_start = 0x30A1;

            for (var i in katakana) {
                for (var prop in katakana[i]) {
                    var hiraString = Object.keys(katakana[i][prop])[0];
                    var hiraAnswer = Object.values(katakana[i][prop])[0];
                    var kataString = "";

                    for (var ch = 0; ch < hiraString.length; ch++) {
                        var keyCode = hiraString[ch].charCodeAt(0);
                        keyCode += kata_start - hira_start;
                        var keyChar = String.fromCharCode(keyCode);
                        kataString += keyChar;
                    }
                    this.kana[i].push(defineProperty({}, kataString, hiraAnswer));
                }
            }

            for (var _i = 0; _i < questionCount; _i++) {
                var listGroup = Random.getItem(this.list, this.weight);
                var listItem = ~~(Math.random() * this.kana[listGroup].length);
                level.push(this.kana[listGroup][listItem]);
            }
            return level;
        }
    }]);
    return Level;
}();

var ScoreDisplay = function () {
    function ScoreDisplay(progressId, timerId, endScreenId) {
        classCallCheck(this, ScoreDisplay);

        this.score = document.getElementById(progressId);
        this.timer = document.getElementById(timerId);
        this.endScreen = document.getElementById(endScreenId);
        this.questionCount = 100;
        this._init();
    }

    createClass(ScoreDisplay, [{
        key: '_init',
        value: function _init() {
            this.startTime = 0;
            this.endTime = 0;
            this.timerStopped = true;
            this.progress = 0;
            this.endScreen.className = "";
        }
    }, {
        key: 'incrementProgress',
        value: function incrementProgress() {
            this.progress++;
            this.injectProgress();
        }
    }, {
        key: 'setQuestionCount',
        value: function setQuestionCount(questionCount) {
            this.questionCount = questionCount;
            this.injectProgress();
        }
    }, {
        key: 'startTimer',
        value: function startTimer() {
            if (this.startTime == 0) {
                this.timerStopped = false;
                this.startTime = new Date();
                requestAnimationFrame(this.updateTimer.bind(this));
            }
        }
    }, {
        key: 'updateTimer',
        value: function updateTimer() {
            if (!this.timerStopped) {
                requestAnimationFrame(this.updateTimer.bind(this));
                this.injectTime();
            }
        }
    }, {
        key: 'endTimer',
        value: function endTimer() {
            this.endTime = new Date();
            this.timerStopped = true;
            var finalTime = this.getSecondsElapsed(this.startTime, this.endTime);
            this.injectTimerEnd(finalTime);
        }
    }, {
        key: 'getSecondsElapsed',
        value: function getSecondsElapsed(start, end) {
            return (end - start) / 1000;
        }
    }, {
        key: 'getProgress',
        value: function getProgress() {
            return this.progress + '/' + this.questionCount;
        }
    }, {
        key: 'getGrade',
        value: function getGrade() {
            return this.time / this.answered;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this._init();
        }
    }, {
        key: 'injectTime',
        value: function injectTime() {
            var time = this.getSecondsElapsed(this.startTime, new Date());
            this.timer.innerHTML = time.toFixed(1);
        }
    }, {
        key: 'injectProgress',
        value: function injectProgress() {
            this.score.innerHTML = this.getProgress();
        }
    }, {
        key: 'injectTimerEnd',
        value: function injectTimerEnd(finalTime) {
            this.endScreen.className += "active";
            this.endScreen.childNodes[3].innerHTML = finalTime.toFixed(1);
        }
    }]);
    return ScoreDisplay;
}();

var Random = function () {
    function Random() {
        classCallCheck(this, Random);
    }

    createClass(Random, null, [{
        key: 'getBetween',
        value: function getBetween(min, max) {
            return Math.random() * (max - min) + min;
        }
    }, {
        key: 'getItem',
        value: function getItem(list, weight) {
            var total_weight = weight.reduce(function (prev, cur, i, arr) {
                return prev + cur;
            });

            var random_num = this.getBetween(0, total_weight);
            var weight_sum = 0;

            for (var i = 0; i < list.length; i++) {
                weight_sum += weight[i];
                weight_sum = +weight_sum.toFixed(2);

                if (random_num <= weight_sum) {
                    return list[i];
                }
            }
        }
    }]);
    return Random;
}();

var hiragana = {

    kana: [{ あ: 'a' }, { い: 'i' }, { う: 'u' }, { え: 'e' }, { お: 'o' }, { か: 'ka' }, { き: 'ki' }, { く: 'ku' }, { け: 'ke' }, { こ: 'ko' }, { さ: 'sa' }, { す: 'su' }, { せ: 'se' }, { そ: 'so' }, { し: 'shi' }, { た: 'ta' }, { ち: 'chi' }, { つ: 'tsu' }, { て: 'te' }, { と: 'to' }, { な: 'na' }, { に: 'ni' }, { ぬ: 'nu' }, { ね: 'ne' }, { の: 'no' }, { は: 'ha' }, { ひ: 'hi' }, { ふ: 'fu' }, { へ: 'he' }, { ほ: 'ho' }, { ま: 'ma' }, { み: 'mi' }, { む: 'mu' }, { め: 'me' }, { も: 'mo' }, { や: 'ya' }, { ゆ: 'yu' }, { よ: 'yo' }, { ら: 'ra' }, { り: 'ri' }, { る: 'ru' }, { れ: 're' }, { ろ: 'ro' }, { わ: 'wa' }, { を: 'wo' }, { ん: 'n' }],

    diacritics: [{ ゔ: 'vu' }, { が: 'ga' }, { ぎ: 'gi' }, { ぐ: 'gu' }, { げ: 'ge' }, { ご: 'go' }, { ざ: 'za' }, { ず: 'zu' }, { ぜ: 'ze' }, { ぞ: 'zo' }, { じ: 'ji' }, { だ: 'da' }, { ぢ: 'di' }, { づ: 'du' }, { で: 'de' }, { ど: 'do' }, { ば: 'ba' }, { び: 'bi' }, { ぶ: 'bu' }, { べ: 'be' }, { ぼ: 'bo' }, { ぱ: 'pa' }, { ぴ: 'pi' }, { ぷ: 'pu' }, { ぺ: 'pe' }, { ぽ: 'po' }],

    digraphs: [{ ゔぁ: 'va' }, { ゔぃ: 'vi' }, { ゔぇ: 've' }, { ゔぉ: 'vo' }, { きゃ: 'kya' }, { きぃ: 'kyi' }, { きゅ: 'kyu' }, { ぎゃ: 'gya' }, { ぎぃ: 'gyi' }, { ぎゅ: 'gyu' }, { ぎぇ: 'gye' }, { ぎょ: 'gyo' }, { しゃ: 'sha' }, { しゅ: 'shu' }, { しょ: 'sho' }, { じゃ: 'ja' }, { じゅ: 'ju' }, { じょ: 'jo' }, { ちゃ: 'cha' }, { ちゅ: 'chu' }, { ちょ: 'cho' }, { にゃ: 'nya' }, { にゅ: 'nyu' }, { にょ: 'nyo' }, { ひゃ: 'hya' }, { ひゅ: 'hyu' }, { ひょ: 'hyo' }, { びゃ: 'bya' }, { びゅ: 'byu' }, { びょ: 'byo' }, { ぴゃ: 'pya' }, { ぴゅ: 'pyu' }, { ぴょ: 'pyo' }, { ふぁ: 'fa' }, { ふぃ: 'fi' }, { ふぇ: 'fe' }, { ふぉ: 'fo' }, { みゃ: 'mya' }, { みゅ: 'myu' }, { みょ: 'myo' }, { りゃ: 'rya' }, { りゅ: 'ryu' }, { りょ: 'ryo' }, { きぇ: 'kye' }, { きょ: 'kyo' }, { じぃ: 'jyi' }, { じぇ: 'jye' }, { ちぃ: 'cyi' }, { ちぇ: 'che' }, { ひぃ: 'hyi' }, { ひぇ: 'hye' }, { びぃ: 'byi' }, { びぇ: 'bye' }, { ぴぃ: 'pyi' }, { ぴぇ: 'pye' }, { みぇ: 'mye' }, { みぃ: 'myi' }, { りぃ: 'ryi' }, { りぇ: 'rye' }, { にぃ: 'nyi' }, { にぇ: 'nye' }, { しぃ: 'syi' }, { しぇ: 'she' }, { いぇ: 'ye' }, { うぁ: 'wha' }, { うぉ: 'who' }, { うぃ: 'wi' }, { うぇ: 'we' }, { ゔゃ: 'vya' }, { ゔゅ: 'vyu' }, { ゔょ: 'vyo' }, { すぁ: 'swa' }, { すぃ: 'swi' }, { すぅ: 'swu' }, { すぇ: 'swe' }, { すぉ: 'swo' }, { くゃ: 'qya' }, { くゅ: 'qyu' }, { くょ: 'qyo' }, { くぁ: 'qwa' }, { くぃ: 'qwi' }, { くぅ: 'qwu' }, { くぇ: 'qwe' }, { くぉ: 'qwo' }, { ぐぁ: 'gwa' }, { ぐぃ: 'gwi' }, { ぐぅ: 'gwu' }, { ぐぇ: 'gwe' }, { ぐぉ: 'gwo' }, { つぁ: 'tsa' }, { つぃ: 'tsi' }, { つぇ: 'tse' }, { つぉ: 'tso' }, { てゃ: 'tha' }, { てぃ: 'thi' }, { てゅ: 'thu' }, { てぇ: 'the' }, { てょ: 'tho' }, { とぁ: 'twa' }, { とぃ: 'twi' }, { とぅ: 'twu' }, { とぇ: 'twe' }, { とぉ: 'two' }, { ぢゃ: 'dya' }, { ぢぃ: 'dyi' }, { ぢゅ: 'dyu' }, { ぢぇ: 'dye' }, { ぢょ: 'dyo' }, { でゃ: 'dha' }, { でぃ: 'dhi' }, { でゅ: 'dhu' }, { でぇ: 'dhe' }, { でょ: 'dho' }, { どぁ: 'dwa' }, { どぃ: 'dwi' }, { どぅ: 'dwu' }, { どぇ: 'dwe' }, { どぉ: 'dwo' }, { ふぅ: 'fwu' }, { ふゃ: 'fya' }, { ふゅ: 'fyu' }, { ふょ: 'fyo' }],

    obsolete: [{ ゐ: 'wi' }, { ゑ: 'we' }]

};

var game = new Game();
