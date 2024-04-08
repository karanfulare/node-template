import mongoose from "mongoose";
import { Config } from ".";
import { logger } from "./logger";

mongoose.set("strictQuery", false);

const db = () => {
  if (!Config.MONGO_URL) {
    console.error("MongoDB connection URL is not defined.");
    return;
  }
  mongoose
    .connect(Config.MONGO_URL)
    .then((data) =>
      logger.info(`DB connection established:  ${data.connection.host}`),
    )
    .catch(() => logger.error("error connecting to"));
};

export default db;
