const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    trekkingRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrekkingRoute",
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model("Comment", commentSchema);


// Esquema de Favorites
const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    trekkingRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrekkingRoute",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = {
    Comment
};
