import mongoose from "mongoose";

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  favoriteGenre: String,
});

const userSchema = mongoose.model("User", schema);

export default userSchema;
