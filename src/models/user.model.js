import { Schema, model } from "mongoose";
import SchemaModel from "../..../../config/database/mongoDBOperation";
const schema = {
  user_name: String,
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  mobile_no: String,
  address: String,
  gender: String,
  dob: Date,
  no_of_followers: {
    type: Number,
    default: 0,
  },
  no_of_following: {
    type: Number,
    default: 0,
  },
  no_of_posts: {
    type: Number,
    default: 0,
  },
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "User";
let userSchema = Schema(schema, schemaOption);

let userModel = model(modelName, userSchema);
let Users = new SchemaModel(userModel);

export default Users;
