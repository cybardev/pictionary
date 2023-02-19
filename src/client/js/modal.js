/**
 * This file opens and closes modals based on their IDs
 *
 * Author: Sarah Derby
 */

/**
 * Closes modal based on a given ID
 *
 * Author: Sarah Derby
 * @param {String} id the id of modal to close
 */
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

/**
 * Opens modal based on given ID. If id is the word bank, then the function is called to filll the word
 * bank as well.
 *
 * Author: Sarah Derby
 * @param {String} id
 */
function openModal(id) {
    document.getElementById(id).style.display = "inline-block";

    if (id === "wordBankModal") {
        fillWBank();
    }
}
