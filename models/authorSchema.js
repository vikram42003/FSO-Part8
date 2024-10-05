import { Schema, model } from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
});

const Author = model("Author", schema);

export default Author;
