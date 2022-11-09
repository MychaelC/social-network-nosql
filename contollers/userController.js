const { User, Thought } = require("../models");

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
        //a '-' indicates we do not want to return this data '__v'
        select: "-__v",
      })
      //select statement is attached to the parent user data
      .select("-__v")
      //Sort based on User Id and return the newest first
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // create a new user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },
  //update a user
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user with that ID" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
      .populate({
        path: "thoughts",
        //a '-' indicates we do not want to return this data '__v'
        select: "-__v",
      })
      //select statement is attached to the parent user data
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No User found with that Id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // add a friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      //adding addToSet it will add unique data to the array
      { $addToSet: { friends: { _id: params.friendId } } },
      { new: true, runValidators: true }
    )
      .then((dbFriendData) => {
        if (!dbFriendData) {
          res.status(404).json({ message: "No User found with that Id!" });
          return;
        }
        res.json(dbFriendData);
      })
      .catch((err) => res.json(err));
  },

  // delete a friend by the user
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: { _id: params.friendId } } },
      { new: true }
    )
      .then((dbFriendData) => res.json(dbFriendData))
      .catch((err) => res.json(err));
  },

  //delete a user
  deleteUser({ params }, res) {
    User.find({})
      .populate({
        path: "thoughts",
        //a '-' indicates we do not want to return this data '__v'
        select: "-__v",
      })
      .then((thoughtData) =>
        //Iterate through users thoughts
        thoughtData[0].thoughts.forEach((item) => {
          //Export the ID object and json stringify it to remove the ""
          let thoughtId = JSON.stringify(item._id).replace(/['"]+/g, "");

          // for each thought if it matches the users thought ID delete
          Thought.findOneAndDelete({ _id: thoughtId }).then(
            (deletedThought) => {
              if (!deletedThought) {
                return res
                  .status(404)
                  .json({ message: "No Thought with this ID!" });
              }
              User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
              );
            }
          );
        })
      )
      .then(() => {
        User.findOneAndDelete({ _id: params.userId })
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: "No User found with this ID!" });
              return;
            }
            res.json("User and Thoughts deleted!");
          })
          .catch((err) => res.status(400).json(err));
      });
  },
};

module.exports = userController;
