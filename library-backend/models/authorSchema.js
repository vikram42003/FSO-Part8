import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
    },
    born: {
      type: Number,
    },
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    virtuals: {
      bookCount: {
        get() {
          return this.books.length;
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Author = model("Author", schema);

export default Author;
