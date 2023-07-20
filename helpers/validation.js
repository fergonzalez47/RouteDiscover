const { check } = require("express-validator");
//Artist
exports.CreateTrailValidation = [
    check('name', 'Trail name is required').not().isEmpty(),
    check('difficulty').custom((value) => {
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

exports.registerUserValidation = [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/)
];
