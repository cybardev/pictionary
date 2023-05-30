/**
 * This checks the entered password to see if it is correct. If it is the upload feature is
 * unlocked, if not the user is informed of the incorrect code.
 *
 * Author: Ishani Kasaju
 *         Sheikh Saad Abdullah
 */

//creates conection to server url
const SERVER_URL = "https://140.184.230.209:40608";

const alpineData = {
    showPass: false,
    authenticate() {
        $.get(
            SERVER_URL + "/authenticate",
            $("#adminPassword").val(),
            (correctPassword) => {
                if (correctPassword) {
                    openModal("addVocabArea");
                } else {
                    Swal.fire(
                        "Incorrect username or passphrase.\nPlease try again."
                    );
                }
            }
        );
    },
};
