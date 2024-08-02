const Joi = require('joi');

const addStoryValidation = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(55).required(),
        category: Joi.string().required(),
        story: Joi.string().min(20).required(),
        location: Joi.array(),
        anonymous: Joi.boolean(),
        username: Joi.string()
    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request ", error });
    }
    next();
}

const getStoriesValidation = (req, res, next) => {
    try {
        next();
    }
    catch (err) {
        return res.status(403)
            .json({ message: 'Unautorized, JWT token is wrong or expired' });
    }
}

const updateLikeCountValidation = (req, res, next) => {
    try {
        next();
    }
    catch (err) {
        return res.status(403)
            .json({ message: 'Unautorized, JWT token is wrong or expired' });
    }
}

const getStoriesByUserValidation = (req, res, next) => {
    try {
        next();
    }
    catch (err) {
        return res.status(403)
            .json({ message: 'Unautorized, JWT token is wrong or expired' });
    }
}

const deleteMyStoryValidation = (req, res, next) => {
    try {
        next();
    }
    catch (err) {
        return res.status(403)
            .json({ message: 'Unautorized, JWT token is wrong or expired' });
    }
}

const getAboutUsValidation = (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string()
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

const addCommentValidation = (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string(),
            comment: Joi.string().min(3).max(500).required(),
            username: Joi.string()
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
    addStoryValidation,
    getStoriesValidation,
    updateLikeCountValidation,
    getStoriesByUserValidation,
    deleteMyStoryValidation,
    addCommentValidation,
    getAboutUsValidation
}