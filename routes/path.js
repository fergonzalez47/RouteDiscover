const router = require("express").Router();
const { ensureAuth } = require("../middleware/auth.js");
const {  getTrailById } = require("../controllers/trekkingController")


router.get("/", (req, res) => {
    res.render("index");
});
router.get("/newTrail", ensureAuth, (req, res) => {
    res.render("newTrail");
});

router.get("/registration", (req, res) => {
    res.render("registration");
});

router.get("/edit/:trailId", (req, res, next) => {
    getTrailById(req, res, next, "edit_trail");
});






module.exports = router;