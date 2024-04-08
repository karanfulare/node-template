import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const { PORT, NODE_ENV, MONGO_URL, cID, Secret, CB, JWT_SECRET } = process.env;

export const Config = {
  PORT,
  NODE_ENV,
  MONGO_URL,
  JWT_SECRET,
  cID,
  Secret,
  CB,
};
