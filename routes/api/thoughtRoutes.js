const router = require('express').Router();

//Deconstruction of user
const {
    getAllThoughts,
    getThoughtById,
    addThought,
    removeThought,
    updateThought,
    addReaction,
    removeReaction,
} = require('../../contollers/thoughtController');

//api/thoughts route
router.route('/:userId').post(addThought);

//api/thoughts/:thoughtId
router.route('/:thoughtId').get(getThoughtById).put(updateThought);

// api/thoughts/:userId/:thoughtId
router.route('/:userId/:thoughtId').delete(removeThought);

//api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction);

//api/users/:userId/friends post
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

//api/thoughts
router.route('/').get(getAllThoughts);

module.exports = router;