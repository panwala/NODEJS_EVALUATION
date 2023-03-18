import { Schema, model } from "mongoose";
import SchemaModel from "../..../../config/database/mongoDBOperation";
const schema = {
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  following_person_user_Id: { type: Schema.Types.ObjectId, ref: "Users" },
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "Followers";
let followersSchema = Schema(schema, schemaOption);

let followersModel = model(modelName, followersSchema);
let Followers = new SchemaModel(followersModel);

export default Followers;
