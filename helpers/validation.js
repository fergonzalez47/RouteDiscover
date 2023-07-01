const { check } = require("express-validator");
//Artist
exports.CreateTrailValidation = [
    check('name', 'Trail name is required').not().isEmpty(),
    check('difficulty', 'Invalid difficulty.It should be "Easy", "Moderate" or "Hard"').not()
        .isEmpty().custom((value) => {
            if (value !== 'Easy' && value !== 'Moderate' && value !== 'Hard') {
                throw new Error("Invalid difficulty. It should be 'Easy', 'Moderate' or 'Hard'");
            }
            return true;
        }),
    check('distance', 'Distance is required. It should be a number').isInt(),
    check('duration', 'Distance is required. It should be a number').isInt(),
    check('description', 'A brief description is required').not().isEmpty(),
    check('pointsOfInterest', 'Please, include at least one point of interest').not().isEmpty()
];

exports.deleteTrailValidation = [
    check('id', 'Trail ID is required for delete').not().isEmpty(),
    check('id', 'Invalid Trail ID').isMongoId()
];

