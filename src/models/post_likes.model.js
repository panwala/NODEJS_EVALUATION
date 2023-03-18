import { Schema, model } from "mongoose";
import SchemaModel from "../..../../config/database/mongoDBOperation";
const schema = {
  liked_person_userId: { type: Schema.Types.ObjectId, ref: "Users" },
  postId: { type: Schema.Types.ObjectId, ref: "Posts" },
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "Postlikes";
let postLikesSchema = Schema(schema, schemaOption);

let postLikesModel = model(modelName, postLikesSchema);
let Postlikes = new SchemaModel(postLikesModel);

export default Postlikes;
