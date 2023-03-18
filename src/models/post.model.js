import { Schema, model } from "mongoose";
import SchemaModel from "../..../../config/database/mongoDBOperation";
const schema = {
  post_title: String,
  post_description: {
    type: String,
  },
  no_of_likes: {
    type: Number,
    default: 0,
  },
  no_of_comments: {
    type: Number,
    default: 0,
  },
  ownerId: { type: Schema.Types.ObjectId, ref: "Users" },
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "Posts";
let postSchema = Schema(schema, schemaOption);

let postModel = model(modelName, postSchema);
let Posts = new SchemaModel(postModel);

export default Posts;
