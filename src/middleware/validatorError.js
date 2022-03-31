import { validationResult } from "express-validator";
import { BadRequestError } from "../helper/errors/custom-error";

export const ExpressValidatorError = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(new BadRequestError(errors.array()[0].msg));
  next();
};
