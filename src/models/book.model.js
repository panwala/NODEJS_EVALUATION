import { Schema, model } from "mongoose";
import SchemaModel from "../..../../config/database/mongoDBOperation";
const schema = {
  bookName: String,
  bookCategory: {
    type: String,
  },
  bookAuthor: {
    type: String,
  },
  bookPrice: Number,
  publishedDate: Date,
  pages: Number,
  ownerId: { type: Schema.Types.ObjectId, ref: "Users" },
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "Book";
let bookSchema = Schema(schema, schemaOption);

let bookModel = model(modelName, bookSchema);
let Books = new SchemaModel(bookModel);

export default Books;
