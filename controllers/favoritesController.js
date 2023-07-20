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

        res.status(201).json({ message: 'Trekking added to favorites successfully' });
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
                _id: trekkingMap[favorite.trekkingRoute]._id
            };
        });
        console.log("trekkingMap", trekkingMap);
        console.log("formattedfavorites", formattedfavorites);

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

const RemoveFavorite = async () => {

}

module.exports = {
    addFavorite,
    getFavorites
};
