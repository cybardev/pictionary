/*
  The purpose of this file is to create a password that checkes the right user when uploading a new file.

  Author: Ishani Kasaju
*/

/**
 * This checks the entered password to see if it is correct. If it is the upload feature is
 * unlocked, if not the user is informed of the incorrect code.
 *
 * Author: Ishani Kasaju
 *         Sheikh Saad Abdullah
 */
function checkCode(serverAddress) {
    $.get(serverAddress + "/authenticate", $("#adminPassword").val(), (correctPassword) => {
        if (correctPassword) {
            closeModal("teacherZone");
            openModal("addVocabArea");
        } else {
            Swal.fire("Incorrect Code");
        }
    })
}
