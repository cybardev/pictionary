document.addEventListener("alpine:init", () => {
    Alpine.store("started", false);
});

const globalData = {
    // attributes
    atMenu: true,
    gameStarted: false,
    currentWord: "test",
    opts: ["1", "2", "3"],
    desc: {
        1: "one",
        2: "two",
        3: "three",
    },

    // functions
    startGame() {
        this.gameStarted = true;
    },
    endGame() {
        this.gameStarted = false;
    },
};
