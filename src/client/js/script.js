document.addEventListener("alpine:init", () => {
    Alpine.store("started", false);
});

//creates conection to server url
const SERVER_URL = "http://127.0.0.1:40608";

const globalData = {

    // attributes

    atMenu: true,
    gameStarted: false,
    currentWord: "",
    opts: [],
    wordList: [],
    correctList: [],    

    // function

    /**
     * 
     * @param {*} url 
     */
    playAudio(url) {
        new Audio(url).play();
    },
    /**
     * 
     */
    startGame() {
        this.gameStarted = true;
        this.gameLoop();
    },
    /**
     * 
     */
    endGame() {
        this.correctList = [];
        this.gameStarted = false;
    },
    /**
     * 
     */
    getWordBank() {
        $.get(SERVER_URL + "/wordlist", (res) => {
            this.wordList = res.wordList;
        }).fail((err) => {
            console.log(err);
        }); 
    },
    /**
     * 
     * @returns 
     */
    getRandomWord() {
        return this.wordList[Math.floor(Math.random() * this.wordList.length)];
    },
    /**
     * 
     */
    resetCurrentWord() {
        let word = this.getRandomWord();
        while (this.correctList.includes(word)) {
            word = this.getRandomWord();
        }
        this.currentWord = word;
    },
    /**
     * 
     */
    setGameMultiChoice() {
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
    /**
     * 
     */
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
    },
    /**
     * 
     */
    gameLoop() {
        if (this.gameStarted && this.correctList.length != this.wordList.length) {
            this.resetCurrentWord();
            this.setGameMultiChoice();
        } else {
            this.endGame();
        }
    },
};
