const router = require('express').Router();

//Deconstruction of user
const {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
} = require('../../contollers/userController');

//api/users route
router.route('/').get(getAllUsers).post(createUser);

//api/users/:userID
router.route('/:userId').get(getUserById).put(updateUser).delete(deleteUser);

//api/users/:userId/friends post
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;