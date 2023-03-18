import { Schema, model } from "mongoose";
import SchemaModel from "../..../../config/database/mongoDBOperation";
const schema = {
  comment_person_userId: { type: Schema.Types.ObjectId, ref: "Users" },
  postId: { type: Schema.Types.ObjectId, ref: "Posts" },
  comment: String,
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "Postcomment";
let postCommentSchema = Schema(schema, schemaOption);

let postCommentModel = model(modelName, postCommentSchema);
let Postcomment = new SchemaModel(postCommentModel);

export default Postcomment;
