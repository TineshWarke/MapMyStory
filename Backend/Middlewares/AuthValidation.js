const Joi = require('joi');

const signupValidation = (req, res, next) => {
    try {
        const schema = Joi.object({
            name: Joi.string().min(3).max(25).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(4).max(100).required(),
            mystories: Joi.array()
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400)
                .json({ message: "Bad request ", error });
        }
        next();
    }
    catch (err) {
        return res.status(403)
            .json({ message: 'Unautorized, JWT token is wrong or expired' });
    }
}

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request ", error });
    }
    next();
}

const getUserValidation = (req, res, next) => {
    try {
        next();
    }
    catch (err) {
        return res.status(403)
            .json({ message: 'Unautorized, JWT token is wrong or expired' });
    }
}

const changePasswordValidation = (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            oldpass: Joi.string().min(4).max(100).required(),
            newpass: Joi.string().min(4).max(100).required()
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400)
                .json({ message: "Bad request ", error });
        }
        next();
    }
    catch (err) {
        return res.status(403)
            .json({ message: 'Unautorized, JWT token is wrong or expired' });
    }
}

const rateusValidation = (req, res, next) => {
    try {
        const schema = Joi.object({
            username: Joi.string().required(),
            rating: Joi.number()
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400)
                .json({ message: "Bad request ", error });
        }
        next();
    }
    catch (err) {
        return res.status(403)
            .json({ message: 'Unautorized, JWT token is wrong or expired' });
    }
}

module.exports = {
    signupValidation,
    loginValidation,
    getUserValidation,
    changePasswordValidation,
    rateusValidation
}