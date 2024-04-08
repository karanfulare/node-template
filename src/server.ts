import app from "./app";
import { Config } from "./config";
import { logger } from "./config/logger";

const startServer = function () {
  try {
    app.listen(Config.PORT, () => {
      // eslint-disable-next-line no-console
      logger.debug("Hello");
      logger.info(`Listening on PORT ${Config.PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    if (err instanceof Error) {
      logger.error(err.message);
      process.exit(1);
    }
  }
};
startServer();
