const { Thought, User } = require("../models");

const thoughtController = {
  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No user with that ID" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
//remove the thought
removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(( deletedThought ) => {
        if (!deletedThought) {
            return res.status(404).json({ message: 'No Thought with this id!'});
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No user with that ID" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
//update thought
updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.userId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No Thought found with that ID" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
    },
    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
          .populate({
            path: 'reactions',
            //a '-' indicates we do not want to return this data '__v'
            select: "-__v",
          })
          //select statement is attached to the parent user data
          .select("-__v")
          //Sort based on User Id and return the newest first
          .sort({ _id: -1 })
          .then((dbThoughtData) => res.json(dbThoughtData))
          .catch((err) => {
            console.log(err);
            res.status(400).json(err);
          });
        },

        getThoughtById({ params }, res) {
            Thought.findOne({ _id: params.thoughtId })
              .populate({
                path: 'reactions',
                //a '-' indicates we do not want to return this data '__v'
                select: '-__v',
              })
              //select statement is attached to the parent user data
              .select('-__v')
              .then((dbThoughtData) => {
                if (!dbThoughtData) {
                  res.status(404).json({ message: 'No Thought found with that Id!' });
                  return;
                }
                res.json(dbThoughtData);
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json(err);
              });
          },

          addReaction({ params, body }, res) {
            Thought.findOneAndUpdate(
              { _id: params.thoughtId },
              //adding addToSet it will add unique data to the array
              { $push: { reactions: body } },
              { new: true, runValidators: true }
            )
              .then((dbThoughtData) => {
                if (!dbThoughtData) {
                  res.status(404).json({ message: 'No thought found with that Id!' });
                  return;
                }
                res.json(dbThoughtData);
              })
              .catch((err) => res.json(err));
          },
// remove reaction
removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      //adding addToSet it will add unique data to the array
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.json(err));
  },

};

module.exports = thoughtController;
