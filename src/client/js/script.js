document.addEventListener("alpine:init", () => {
    Alpine.store("started", false);
});

//creates conection to server url
const SERVER_URL = "http://140.184.230.209:40608";

const globalData = {
    // attributes
    atMenu: true,
    gameStarted: false,
    currentWord: "test",
    opts: [
        "https://placehold.co/600x400/000000/FFFFFF/png",
        "https://placehold.co/200x400/000000/FFFFFF/png",
        "https://placehold.co/400x400/000000/FFFFFF/png",
    ],
    desc: {
        1: "one",
        2: "two",
        3: "three",
    },
    wordList: [],
    imageList: [],
    audioList: [],
    // variable that calls getWordBank
    // function
    playAudio(url) {
        new Audio(url).play();
    },
    startGame() {
        this.gameStarted = true;
    },
    endGame() {
        this.gameStarted = false;
    },
};

// function to get word bank from server
async function getWordBank() {
    const response = await fetch(`${SERVER_URL}/getWordBank`);
    const data = await response.json();
    return data;
}
// console.log(getWordBank());