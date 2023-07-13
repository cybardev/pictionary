document.addEventListener("alpine:init", () => {
    Alpine.store("started", false);
});

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

    // functions
    startGame() {
        this.gameStarted = true;
    },
    endGame() {
        this.gameStarted = false;
    },
};
