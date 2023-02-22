/**
 * This file contains all required functions to load images, vocab, and audios from
 * the server. As well as al functions required for gameplay.
 *
 * Author:  Sarah Derby - Get from Server functions
 *          Sherlin Shibi - MCQ gameplay
 *          Sainabou Demba - T/F gameplay
 */

//creates conection to server url
const SERVER_URL = "https://140.184.230.209:40608";

//all global variables
var lastCorrect,
    currCorrect,
    optionOne,
    optionTwo,
    trueOrFalse,
    audios,
    images,
    words,
    correctPlacement,
    questionsAnswered = 0,
    mcq = true,
    tf = !mcq;

/**
 * Start game functions. Makes start screen invisible and gameplay visible
 * Author: Sainabou Demba
 *         Sherlin Shibi
 *         Sarah Derby - added reload
 */
function enterGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("game").style.display = "inline-block";
    document.getElementById("dedicated").style.display = "none";

    reload();
}

/**
 * Quits gameplay by making gameplay elements invisible and homepage elements
 * visible
 *
 * Author: Sainabou Demba
 *         Sherlin Shibi
 */
function quitGame() {
    document.getElementById("startScreen").style.display = "inline-block";
    document.getElementById("game").style.display = "none";
    document.getElementById("dedicated").style.display = "inline-block";
}
/**
 * Reloads wordbank from pulling files from server. This function is called when game is started
 * Is called on body load
 *
 * Author Sarah Derby
 */
function reload() {
    //sets questions answered to 0
    questionsAnswered = 0;

    //sets gameplay type depending on which is required to be visible
    if (mcq === true) {
        document.getElementById("MCQ").style.display = "inline-block";
        document.getElementById("TF").style.display = "none";
    } else {
        document.getElementById("MCQ").style.display = "none";
        document.getElementById("TF").style.display = "inline-block";
    }
    pullFromServer();
    refresh();
}

/**
 * Creates an index of the current correct response randomly, cannot
 * be the same as previous questions correct respose
 *
 * Author Sarah Derby
 *
 * @returns index in word bank of correct response for current question
 */
function correctResponse() {
    var index = getRandomInt(words.length);
    while (lastCorrect != null && lastCorrect == index) {
        index = getRandomInt(words.length);
    }
    return index;
}

/**
 * Gets a random number from 0-max
 *
 * Author Sarah Derby
 *
 * @param max the max number allowed to be picked randomly 0-max
 * @returns a random int from 0-max
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Displays vocab word of correct answer
 *
 * Author:  Sarah Derby
 *          Sainabou Demba
 *
 */
function displayWord() {
    if (mcq) {
        $("#word").html(words[currCorrect]);
    } else {
        $("#questionText").html(words[currCorrect]);
    }
}

/**
 * Displays images of correct answer and two other random options in mcq game
 * Displays image for t/f game depending on whether answer was chosen as true or not
 *
 * Author:  Sarah Derby - base code for early testing of pulling from server
 *          Sherlin Shibi - added to make it work for MCQ gameplay
 *          Sainabou Demba - edited to also call for T/F gameplay
 */
function displayImage() {
    if (mcq) {
        if (correctPlacement === 0) {
            $("#image1").html(
                '<input class="button" type="image" src=' +
                    images[currCorrect] +
                    ' width="200" height="200" onclick="choose(0)" wtx-context="3C118555-5166-45EB-9F78-2014808CE8D2">'
            );
            $("#image2").html(
                '<input class="button" type="image" src=' +
                    images[optionOne] +
                    ' width="200" height="200" onclick="choose(1)" wtx-context="3C118555-5166-45EB-9F78-2014808CE8D2">'
            );
            $("#image3").html(
                '<input class="button" type="image" src=' +
                    images[optionTwo] +
                    ' width="200" height="200" onclick="choose(2)" wtx-context="3C118555-5166-45EB-9F78-2014808CE8D2">'
            );
        } else if (correctPlacement === 1) {
            $("#image1").html(
                '<input class="button" type="image" src=' +
                    images[optionOne] +
                    ' width="200" height="200" onclick="choose(0)" wtx-context="3C118555-5166-45EB-9F78-2014808CE8D2">'
            );
            $("#image2").html(
                '<input class="button" type="image" src=' +
                    images[currCorrect] +
                    ' width="200" height="200" onclick="choose(1)" wtx-context="3C118555-5166-45EB-9F78-2014808CE8D2">'
            );
            $("#image3").html(
                '<input class="button" type="image" src=' +
                    images[optionTwo] +
                    ' width="200" height="200" onclick="choose(2)" wtx-context="3C118555-5166-45EB-9F78-2014808CE8D2">'
            );
        } else {
            $("#image1").html(
                '<input class="button" type="image" src=' +
                    images[optionOne] +
                    ' width="200" height="200" onclick="choose(0)" wtx-context="3C118555-5166-45EB-9F78-2014808CE8D2">'
            );
            $("#image2").html(
                '<input class="button" type="image" src=' +
                    images[optionTwo] +
                    ' width="200" height="200" onclick="choose(1)" wtx-context="3C118555-5166-45EB-9F78-2014808CE8D2">'
            );
            $("#image3").html(
                '<input class="button" type="image" src=' +
                    images[currCorrect] +
                    ' width="200" height="200" onclick="choose(2)" wtx-context="3C118555-5166-45EB-9F78-2014808CE8D2">'
            );
        }
    } else {
        if (trueOrFalse) {
            $("#questionImage").html(
                '<input class="button" id="tfImage" type="image" src=' +
                    images[currCorrect] +
                    ">"
            );
        } else {
            $("#questionImage").html(
                '<input class="button" id="tfImage"  type="image" src=' +
                    images[optionOne] +
                    ">"
            );
        }
    }
}

/**
 * Chooses two other random options for images. New options cannot be the same
 * as correct response or the same as each other.
 *
 * Author Sarah Derby
 */
function getOtherOptions() {
    optionOne = getRandomInt(words.length);

    //option 1 cannot equal correct answer
    while (optionOne == currCorrect) {
        optionOne = getRandomInt(words.length);
    }

    //option 2 cannot equal correct answer or option 1
    optionTwo = getRandomInt(words.length);
    while (optionTwo == currCorrect || optionTwo == optionOne) {
        optionTwo = getRandomInt(words.length);
    }
}

/**
 * Plays audio when play audio button is clicked
 *
 * Author: Terry Goldsmith
 */
function playAudio() {
    let voice = new Audio(audios[currCorrect]);
    voice.play();
}

/**
 * Pulls audios, images, and vocab from server and executes a callback
 *
 * Author: Sarah Derby
 */
function pullFromServer() {
    $.get(SERVER_URL + "/getWordBank", getBank).fail(errorCallback);
}

/**
 * Takes returned data and adds to global variables for easy usage.
 * Game is started after images are uploaded.
 *
 * Author: Sarah Derby
 *
 * @param {Object} returnedData an object containing vocab, images, and audios
 * stored in the server
 */
function getBank(returnedData) {
    words = Array.from(returnedData.vocab);
    images = Array.from(returnedData.images);
    audios = Array.from(returnedData.audios);

    startGame();
}

/**
 * A callback function in case an error occurs when calling from server
 *
 * Author: Sarah Derby
 *
 * @param err error that is occuring
 */
function errorCallback(err) {
    console.log(err.responseText);
}

/**
 * All in game functions
 *
 * Author:  Sarah Derby - Base code for early testing of server operations
 *          Sherlin Shibi - MCQ gameplay
 *          Sainabou Demba - T/F gameplay
 */
function startGame() {
    if (questionsAnswered < 10) {
        if (mcq) {
            document.getElementById("MCQ").style.display = "inline-block";
            document.getElementById("TF").style.display = "none";
            currCorrect = correctResponse();
            lastCorrect = currCorrect;
            correctPlacement = getRandomInt(3);
            getOtherOptions();
            displayWord();
            displayImage();
            refresh();
        } else {
            document.getElementById("MCQ").style.display = "none";
            document.getElementById("TF").style.display = "inline-block";
            trueOrFalse = generateBoolean();
            currCorrect = correctResponse();
            lastCorrect = currCorrect;
            getOtherOptions();
            displayWord();
            displayImage();
            refresh();
        }
    } else {
        Swal.fire("Kespu'tuwenek");
        quitGame();
    }
}

/**
 * Decides whether or not T/F round answer will be true or false
 *
 * Author: Sainabou Demba
 * @returns A boolean variable, 50/50 chance of it being true or false
 */
function generateBoolean() {
    if (getRandomInt(2) === 0) {
        return true;
    } else {
        return false;
    }
}
/**
 * Function to refresh the page so as to display the images. Fixes image display issue
 *
 * Author: Sarah Derby
 */
function refresh() {
    displayImage();
}

/**
 * Checks if answer choice is correct
 *
 * Author:  Sherlin Shibi
 *          Sainabou Demba - edited to work for T/F as well
 *
 * @param {*} choice
 */
function choose(choice) {
    if (mcq) {
        if (choice === correctPlacement) {
            Swal.fire("kelu'lk tela'tekn");
            questionsAnswered++;
            mcq = false;
            tf = true;
            startGame();
        } else {
            Swal.fire("tknu'kwalsi ap");
        }
    } else {
        if (choice === trueOrFalse) {
            questionsAnswered++;
            Swal.fire("kelu'lk tela'tekn");
            mcq = true;
            tf = false;
            startGame();
        } else {
            Swal.fire("tknu'kwalsi ap");
        }
    }
}

/**
 * This code opens and closes using an overlay or the x close button.
 * The wordbank modal has meaning of words being played by the sound
 *
 * Author: Sainabou Demba
 */
$("body").ready(() => {
    //CLOSES WORD BANK MODAL WHEN YOU CLICK ANYWHERE OUTISDE OF IT
    window.onclick = function (event) {
        if (event.target === wordBankModal) {
            document.getElementById("wordBankModal").style.display = "none";
        }
    };
});

/**
 * Fills wordbank from server.
 *
 * Author:  Sarah Derby
 *          Tarron Thompson - figured out the reason images weren't loading was a height error
 */
function fillWBank() {
    var answers = "";

    for (let i = 0; i < images.length; i++) {
        answers +=
            '<img id="wbank' +
            i +
            '"width="100" height="100" src=' +
            images[i] +
            ">" +
            words[i] +
            "<br></br>";
    }
    $("#answerKey").html(answers);
}
