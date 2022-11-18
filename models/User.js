const { Schema, model } = require('mongoose');

let validateEmail = function (email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const UserSchema = new Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        required: 'Email address required!',
        validate: [validateEmail, 'Please enter a valid email'],
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email',
        ]
      },
      friends: [
        {
          type: Schema.Types.ObjectId,
            ref: 'User',
        }
      ],
      thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought',
        },
      ],
    },
    {
      toJSON: {
        virtuals: true,
        getters: true,
      },
      id: false,
    }
  );
  
  UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
  });

    UserSchema.virtual('thoughtCount').get(function () {
        return this.friends.length;
    });

    //create user model using the user schema and export it
    const User = model('User', UserSchema);

  module.exports = User;