document.addEventListener("alpine:init", () => {
    Alpine.store("started", false);
});

//creates conection to server url
const SERVER_URL = "http://127.0.0.1:48622";

// let wordList = new Array();
// let imageList = new Array();
// let audioList = new Array();

// const myRequest = new Request(`${SERVER_URL}/getWordBank`);

// fetch(myRequest)
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     return response.json();
//   })
//   .then((response) => {
//     const {vocab, images, audios} = response;
//     wordList = vocab;
//     imageList = images;
//     audioList = audios;
//     console.log(vocab);
//   });
// console.log(audioList);

const globalData = {
    // attributes
    atMenu: true,
    gameStarted: false,
    currentWord: "test",
    opts: [],
    wordList: [
        "aqq",
        "eliey",
        "kesalk",
        "ki'l",
        "l'tu",
        "mijisi",
        "ni'n",
        "teluisi",
        "wiktm",
    ],
    correctList: [],    
    // function
    playAudio(url) {
        new Audio(url).play();
    },
    startGame() {
        this.gameStarted = true;
        this.gameLoop();
    },
    endGame() {
        this.correctList = [];
        this.gameStarted = false;
    },
    getWordBank() {
        // const response = await fetch();
        // const {vocab} = await response.json();
        // vocab.forEach(word => {
        //     this.wordList.push(word);
        // });
        fetch(`${SERVER_URL}/getWordBank`)
            .then((res) => res.json())
            .then((data) => {
                this.wordList = [...data];
            })
            .catch((err) => console.log(err));
    },
    getRandomWord() {
        return this.wordList[Math.floor(Math.random() * this.wordList.length)];
    },
    resetCurrentWord() {
        let word = this.getRandomWord();
        while (this.correctList.includes(word)) {
            word = this.getRandomWord();
        }
        this.currentWord = word;
    },
    setGameChoice() {
        this.opts[0] = this.currentWord;

        let word = this.getRandomWord();
        for(let i = 1; i <= 2; i++){
            while(word == this.currentWord || word == this.opts[i-1]){
                word = this.getRandomWord();
            }
            this.opts[i] = word;
        }
        this.opts.sort(() => Math.random() - 0.5);
    },
    evaluateResponse(selection) {
        if(selection == this.currentWord){
            swal({
                title: "kelu'lk tela'tekn",
                icon: "success",
                button: "OK",
            });
            this.correctList.push(this.currentWord);
            console.log(this.correctList);
        } else {
            swal({
                title: "tknu'kwalsi ap",
                icon: "error",
                button: "Try Again",
            });
        }
        this.gameLoop();
    }
    ,
    gameLoop() {
        if (this.gameStarted && this.correctList.length != this.wordList.length) {
            this.resetCurrentWord();
            this.setGameChoice();
        } else {
            this.endGame();
        }
    },
};

document.querySelector("#start-page").addEventListener("load", (e) => {
    globalData.getWordBank();
});

//gameloop() while gameStarted is true & correctList != wordList
//getNewWord()
//
//
//setGameChoice(currentWord) populate opts list randomly, set correct index 1-3
//setGameTF(currentWord) choose word or random word, set correct index 1-2
//setGameSpeak(currentWord) set correct index to -1
//
//evaluateResponse() check correct index with clicked, congratz, update correct response list of wins
//