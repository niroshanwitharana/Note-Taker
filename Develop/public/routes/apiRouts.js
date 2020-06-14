// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.

const fs = require("fs");
const path = require("path");
const dbJson = require("../../db/db.json");



// ROUTING


module.exports = function (app) {
    // API GET Requests
    // Below code handles when users "visit" a page.
    // In each of the below cases when a user visits a link

    fs.readFile(dbJson, 'utf8', (err, jsonString) => {
        
        const notes = JSON.parse(jsonString);
        
        app.get("/api/notes",  (req, res) => {
            if (err) {
                res.status(400).send("You don't have any saved dbJson");
                return
            }



            console.log(notes);
            res.json(notes);


        });

        app.post("/api/notes", function (req, res) {
            if (!req.body.title || !req.body.text) {
                res.status(404).send("Please enter title and note both to save your note...");
                return;
            }
            let Note = {
                id: notes.length + 1,
                title: req.body.title,
                name: req.body.text
            };
            notes.push(Note);
            res.send(Note);
        });

        app.delete('/api/notes/:id', (req, res) => {
            //Read all the dbJson
            // let notes = fs.readFile(dbJson, 'utf8', (err, jsonString) => {
            //     if (err) {
            //         res.status(400).send("You don't have any saved notes");
            //         return
            //     }

            //     return JSON.parse(jsonString)

            // });
            //look up the course
            //not existing, return 404
            var note = notes.find(n => n.id === parseInt(req.params.id));
            if (!note) return res.status(404).send('404 Error Occured !');

            //delete
            const index = notes.indexOf(note);
            notes.splice(index, 1);

            fs.writeFile(dbJson, JSON.stringify(notes), function (err) {
                res.status(400).send("You dont have any saved notes left");
                return
            });

            //return the same course
            res.send(note);

        });


    });
};
