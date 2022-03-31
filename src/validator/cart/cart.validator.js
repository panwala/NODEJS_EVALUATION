import { body, param, query } from "express-validator";
import { CONSTANTS as CART_CONSTANTS } from "../../constants/cart/cart";
import { CONSTANTS as BOOK_CONSTANTS } from "../../constants/book/book";
import carts from "../../models/cart.model";
import Users from "../../models/user.model";
import Books from "../../models/book.model";
export const validate = (method) => {
  let error = [];
  switch (method) {
    case CART_CONSTANTS.ADD_ITEM_TO_CART: {
      error = [
        body("itemId").custom(ItemExist),
        //body("userId").custom(userExist),
      ];
      break;
    }
    case CART_CONSTANTS.REMOVE_SINGLE_ITEM_FROM_CART: {
      error = [
        query("itemId").custom(bookExist),
        //query("userId").custom(userExist),
      ];
      break;
    }
    case CART_CONSTANTS.REMOVE_ALL_ITEMS_OF_CART_OF_USER: {
      error = [
        /*query("userId").custom(userExist)*/
      ];
      break;
    }

    case CART_CONSTANTS.GET_ALL_ITEMS_OF_CART_OF_USER: {
      error = [
        /*query("userId").custom(userExist)*/
      ];
      break;
    }
  }
  return error;
};

export const userExist = async (value) => {
  let userExist = await Users.findOneDocument({ _id: value });
  if (!userExist) throw new Error("Operation failed User Not Found");
  return value;
};
export const ItemExist = async (value) => {
  console.log("value", value);
  let bookExist = await Books.findOneDocument({ _id: value });
  console.log(bookExist);
  if (!bookExist) throw new Error("Operation failed Item Not Found");
  return value;
};
export const bookExist = async (value) => {
  console.log("value", value);
  let bookExist = await carts.findOneDocument({ itemId: value });
  console.log(bookExist);
  if (!bookExist) throw new Error("Operation failed Item Not Found");
  return value;
};
