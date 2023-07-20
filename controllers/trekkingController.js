const mongoose = require("mongoose");
const TrekkingRoute = require("../models/TrekkingRoute");
const createError = require("http-errors");
const { validationResult } = require("express-validator");
const { Favorite } = require('../models/Favorites.js');



const getTrails = async (req, res) => {

    try {
        const trails = await TrekkingRoute.find().lean();
        const successMessage = req.flash('success');
        // res.status(200).json({ trails });
        res.render("trails", { trails: trails, successMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting the routes..." });
    }
};



const getTrailsByUserID = async (req, res) => {

    try {
        const userId = req.user.id;

        const trails = await TrekkingRoute.find({ createdBY: userId }).lean();

        res.render("dashboard", {
            trails: trails,
            userName: req.user.firstName
        });
    } catch (error) {
        console.error(error);
        if (res.status(404)) {
            res.render('error', { errorMessage: "Resource is not found...We are sorry" });
        }
        res.render('error', { errorMessage: "error getting the routes..." });

    }
};

const postTrail = async (req, res, next) => {
    try {
        //------------------- Validation ------------------------- //
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("newTrail", { errorMessage: errors.array() });
        }
        //------------------- Validation ------------------------- //

        const { name, difficulty, distance, duration, country, description, pointsOfInterest, createdAt } = req.body;
        const userId = req.user.id;

        let data = {
            name: name,
            difficulty: difficulty,
            distance: distance,
            duration: duration,
            country: country,
            description: description,
            pointsOfInterest: pointsOfInterest,
            createdAt: createdAt,
            createdBY: userId
        };

        let newTrail = new TrekkingRoute(data);

        await newTrail.save();

        req.flash('success', 'Your route was saved successfully!');
        res.redirect('/trails');
        console.log("*** Trekking trail Saved ***");

    } catch (error) {
        console.error(error.name, error.message);
        if (error.name === "ValidationError") {
            next(createError(422, error.message));
            return;
        }
        next(error);
    }
};



//This function will get a trail based on a given ID
const getTrailById = async (req, res, next, view) => {
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
        const isFavorite = await Favorite.exists({ user: req.user.id, trekkingRoute: trailId });

        // res.status(200).json(trail);
        res.render(view, { trail: trail, isFavorite: isFavorite });
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
        const trailId = req.params.trailId;

        if (!mongoose.Types.ObjectId.isValid(trailId)) {
            return res.render("error", { errorMessage: "Invalid trekking route ID" });
        }

        const trail = await TrekkingRoute.findById(trailId).lean();

        // Verificar si el usuario ha iniciado sesión y es el mismo que creó la ruta
        if (req.user && trail && trail.createdBY.toString() === req.user._id.toString()) {
            const { name, difficulty, distance, duration, country, description, pointsOfInterest } = req.body;

            const updatedData = {
                name: name,
                difficulty: difficulty,
                distance: distance,
                duration: duration,
                country: country,
                description: description,
                pointsOfInterest: pointsOfInterest
            };

            const updatedTrail = await TrekkingRoute.findByIdAndUpdate(trailId, updatedData, { new: true });

            if (!updatedTrail) {
                throw createError(404, "The trekking route does not exist.");
            }

            res.redirect('/dashboard');
            console.log("Trekking route updated.");
        } else {
            // El usuario no es el propietario de la ruta, redirigir a otra página
            res.redirect('/error');
        }
    } catch (error) {
        console.error(error.name, error.message);
        next(error);
    }
};




const deleteTrail = async (req, res, next) => {
    try {
        const trailId = req.params.trailId;

        if (!mongoose.Types.ObjectId.isValid(trailId)) {
            console.log(trailId);
            return res.status(400).send({ message: "Invalid trekking route ID" });
        };

        const trail = await TrekkingRoute.findById(trailId).lean();

        // Verificar si el usuario ha iniciado sesión y es el mismo que creó la ruta
        if (req.user && trail && trail.createdBY.toString() === req.user._id.toString()) {

            await TrekkingRoute.findByIdAndDelete(trailId);

            const message = 'Trekking route deleted successfully!';
            console.log("* Trekking trail deleted *");
            res.redirect("/dashboard");
        } else {
            // El usuario no es el propietario de la ruta, redirigir a otra página
            res.redirect('/error');
        }
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
    getTrailsByUserID,
    GTBDifficulty,
    GTBCountry,
    GTBPointOfInterest,
    updateTrail,
    deleteTrail,

};