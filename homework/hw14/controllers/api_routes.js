/****************************************************************************
 ****************************************************************************

    Initialize

*****************************************************************************
*****************************************************************************/
// Import packages
const express = require("express");
const path    = require("path");

// For web scraping
const cheerio = require("cheerio");
const request = require("request");

// Create an instance of Router
const router = express.Router();

// Talk to the models
const Thread  = require(path.join(__dirname, "..", "models", "Thread.js"));
const Comment = require(path.join(__dirname, "..", "models", "Comment.js"));

const url_forum  = "http://www.neogaf.com/forum/forumdisplay.php?f=2";
const url_thread = "http://www.neogaf.com/forum/showthread.php?t=";



/****************************************************************************
 ****************************************************************************

    Set up routes

*****************************************************************************
*****************************************************************************/
router.get("/scrape", (req, res) => {
    /************************************************************************
        
        Extract information from the forum

    *************************************************************************/
    request(url_forum, (err0, res0, html) => {
        if (err0) throw err0;

        // Load the HTML into cheerio
        const $ = cheerio.load(html);

        // Find all threads on the first page
        $(`tr.threadbit`).each((index, element) => {
            const data = $(element).children("td");

            // Get the thread ID and title
            let   selector = $(data[1]).children("div").children("a");
            const threadId = selector.attr("href").match(/\d+$/)[0];
            const title    = selector.text();
            
            // Get the thread starter (author)
            selector     = $(data[2]).children("a");
            const author = selector.text();

            // Save the thread to database if it doesn't exist
            Thread.update({threadId}, {
                "$setOnInsert": new Thread({threadId, title, author, "body": ""})

            }, {
                "upsert": true

            }, (err1, res1) => {
                if (err1) throw err1;

                
                /************************************************************
        
                    Extract information from the thread

                *************************************************************/
                request(url_thread + threadId, (err2, res2, html) => {
                    if (err2) throw err2;

                    const $$ = cheerio.load(html);

                    // Get the thread body
                    const body = $($$(".post")[0]).html().trim();

                    // Insert body
                    Thread.update({threadId}, {
                        "$set": {body}

                    }, (err3, res3) => {
                        if (err3) throw err3;

                    });
                });
            });
        });

        res.redirect("/");
    });
});


router.post("/add-comment", (req, res) => {

});


module.exports = router;