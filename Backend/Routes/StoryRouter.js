const {
    addStory,
    getStories,
    updateLikeCount,
    getStoriesByUser,
    deleteMyStory,
    addComment,
    getAboutUs
} = require('../Controllers/StoryController');
const { addStoryValidation,
    getStoriesValidation,
    updateLikeCountValidation,
    getStoriesByUserValidation,
    deleteMyStoryValidation,
    addCommentValidation,
    getAboutUsValidation
} = require('../Middlewares/StoryValidation');

const router = require('express').Router();

router.post('/savemystory', addStoryValidation, addStory);
router.post('/getstories', getStoriesValidation, getStories);
router.post('/like', updateLikeCountValidation, updateLikeCount);
router.post('/getstoriesbyuser', getStoriesByUserValidation, getStoriesByUser);
router.post('/deletemystory', deleteMyStoryValidation, deleteMyStory);
router.post('/addcomment', addCommentValidation, addComment);
router.post('/getaboutus', getAboutUsValidation, getAboutUs);

module.exports = router;