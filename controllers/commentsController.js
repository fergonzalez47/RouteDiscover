const mongoose = require("mongoose");
const Comment = require("../models/Comment.js");
const User = require("../models/User.js");
const createError = require("http-errors");
const { validationResult } = require("express-validator");




const getComments = async (req, res) => {

    try {
        const comments = await Comment.find().lean();

        if (comments.length === 0) {
            return res.status(200).json({ message: "No comments in db." });
        }
        res.status(200).json({ comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error getting the comments..." });
    }
};






const getCommentsByTrailId = async (req, res, next) => {
    try {
        const requestedTrailId = req.params.trailId;
        if (!mongoose.Types.ObjectId.isValid(requestedTrailId)) {
            throw createError(400, 'Invalid trail ID');
        }
        
        const comments = await Comment.find({ trekkingRoute: requestedTrailId }).lean();
        if (comments.length === 0) {
            return console.log('No comments found for the specified trail');
        }

        // Obtengo los nombres de usuario correspondientes a los IDs de usuario en los comentarios
        const userIds = comments.map(comment => comment.user);
        const users = await User.find({ _id: { $in: userIds } }).lean();
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = user.displayName + " " + user.lastName ;
        });

        // Reemplazar el ID de usuario por el nombre de usuario en cada comentario
        const formattedComments = comments.map(comment => {
            return {
                user: userMap[comment.user],
                comment: comment.comment,
                createdAt: comment.createdAt
            };
        });
        console.log("formattedComments", formattedComments);
        res.status(200).json({ comments: formattedComments });
    } catch (error) {
        if (error.name === 'CastError') {
            next(createError(400, 'Invalid trail ID'));
        } else {
            next(error);
        }
    }
};



const postComment = async (req, res, next) => {
    try {
        //------------------- Validation ------------------------- //
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //------------------- Validation ------------------------- //

        const { trekkingRouteID, comment } = req.body;
        const userId = req.user._id || 100;
        if (!comment) {
            return res.render(req.get('referer'));
        };
  
        let data = {
            user: userId,
            trekkingRoute: trekkingRouteID,
            comment: comment
        };

        let newComment = new Comment(data);
        await newComment.save();
        console.log("*** Comment Saved ***");


    } catch (error) {
        console.error(error.name, error.message);
        if (error.name === "ValidationError") {
            next(createError(422, error.message));
            return;
        }
        next(error);
    }
};



const updateComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: "Invalid comment ID" });
        }

        const { trekkingRoute, comment } = req.body;
        const userId = req.user._id;

        const commentExists = await Comment.exists({ _id: commentId, user: userId });
        if (!commentExists) {
            return res.status(404).json({ message: "The comment does not exist or you are not authorized to update it." });
        }

        const updatedComment = {
            trekkingRoute: trekkingRoute,
            comment: comment
        };

        const updated = await Comment.findByIdAndUpdate(commentId, updatedComment, { new: true });
        if (!updated) {
            throw createError(500, "Failed to update the comment.");
        }

        res.status(200).json({ message: "Comment updated successfully." });
        console.log("...Comment updated...");
    } catch (error) {
        console.error(error.name, error.message);
        next(error);
    }
};


const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            console.log(commentId);
            return res.status(400).send({ message: "Invalid trekking route ID" });
        };
        const userId = req.user._id;
        const commentExists = await Comment.exists({ _id: commentId, user: userId });
        if (!commentExists) {
            return res.status(404).json({ message: "The comment does not exist or you are not authorized to delete it." });
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully..." });
        console.log("* Comment deleted *");
    } catch (error) {
        console.error(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, "Invalid Comment ID."));
            return;
        }
        next(error);
    }
};

module.exports = {getComments, postComment, getCommentsByTrailId, updateComment, deleteComment};