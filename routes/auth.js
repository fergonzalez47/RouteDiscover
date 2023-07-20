const router = require('express').Router();
const passport = require("passport");
// Auth with google
// Get auth/google
router.get("/google", passport.authenticate("google", { scope: ['profile'] }));

// google with callback
// Get auth/google/callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    });


// Logout user
//auth/logout
router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.error(err);
            // Manejo del error si es necesario
        }
        res.redirect('/');
    });
});


module.exports = router;