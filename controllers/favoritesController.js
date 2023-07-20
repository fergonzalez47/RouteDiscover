const mongoose = require("mongoose");
const { Favorite } = require('../models/Favorites.js');
const TrekkingRoute = require("../models/TrekkingRoute");

const addFavorite = async (req, res, next) => {
    try {
        const { trekkingRoute } = req.body;

        // Verificar si el trekking ya ha sido marcado como favorito por el usuario
        const existingFavorite = await Favorite.findOne({ user: req.user._id, trekkingRoute });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Trekking already added to favorites' });
        }

        // Crear un nuevo favorito y guardarlo en la colección
        const newFavorite = new Favorite({
            user: req.user._id,
            trekkingRoute
        });

        await newFavorite.save();
        console.log("added")

        res.status(201).json( { message: 'Trekking added to favorites successfully' });
    } catch (error) {
        console.error('Error adding trekking to favorites:', error);
        res.status(500).render("error", { errorMessage: 'Internal server error' });
    }
};




const getFavorites = async (req, res, next) => {

    try {
        const userId = req.user.id;

        const favorites = await Favorite.find({ user: userId }).lean();

        const trekkingIds = favorites.map(favorite => favorite.trekkingRoute);
        const trekkingRoutes = await TrekkingRoute.find({ _id: { $in: trekkingIds } }).lean();
        const trekkingMap = {};
        trekkingRoutes.forEach(trekkingRoute => {
            trekkingMap[trekkingRoute._id] = trekkingRoute
        });

        // Reemplazar el ID de trekking por el nombre de trekking en cada favorito
        const formattedfavorites = favorites.map(favorite => {
            return {
                trekkingRoute: trekkingMap[favorite.trekkingRoute].name,
                createdAt: favorite.createdAt,
                _id: trekkingMap[favorite.trekkingRoute]._id,
                favoriteId: favorite._id
            };
        });

        res.status(200).render("favorites/favorites", {
            favorites: formattedfavorites,
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

const RemoveFavorite = async (req, res, next) => {
    try {
        const favoriteId = req.params.favoriteId;
        console.log("Favorite ID:", favoriteId);

        if (!mongoose.Types.ObjectId.isValid(favoriteId)) {
            console.log("Invalid Favorite ID");
            return res.status(400).render("error", { errorMessage: "Invalid favorite route ID" });
        }

        const favorite = await Favorite.findById(favoriteId).lean();
        console.log("Favorite found:", favorite);

        if (req.user && favorite && favorite.user.toString() === req.user._id.toString()) {
            await Favorite.findByIdAndDelete(favoriteId);
            console.log("* Trekking Favorite removed *");
            res.redirect("/favorites");
        } else {
            console.log("Unauthorized or Favorite not found");
            res.redirect('/error');
        }
    } catch (error) {
        console.error("Error:", error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, "Invalid trail ID."));
            return;
        }
        return res.render("error", { errorMessage: error + " :" + error.message });
    }
}

module.exports = {
    addFavorite,
    getFavorites,
    RemoveFavorite
};


module.exports = {
    addFavorite,
    getFavorites,
    RemoveFavorite
};
