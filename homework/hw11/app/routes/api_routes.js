/****************************************************************************
 ****************************************************************************
    
    Initialize
    
*****************************************************************************
*****************************************************************************/
const express = require("express");

// Create an instance of router
const router = express.Router();



/****************************************************************************
 ****************************************************************************
    
    Set up routes
    
*****************************************************************************
*****************************************************************************/
// Display all friends
router.get("/friends", (req, res) => {
    console.log("Displaying array of friends");
});

// Find the best friend
router.post("/friends", (req, res) => {
    console.log("Handling survey results");
});

// Export the router
module.exports = router;