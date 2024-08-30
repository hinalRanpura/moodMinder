const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
    comment : {
        type: String,
        required: [true,'Please Enter Your Comment'],
    },
    rating : {
        type: Number,
        required: [true,'Please Enter Your Rating'],
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Feedback",feedbackSchema)