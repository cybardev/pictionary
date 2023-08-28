/**
 * This checks the entered password to see if it is correct. If it is the upload feature is
 * unlocked, if not the user is informed of the incorrect code.
 *
 * Author: Ishani Kasaju
 *         Sheikh Saad Abdullah
 */

//creates conection to server url
const SERVER_URL = "https://140.184.230.209:40608";

// JQuery-like shorthand for referencing DOM objects
const $_ = (el) => document.querySelector(el);

/**
 * Logs out user when page is not visible
 *
 * Author: Sheikh Saad Abdullah
 */
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        navigator.sendBeacon(SERVER_URL + "/logoff");
    }
});

// data required for the admin page
const adminData = {
    showPass: false,
    async authenticate(username, passphrase) {
        await fetch(SERVER_URL + "/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                passphrase: passphrase,
            }),
        }).then((res) => {
            if (res.ok) {
                window.location.replace("../../../admin/editor.html");
            } else {
                Swal.fire(
                    "Incorrect username or passphrase.\nPlease try again."
                );
            }
        });
    },
};

// data required for the editor page
const editorData = {
    // properties
    currentWord: "",
    currentWordImage: "",
    currentWordAudio: "",
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

    // methods
    updateImagePreview(event) {
        this.currentWordImage = URL.createObjectURL(event.target.files[0]);
    },
    updateAudioPreview(event) {
        this.currentWordAudio = URL.createObjectURL(event.target.files[0]);
    },
    addNewWord(event) {
        this.wordList.push("newWord");
        this.currentWord = "newWord";
    },
    cancelChanges(event) {
        swal({
            title: "Cancel all changes to word?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willCancel) => {
            if (willCancel) {
                window.location.reload();
            }
        });
    },
    saveChanges(event) {
        swal({
            title: "Save all changes to word?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willSave) => {
            if (willSave) {
                let wordAudio = $_("#word-audio").files[0];
                let wordImage = $_("#word-image").files[0];

                // TODO: handle case when no new file is chosen

                this.currentWord = $_("h1").innerText;
                this.uploadFiles({
                    audioFile: new File(wordAudio, `${this.currentWord}.wav`, {
                        type: "audio/wav",
                    }),
                    imageFile: new File(wordImage, `${this.currentWord}.jpg`, {
                        type: "image/jpg",
                    }),
                });
            }
        });
    },
    deleteConfirm(word, index) {
        // double-check if user wants to remove word from list
        swal({
            title: `DELETE "${word}" from word list?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                swal({
                    title: `Are you SURE you want to DELETE "${word}" from word list?`,
                    icon: "error",
                    buttons: true,
                    dangerMode: true,
                }).then(async (willDelete) => {
                    if (willDelete) {
                        // delete 1 word from given index (currently selected)
                        let deletedWord = this.wordList.splice(index, 1)[0];
                        this.currentWord = this.wordList[0];
                        await fetch(SERVER_URL + "/delete", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ word: deletedWord }),
                        }).then((res) => {
                            if (res.ok) {
                                console.log("Word has been deleted.");
                            }
                        });
                    }
                });
            }
        });
    },
    uploadFiles(files) {
        // TODO: send files to server
    },
};
