const router = require("express").Router();
const { ensureAuth } = require("../middleware/auth.js");


router.get("/", (req, res) => {
    res.render("index");
});
router.get("/newTrail", ensureAuth, (req, res) => {
    res.render("newTrail");
});

router.get("/registration", (req, res) => {
    res.render("registration");
});





module.exports = router;