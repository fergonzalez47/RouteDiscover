const router = require("express").Router();
const { CreateTrailValidation, deleteTrailValidation } = require("../helpers/validation.js");

const { getTrails, postTrail, getTrailById, GTBDifficulty, GTBCountry, GTBPointOfInterest, updateTrail, deleteTrail } = require("../controllers/trekkingController")



const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));


//hiking

router.get("/trails", getTrails);
router.get("/trails/:trailId", getTrailById);
router.get("/trails/difficulty/:difficulty", GTBDifficulty);
router.get("/trails/country/:country", GTBCountry);
router.get("/trails/pointOfInterest/:pointOfInterest", GTBPointOfInterest);

router.post("/trails", CreateTrailValidation, postTrail);
router.put("/trails/:trailId", updateTrail);
router.delete("/trails/:trailId", deleteTrailValidation, deleteTrail);


//User
router.get("/users", (req, res) => { });
router.get("/users/:userId", (req, res) => { });
router.get("/users/:userId/favorites", (req, res) => { });
router.post("/users", (req, res) => { });
router.put("/users/:userId", (req, res) => { });
router.delete("/users/:userId", (req, res) => { });


//comments
router.get("/trails/{trailId}/comments", (req, res) => { });
router.post("/trails/{trailId}/comments", (req, res) => { });
router.put("/trails/{trailId}/comments/{commentId", (req, res) => { });
router.get("/trails/comments", (req, res) => { });
router.delete("/trails/{trailId}/comments/{commentId", (req, res) => { });

module.exports = router;