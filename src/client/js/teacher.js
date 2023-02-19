/*
  The purpose of this file is to create a password that checkes the right user when uploading a new file.

  Author: Ishani Kasaju
*/

// a constant that stores the password
const PASSWORD = "only me";

/**
 * This checks the entered password to see if it is correct. If it is the upload feature is
 * unlocked, if not the user is informed of the incorrect code.
 *
 * Author: Ishani Kasaju
 */
function checkCode() {
    var triedCode = $("#adminPassword").val();

    if (triedCode == PASSWORD) {
        closeModal("teacherZone");
        openModal("addVocabArea");
    } else {
        Swal.fire("Incorrect Code");
    }
}
