const { check } = require("express-validator");
//Artist
exports.CreateTrailValidation = [
    check('name', 'Trail name is required').not().isEmpty(),
    check('difficulty', 'Difficulty is required and should be "Easy", "Moderate" or "Hard"').not().isEmpty(),
    check('distance', 'Distance is required. It should be a number').isInt(),
    check('duration', 'Distance is required. It should be a number').isInt(),
    check('description', 'A brief description is required').not().isEmpty(),
    check('pointsOfInterest', 'Please, include at least one point of interest').not().isEmpty()
];

exports.deleteTrailValidation = [
    check('id', 'Trail ID is required for delete').not().isEmpty(),
    check('id', 'Invalid Trail ID').isMongoId()
];

