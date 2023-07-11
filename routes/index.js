const router = require("express").Router();
const { CreateTrailValidation, deleteTrailValidation } = require("../helpers/validation.js");

const { getTrails, postTrail, getTrailById, GTBDifficulty, GTBCountry, GTBPointOfInterest, updateTrail, deleteTrail } = require("../controllers/trekkingController")
const { getComments, postComment, getCommentsByTrailId, updateComment, deleteComment } = require("../controllers/commentsController.js");
const { getUsers, getUserById, GTBFavorites, updateUser, deleteUser } = require("../controllers/userController.js");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

const { ensureAuth, ensureGuest } = require("../middleware/auth.js");


router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));



//
//
// Login / Landing page
router.get("/login", ensureGuest, (req, res) => {
    res.render("login", {
        layout: "login",
    });
});

router.get("/dashboard", ensureAuth, (req, res) => {
    res.render("dashboard");
});
//hiking

router.get("/trails", ensureAuth,  getTrails);
router.get("/trails/:trailId", ensureAuth,  getTrailById);
router.get("/trails/difficulty/:difficulty", ensureAuth,  GTBDifficulty);
router.get("/trails/country/:country", ensureAuth,  GTBCountry);
router.get("/trails/pointOfInterest/:pointOfInterest", ensureAuth,  GTBPointOfInterest);

router.post("/trails", ensureAuth,  CreateTrailValidation, postTrail);
router.put("/trails/:trailId", ensureAuth,  updateTrail);
router.delete("/trails/:trailId", ensureAuth,  deleteTrailValidation, deleteTrail);


//User
router.get("/users", ensureAuth,  getUsers);
router.get("/users/:userId", ensureAuth,  getUserById);
router.get("/users/:userId/favorites", ensureAuth,  GTBFavorites);
router.post("/users", ensureAuth,  );
router.put("/users/:userId", ensureAuth,  updateUser);
router.delete("/users/:userId", ensureAuth,  deleteUser);


//comments
router.get("/trails/comments/:trailId", ensureAuth,  getCommentsByTrailId);
router.post("/trails/comments", ensureAuth,  postComment);
router.put("/trails/comments/:trailId", ensureAuth,  updateComment);
router.get("/trails/comments", ensureAuth,  getComments);
router.delete("/trails/comments/:commentId", ensureAuth,  deleteComment);

module.exports = router;