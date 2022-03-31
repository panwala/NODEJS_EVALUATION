import { Schema, model } from "mongoose";
import SchemaModel from "../..../../config/database/mongoDBOperation";
const schema = {
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  itemId: { type: Schema.Types.ObjectId, ref: "Books" },
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "Cart";
let cartSchema = Schema(schema, schemaOption);

let cartModel = model(modelName, cartSchema);
let Carts = new SchemaModel(cartModel);

export default Carts;
