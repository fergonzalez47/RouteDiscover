const router = require("express").Router();


router.get("/", (req, res) => {
    res.render("index");
});
router.get("/newTrail", (req, res) => {
    res.render("newTrail");
});




module.exports = router;