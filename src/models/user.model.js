import { Schema, model } from "mongoose";
import SchemaModel from "../..../../config/database/mongoDBOperation";
const schema = {
  userName: String,
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  mobile_no: Number,
  Address: String,
  gender: String,
  DOB: Date,
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
