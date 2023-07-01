const mongoose = require("mongoose");
const User = require("../models/User.js");
const createError = require("http-errors");
const { validationResult } = require("express-validator");



const getUsers = async (req, res) => {

    try {
        const users = await User.find().lean();
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting the Users..." });
    }
};




//This function will get a User based on his/her ID
const getUserById = async (req, res, next) => {
    try {
        //getting the given parameter
        const userId = req.params.userId;

        //Validating that the given ID match the pattern or is in MongoDB collection
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw createError(400, "Invalid user ID");
        }
        const user = await User.findById(userId).lean();

        if (!user) {
            throw createError(400, "User not found.")
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(422).json({ error: error.message });
        next(error);
    }
};

// GTB = Get Trails By


//Get trails by difficulty

//NEED TO WORK HEREEEE
const GTBFavorites = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const favorites = await User.find({ favorites: userfavorites }).lean();
        res.status(200).json({ trails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting the routes..." });
    }
};


const updateUser = async (req, res, next) => {
    try {
        //getting the given parameter
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log(userId);
            return res.status(400).send({ message: "Invalid user ID" });
        };
        const { displayName, firstName, lastName } = req.body;

        const updatedData = {
            displayName: displayName,
            firstName: firstName,
            lastName: lastName,
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            throw createError(404, "The User does not exist. ");
        };
        res.status(201).json({ message: " Updated " });
        console.log("User updated...");

    } catch (error) {
        console.error(error.name, error.message);
        next(error);
    };
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log(userId);
            return res.status(400).send({ message: "Invalid user ID" });
        };

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully..." });
        console.log("* User deleted *");
    } catch (error) {
        console.error(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, "Invalid User ID."));
            return;
        }
        next(error);
    }
};

module.exports = {getUsers, getUserById, GTBFavorites, updateUser, deleteUser };