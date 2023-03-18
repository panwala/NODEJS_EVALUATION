import mongoose from "mongoose";
import { logger, level } from "../../config/logger/logger";
const URL =
  process.env.MONGO_URL ||
  "mongodb+srv://prempanwala710:mHJKrzkm6SrZ5qxG@cluster0.rmgmcsf.mongodb.net/test";
const OPEN_EVENT = "open";
const ERROR_EVENT = "error";

(async () => {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    logger.log(level.error, `connection error ${e}`);
  }
})();

const db = mongoose.connection;
// initialize(db);
db.once(OPEN_EVENT, async () => {
  logger.log(level.info, `✔ Successfully connected to mongodb database`);
  mongoose.set("debug", true);
  // await defaultAdminData();
});
db.on(ERROR_EVENT, () => {
  logger.log(level.error, `connection error while connection at ${URL}`);
});
