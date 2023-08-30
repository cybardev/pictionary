/**
 * This checks the entered password to see if it is correct. If it is the upload feature is
 * unlocked, if not the user is informed of the incorrect code.
 *
 * Author: Ishani Kasaju
 *         Sheikh Saad Abdullah
 */

//creates conection to server url
const SERVER_URL = "http://140.184.230.209:40608";

// JQuery-like shorthand for referencing DOM objects
const $_ = (el) => document.querySelector(el);

const errorCallback = (err) => console.error(err.responseText);

/**
 * Logs out user when page is not visible
 *
 * Author: Sheikh Saad Abdullah
 */
if ($_("body").getAttribute("id") !== "editor-body") {
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            navigator.sendBeacon(SERVER_URL + "/logoff");
        }
    });
}

// data required for the admin page
const adminData = {
    showPass: false,
    authenticate(username, passphrase) {
        $.post(
            SERVER_URL + "/authenticate",
            {
                username: username,
                passphrase: passphrase,
            },
            (res) => {
                window.location.replace("../../../admin/editor.html");
            }
        ).fail(
            Swal.fire("Incorrect username or passphrase.\nPlease try again.")
        );
    },
};

// data required for the editor page
const editorData = {
    // properties
    currentWord: "",
    currentWordImage: "",
    currentWordAudio: "",
    wordList: [],

    // methods
    fetchWordList() {
        $.get(SERVER_URL + "/wordlist", (res) => {
            this.wordList = res.wordList;
        }).fail((err) => console.error(err.responseText));
    },
    audiosrc(word) {
        return `../assets/server/audio/${word}.wav`;
    },
    imgsrc(word) {
        return word === "newWord"
            ? "https://placehold.co/350x350/424242/424242"
            : `../assets/server/images/${word}.jpg`;
    },
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
        let updatedWord = $_("#word-text").value;

        if (updatedWord === "") {
            swal({
                title: "Please enter a word.",
                icon: "warning",
            });
        } else {
            swal({
                title: "Save all changes to word?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willSave) => {
                if (willSave) {
                    let oldWord = null;

                    let wordAudio = $_("#word-audio").files[0];
                    let wordImage = $_("#word-image").files[0];

                    if (!wordAudio) {
                        // TODO: use JQuery AJAX (?)
                        wordAudio = fetch(this.audiosrc(this.currentWord)).then(
                            async (res) => await res.blob()
                        );
                    }
                    if (!wordImage) {
                        // TODO: use JQuery AJAX (?)
                        wordImage = fetch(this.imgsrc(this.currentWord)).then(
                            async (res) => await res.blob()
                        );
                    }
                    if (this.currentWord !== updatedWord) {
                        oldWord = this.currentWord;
                        this.currentWord = updatedWord;
                    }

                    this.uploadFiles({
                        audioFile: new File(
                            [wordAudio],
                            `${this.currentWord}.wav`,
                            {
                                type: "audio/wav",
                            }
                        ),
                        imageFile: new File(
                            [wordImage],
                            `${this.currentWord}.jpg`,
                            {
                                type: "image/jpg",
                            }
                        ),
                    });

                    if (oldWord != null) {
                        this.deleteWord(oldWord);
                    }

                    // this.fetchWordList();
                }
            });
        }
    },
    uploadConfirm() {
        swal({
            title: "Changes saved",
            icon: "success",
        }).then(() => {
            window.location.reload();
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
                }).then((willDelete) => {
                    if (willDelete) {
                        // delete 1 word from given index (currently selected)
                        let wordToDelete = this.wordList.splice(index, 1)[0];
                        this.currentWord = this.wordList[0];
                        this.deleteWord(wordToDelete);
                        this.fetchWordList();
                    }
                });
            }
        });
    },
    uploadFiles(filesObj) {
        $.ajax({
            url: SERVER_URL + "/upload",
            type: "POST",
            dataType: "json",
            processData: false,
            data: { files: filesObj },
            success: (res) => {
                console.log("Files have been uploaded.");
            },
        });
        // $.post(SERVER_URL + "/upload", { files: filesObj }, (res) => {
        //     console.log("Files have been uploaded.");
        // }).fail(errorCallback);
    },
    deleteWord(wordToDelete) {
        $.post(SERVER_URL + "/delete", { word: wordToDelete }, (res) => {
            console.log("Word has been deleted.");
        }).fail(errorCallback);
    },
};
