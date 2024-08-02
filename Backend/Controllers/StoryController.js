const bcrypt = require('bcrypt');
require('dotenv').config;
const StoryModel = require("../Models/Stories");
const { ObjectId } = require('mongodb');

const addStory = async (req, res) => {
    try {
        const { title, category, story, location, anonymous, username } = req.body;
        const storyModel = new StoryModel({ title, category, story, location, anonymous, username });

        await storyModel.save();
        return res.status(200)
            .json({
                message: 'Story Saved Successfully',
                success: true
            });
    } catch (err) {
        return res.status(500)
            .json({
                message: `Internal Server Error: ${err}`,
                success: false
            });
    }
}

const getStories = async (req, res) => {
    try {
        const stories = await StoryModel.find().sort({ _id: -1 }).skip((req.body.pageno - 1) * 16).limit(16);
        const allStories = await StoryModel.find();
        toatl = UserModel.count_documents({});

        return res.status(200)
            .json({
                message: 'Success',
                success: true,
                stories: stories,
                allStories: allStories,
                count: total
            });
    } catch (err) {
        return res.status(500)
            .json({
                message: `Internal Server Error: ${err}`,
                success: false
            });
    }
}

const updateLikeCount = async (req, res) => {
    try {
        const { id, username } = req.body;
        const flag = await StoryModel.findOne({ $and: [{ _id: new ObjectId(id) }, { likeby: username }] });
        if (flag) {
            await StoryModel.updateOne({ _id: new ObjectId(id) }, { $inc: { likes: -1 }, $pull: { likeby: username } });
            return res.status(200)
                .json({
                    message: 'Like -1',
                    likes: await StoryModel.findOne({ _id: new ObjectId(id) }),
                    success: true
                });
        }

        const flag2 = await StoryModel.updateOne({ _id: new ObjectId(id) }, { $inc: { likes: 1 }, $push: { likeby: username } });
        return res.status(200)
            .json({
                message: 'Like +1',
                likes: await StoryModel.findOne({ _id: new ObjectId(id) }),
                success: true
            });
    } catch (err) {
        return res.status(500)
            .json({
                message: `Internal Server Error: ${err}`,
                success: false
            });
    }
}

const getStoriesByUser = async (req, res) => {
    try {
        const { username } = req.body;
        const stories = await StoryModel.find({ username: username }).sort({ _id: -1 });

        return res.status(200)
            .json({
                message: 'Success',
                success: true,
                stories: stories
            });
    } catch (err) {
        return res.status(500)
            .json({
                message: `Internal Server Error: ${err}`,
                success: false
            });
    }
}

const deleteMyStory = async (req, res) => {
    try {
        const { id } = req.body;
        await StoryModel.deleteOne({ _id: new ObjectId(id) });

        return res.status(200)
            .json({
                message: 'Success',
                success: true,
            });
    } catch (err) {
        return res.status(500)
            .json({
                message: `Internal Server Error: ${err}`,
                success: false
            });
    }
}

const addComment = async (req, res) => {
    try {
        const { id, comment, username } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $push: {
                comments: {
                    user: username,
                    comment: comment,
                    date: new Date().toISOString().split('T')[0]
                }
            }
        };

        await StoryModel.updateOne(filter, updateDoc);

        return res.status(200)
            .json({
                message: 'Success',
                data: await StoryModel.findOne({ _id: new ObjectId(id) }),
                success: true,
            });
    } catch (err) {
        return res.status(500)
            .json({
                message: `Internal Server Error: ${err}`,
                success: false
            });
    }
}

const getAboutUs = async (req, res) => {
    try {
        const { id } = req.body;
        const story = await StoryModel.findOne({ _id: new ObjectId(id) });

        return res.status(200)
            .json({
                message: 'Success',
                success: true,
                data: story
            });
    } catch (err) {
        return res.status(500)
            .json({
                message: `Internal Server Error: ${err}`,
                success: false
            });
    }
}

module.exports = {
    addStory,
    getStories,
    updateLikeCount,
    getStoriesByUser,
    deleteMyStory,
    addComment,
    getAboutUs
}