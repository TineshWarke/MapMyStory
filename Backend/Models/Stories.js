const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    location: {
        type: Array,
    },
    anonymous: {
        type: Boolean,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likeby: {
        type: Array
    },
    comments: [{
        username: { type: String, default: 'Tinesh Warke' },
        content: { type: String, default: 'Thank you for sharing your story!' },
        date: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const StoryModel = mongoose.model('stories', StorySchema);
module.exports = StoryModel;