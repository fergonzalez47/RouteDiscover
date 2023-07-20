const router = require("express").Router();
const { CreateTrailValidation, deleteTrailValidation, registerUserValidation } = require("../helpers/validation.js");

const { getTrails, postTrail, getTrailById, getTrailsByUserID, GTBDifficulty, GTBCountry, GTBPointOfInterest, updateTrail, deleteTrail } = require("../controllers/trekkingController")
const { getComments, postComment, getCommentsByTrailId, updateComment, deleteComment } = require("../controllers/commentsController.js");
const { getUsers, getUserById, GTBFavorites, updateUser, deleteUser, registerUser, loginUser } = require("../controllers/userController.js");
const { addFavorite, getFavorites } = require('../controllers/favoritesController.js');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

const { ensureAuth, ensureGuest } = require("../middleware/auth.js");


router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));



//
//
// Login / Landing page
router.get("/login", ensureGuest, (req, res) => {
    const successMessage = req.flash('successMessage');
    res.render("login", {
        layout: "login",
        successMessage: successMessage
    });
});


router.get("/comment", (req, res) => {
    res.render("comment", {
        layout: "main"
    });
});
router.get("/error", (req, res) => {
    res.render("error", {
        layout: "main"
    });
});
router.get("/dashboard", ensureAuth, getTrailsByUserID);
//hiking

router.get("/trails", ensureAuth, getTrails);
router.get("/trails/:trailId", ensureAuth, (req, res, next) => {
    getTrailById(req, res, next, "trail_id");
});
router.get("/trails/difficulty/:difficulty", ensureAuth, GTBDifficulty);
router.get("/trails/country/:country", ensureAuth, GTBCountry);
router.get("/trails/pointOfInterest/:pointOfInterest", ensureAuth, GTBPointOfInterest);

router.post("/trails", ensureAuth, CreateTrailValidation, postTrail);
router.put("/trails/:trailId", ensureAuth, updateTrail);
router.delete("/trails/:trailId", ensureAuth, deleteTrailValidation, deleteTrail);


//User
router.get("/users", ensureAuth, getUsers);
router.get("/users/:userId", ensureAuth, getUserById);

router.post("/users", ensureGuest, registerUserValidation, registerUser);
//Login Normal User
router.post("/login/users", ensureGuest, loginUser);
router.put("/users/:userId", ensureAuth, updateUser);
router.delete("/users/:userId", ensureAuth, deleteUser);


//comments
router.get("/trails/comments/:trailId", ensureAuth, getCommentsByTrailId);
router.post("/trails/comments", ensureAuth, postComment);
router.put("/trails/comments/:trailId", ensureAuth, updateComment);
router.get("/trails/comments", ensureAuth, getComments);
router.delete("/trails/comments/:commentId", ensureAuth, deleteComment);


//Favorites

router.post('/favorites', ensureAuth, addFavorite);
router.get("/favorites", ensureAuth, getFavorites);

module.exports = router;