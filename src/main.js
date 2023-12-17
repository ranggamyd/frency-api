import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

web.listen(8080, () => {
  logger.info("App Start");
});
