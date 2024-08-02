const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config;
const UserModel = require("../Models/Users");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({
                    message: 'User is already exist, you can login',
                    success: false
                });
        }
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        return res.status(200)
            .json({
                message: 'SignUp Successfully',
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMessage = "Auth failed email or password is wrong";
        if (!user) {
            return res.status(409)
                .json({
                    message: errorMessage,
                    success: false
                });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(409)
                .json({
                    message: errorMessage,
                    success: false
                });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        return res.status(200)
            .json({
                message: 'Login Success',
                success: true,
                jwtToken,
                email,
                name: user.name,
                rating: user.rating
            });
    } catch (err) {
        return res.status(500)
            .json({
                message: `Internal Server Error: ${err}`,
                success: false
            });
    }
}

const getUser = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await UserModel.findOne({ name: username });
        const total = UserModel.find().count();

        return res.status(200)
            .json({
                message: 'Success',
                success: true,
                name: user.name,
                email: user.email,
                rating: user.rating,
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

const changePaaword = async (req, res) => {
    try {
        const { email, oldpass, newpass } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMessage = "Auth failed old password is wrong";
        if (!user) {
            return res.status(409)
                .json({
                    message: "Invalid email",
                    success: false
                });
        }
        const isPassEqual = await bcrypt.compare(oldpass, user.password);
        if (!isPassEqual) {
            return res.status(409)
                .json({
                    message: errorMessage,
                    success: false
                });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        await UserModel.updateOne({ email: email }, { $set: { password: await bcrypt.hash(newpass, 10) } });

        return res.status(200)
            .json({
                message: 'Password Change Successfully',
                success: true,
                jwtToken,
                email,
                name: user.name
            });
    } catch (err) {
        return res.status(500)
            .json({
                message: `Internal Server Error: ${err}`,
                success: false
            });
    }
}

const rateus = async (req, res) => {
    try {
        const { username, rating } = req.body;
        await UserModel.updateOne({ name: username }, { $set: { rating: rating } });
        const result = await UserModel.aggregate([{
                $match: {
                    rating: { $ne: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $avg: '$rating' }
                }
            }]);

        return res.status(200)
            .json({
                message: 'Success',
                success: true,
                rate: result[0].total
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
    signup,
    login,
    getUser,
    changePaaword,
    rateus
}