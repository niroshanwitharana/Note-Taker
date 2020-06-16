// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.

const fs = require("fs");
const path = require("path");
const dbJson = require("../../db/db.json");
var util = require('util');

const writefileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

console.log(dbJson);


// ROUTING


module.exports = function (app) {
    let allNotes = [];
    // API GET Requests
    // Below code handles when users "visit" a page.
    // In each of the below cases when a user visits a link

    app.get("/api/notes", function (req, res) {
        readFileAsync(path.join(__dirname, "../../db/db.json"), "utf8")
            .then(function (data) {
                return res.json(JSON.parse(data));
            });
    });

    // add a new note
    app.post("/api/notes", function (req, res) {
        let NewNote = req.body;
        readFileAsync(path.join(__dirname, "../../db/db.json"), "utf8")
            .then(function (data) {
                allNotes = JSON.parse(data);
                if (!NewNote.title || !NewNote.text) {
                    return res.status(404).send("Please enter title and note before save it...");

                }
                for (let i = 0; i < allNotes.length; i++) {
                    allNotes[i].id = i + 1;

                }
                const Note = {
                    id: allNotes.length + 1,
                    title: NewNote.title,
                    name: NewNote.text
                };

                allNotes.push(Note);
                res.json(Note);

                writefileAsync(path.join(__dirname, "../../db/db.json"), JSON.stringify(allNotes))
                    .then(function () {
                        console.log("Written db.json");
                    })
            });
    });

    //delete note with specific id

    app.delete("/api/notes/:id", function (req, res) {
        var ID = parseInt(req.params.id);
        readFileAsync(path.join(__dirname, "../../db/db.json"), "utf8")
            .then(function (data) {
                allNotes = JSON.parse(data);

                //     look up the course
                //not existing, return 404
                var note = allNotes.find(n => n.id === ID);
                if (!note) return res.status(404).send('404 Error Occured !');

                //delete

                allNotes.splice((ID - 1), 1);

                //rewrite all the note id's again
                for (let i = 0; i < allNotes.length; i++) {
                    allNotes[i].id = i + 1;

                }

                //write in to the json file
                writefileAsync(path.join(__dirname, "../../db/db.json"), JSON.stringify(allNotes))
                    .then(function () {
                        console.log("Deleted db.json");
                    })

            res.json(ID);

            });
    });

}
