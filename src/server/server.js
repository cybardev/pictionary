/**
 * This file handles all server side operations and performs various
 * functions such as post, get, and listen, as well as callbacks to the client side.
 *
 * Authors: Sarah Derby   -  created the get function to retrieve files from server
 *          Ishani Kasaju - created the post function to upload files to server
 *          Terry Goldsmith - gave base code for getting a server properly set up
 */

//Loads in required frameworks and sets server and port constants

//File system, allows access into file system structure
const fs = require("fs");

//Path allows for movement through file system structure
const path = require("path");

//allows setup of an express server
const express = require("express");

//allows upload to an express server
const upload = require("express-fileupload");

//sets server to be express
const server = express();

//port number
const port = 40608;

//creates constants for file paths
const AUDIO_PATH = "assets/server/audio",
    IMG_PATH = "assets/server/images";

// admin authentication passphrase
const PASSWORD = "only me";

//variables for temporary holding of things being retrieved from server
var audios = [],
    images = [],
    words = [],
    wordbank = {};

// set JSON recognition
server.use(express.json());

// set incoming name:value pairs to be any type
server.use(express.urlencoded({ extended: true }));

//Code provided by Terry Goldsmith
let allowCrossDomain = function (req, res, next) {
    // allow any origin
    res.header("Access-Control-Allow-Origin", "*");
    // allow any method
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    // accept only headers with Content-Type included
    res.header("Access-Control-Allow-Headers", "Content-Type");
    // link express process to next operation
    next();
};

// set allowable domain characteristics and upload capabilities
//Provided by Terry Goldsmith
server.use(allowCrossDomain);
server.use(upload());

/**
 * Purpose: Authenticates password so teachers can access admin page
 *
 * Author: Sheikh Saad Abdullah
 */
server.get("/authenticate", function (req, res) {
    return res.status(200).send(req.password == PASSWORD ? true : false);
});

/**
 * Purpose: Recieves get information and saves audio, image and vocab words  directories from server to arrays
 * then sends this information to an object to return data to client side.
 *
 * Author: Sarah Derby
 *         Sheikh Saad Abdullah
 */
server.get("/getWordBank", function (req, res) {
    console.log(req.url);

    //loops all files in AUDIO_PATH and saves directories to array
    audios = fs
        .readdirSync(path.resolve(__dirname, "../../" + AUDIO_PATH))
        .map((wav) => {
            return AUDIO_PATH + "/" + path.basename(wav);
        });

    //loops all files in IMG_PATH and saves directories to array
    images = fs
        .readdirSync(path.resolve(__dirname, "../../" + IMG_PATH))
        .map((img) => {
            return IMG_PATH + "/" + path.basename(img);
        });

    //remove file extension to gain just vocab name and save all to an array
    words = fs
        .readdirSync(path.resolve(__dirname, "../../" + IMG_PATH))
        .map((vocab) => {
            return path.basename(vocab, path.extname(vocab));
        });

    //save arrays to object for easy sharing to client side
    wordbank = { vocab: words, images: images, audios: audios };

    //send object to js file
    return res.status(200).send(wordbank);
});

/**
 * Purpose: Recieves post request and uploads audio and img files to server.
 *
 * Author: Ishani Kasaju
 *         Sheikh Saad Abdullah
 */
server.post("/upload/", (req, res) => {
    console.log(req.url);

    //check that files exist
    if (req.files) {
        //add files to variables and save names
        var reqImgFile = req.files.imgFile;
        var imgFileName = reqImgFile.name;

        var reqAudFile = req.files.audFile;
        var audFileName = reqAudFile.name;

        console.log(imgFileName);
        console.log(audFileName);

        //move files to new loaction in server
        reqImgFile.mv("../../" + IMG_PATH + "/" + imgFileName, function (err) {
            if (err) {
                res.send(err);
            } else {
                reqImgFile.mv(
                    "../../" + AUDIO_PATH + "/" + audFileName,
                    function (err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send(
                                "Your files have been added to the server and you may now go back to the previous screen, thank you,!"
                            );
                        }
                    }
                );
            }
        });
    }
});

/**
 * Purpose: Listen for action on url port
 *
 * Authors: Terry Goldsmith
 *          Sarah Derby (A00443128)
 */
server.listen(port, function () {
    console.log("Listening on port " + port);
});
