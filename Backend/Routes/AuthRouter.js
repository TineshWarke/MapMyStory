const {
    signup,
    login,
    changePaaword,
    getUser,
    rateus
} = require('../Controllers/AuthController');
const {
    signupValidation,
    loginValidation,
    changePasswordValidation,
    getUserValidation,
    rateusValidation
} = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/getuser', getUserValidation, getUser);
router.post('/changepass', changePasswordValidation, changePaaword);
router.post('/rateus', rateusValidation, rateus);

module.exports = router;