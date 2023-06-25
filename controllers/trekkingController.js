const mongoose = require("mongoose");
const TrekkingRoute = require("../models/TrekkingRoute");
const createError = require("http-errors");
const { validationResult } = require("express-validator");



const getTrails = async (req, res) => {

    try {
        const trails = await TrekkingRoute.find().lean();
        res.status(200).json({ trails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting the routes..." });
    }
};


const postTrail = async (req, res, next) => {

    //------------------- Validation ------------------------- //
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };
    //------------------- Validation ------------------------- //
    const { name, difficulty, distance, duration, country, description,
        pointsOfInterest, createdAt } = req.body;
    try {

        let data = {
            name: name,
            difficulty: difficulty,
            distance: distance,
            duration: duration,
            country: country,
            description: description,
            pointsOfInterest: pointsOfInterest,
            createdAt: createdAt
        };

        let newTrail = new TrekkingRoute(data);

        await newTrail.save();

        res.status(201).json({ id: newTrail._id });
        console.log("*** Trekking trail Saved ***");
    } catch (error) {
        console.error(error.name, error.message);
        if (error.name === "ValidationError") {
            next(createError(422, error.message));
            return;
        };
        next(error);
    };
};


//This function will get a trail based on a given ID
const getTrailById = async (req, res, next) => {
    try {
        //getting the given parameter
        const trailId = req.params.trailId;

        //Validating that the given ID match the pattern or is in MongoDB collection
        if (!mongoose.Types.ObjectId.isValid(trailId)) {
            throw createError(400, "Invalid trail ID");
        }
        const trail = await TrekkingRoute.findById(trailId).lean();

        if (!trail) {
            throw createError(400, "Trekking route not found.")
        }

        res.status(200).json({ trail });
    } catch (error) {
        console.error(error);
        res.status(422).json({ error: error.message });
        next(error);
    }
};

// GTB = Get Trails By


//Get trails by difficulty
const GTBDifficulty = async (req, res, next) => {
    const trailDifficulty = req.params.difficulty;
    try {
        const trails = await TrekkingRoute.find({ difficulty: trailDifficulty }).lean();
        res.status(200).json({ trails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting the routes..." });
    }
};


const GTBCountry = async (req, res, next) => {
    const country = req.params.country;
    try {
        const trails = await TrekkingRoute.find({ country: country }).lean();
        res.status(200).json({ trails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting the routes..." });
    }
};


const GTBPointOfInterest = async (req, res, next) => {

    const pointOfInterest = req.params.pointOfInterest;

    try {
        const trails = await TrekkingRoute.find({ $text: { $search: pointOfInterest } }).lean();
        res.status(200).json({ trails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting the routes..." });
    }
};

const updateTrail = async (req, res, next) => { 
    try {
        //getting the given parameter
        const trailId = req.params.trailId;
        if (!mongoose.Types.ObjectId.isValid(trailId)) {
            console.log(trailId);
            return res.status(400).send({ message: "Invalid trekking route ID" });
        };
        const { name, difficulty, distance, duration, country, description,
            pointsOfInterest } = req.body;
        
        let updatedData = {
            name: name,
            difficulty: difficulty,
            distance: distance,
            duration: duration,
            country: country,
            description: description,
            pointsOfInterest: pointsOfInterest
        };

        const updatedTrail = TrekkingRoute.findByIdAndUpdate(trailId, updatedData, { new: true });

        if (!updatedTrail) { 
            throw createError(404, "The trekking route does not exist. ");
         };
        res.status(201).json({ message: " Updated "});
        console.log("Trekking route updated...");

    } catch (error) {
        console.error(error.name, error.message);

        next(error);
    };
};

const deleteTrail = async (req, res, next) => {
    try {
        const trailID = req.params.trailId;

        if (!mongoose.Types.ObjectId.isValid(trailID)) {
            console.log(trailID);
            return res.status(400).send({ message: "Invalid trekking route ID" });
        };
        
        await TrekkingRoute.findByIdAndDelete(trailID);
        res.status(200).json({ message: "Trail deleted successfully..." });
        console.log("* Trekking trail deleted *");
    } catch (error) {
        console.error(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, "Invalid trail ID."));
            return;
        }
        next(error);
    }
};

module.exports = {
    getTrails,
    postTrail,
    getTrailById,
    GTBDifficulty,
    GTBCountry,
    GTBPointOfInterest,
    updateTrail,
    deleteTrail,

};