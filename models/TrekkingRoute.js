const mongoose = require('mongoose');

const trekkingRouteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Hard'],
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pointsOfInterest: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Configurar el índice de texto en la propiedad 'pointsOfInterest'
trekkingRouteSchema.index({ pointsOfInterest: 'text' });

const TrekkingRoute = mongoose.model('TrekkingRoute', trekkingRouteSchema);

module.exports = TrekkingRoute;
