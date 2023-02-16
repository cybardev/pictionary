/**
 * Purpose:This file contains all js functions required to record user
 *         voices.
 *
 * Author: Tarron Thompson
 */

//Constants for each div on the page
var btnStart = document.querySelector('button[name="start"]');
var btnStop = document.querySelector('button[name="stop"]');
var audio = document.querySelector("#audio");
var mcqScreen = document.getElementById("MCQ");

/**
 * Purpose: Adds an event listener when start recording button is clicked to record
 *          player audio.
 *
 *
 * Author: Tarron Thompson
 */
btnStart.addEventListener("click", async () => {
    //Gets permission to use microphone
    let recording = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
    });

    //Creates a new mediarecorder object from said object in Javascript
    let mediaRecorder = new MediaRecorder(recording);
    mediaRecorder.start();

    //Returns the chunk for media recording
    let chunks = [];
    mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
    };

    //function to catch error
    mediaRecorder.onerror = (e) => {
        alert(e.error);
    };

    //function to save recording
    mediaRecorder.onstop = (e) => {
        var saved = new Blob(chunks);

        //create url for audio
        var url = URL.createObjectURL(saved);

        //passes url into audio tag
        audio.src = url;
    };

    //function to stop recording
    btnStop.addEventListener("click", () => {
        mediaRecorder.stop();
    });
});

/**
 * Purpose: Swaps start recording button to stop recording
 *
 * Author: Tarron Thompson
 */
function hideRec() {
    document.getElementById("startRec").style.display = "none";
    document.getElementById("stopRec").style.display = "inline-block";
}

/**
 * Purpose: Swaps stop recording button to start recording
 *
 * Author: Tarron Thompson
 */
function hideStop() {
    document.getElementById("stopRec").style.display = "none";
    document.getElementById("startRec").style.display = "inline-block";
}
