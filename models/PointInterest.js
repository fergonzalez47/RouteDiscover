const mongoose = require("mongoose");

const poiSchema = new mongoose.Schema({
    trekkingRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrekkingRoute",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PointOfInterest = mongoose.model("PointOfInterest", poiSchema);

module.exports = {
    PointOfInterest
};
