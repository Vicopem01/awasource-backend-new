const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./logger/logger');

// UNCAUGHT EXCEPTIONS
// Application needs to be crashed then a tool will be needed to restart the APP
process.on('uncaughtException', (err) => {
  logger.info('UNCAUGHT EXCEPTION!..');
  logger.info({ err });
  logger.info(err.name, err.message);
  process.exit();
});

const mainServer = async () => {
  const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (!Number.isNaN(port)) {
      return val;
    }

    if (port > 0) {
      return port;
    }

    return false;
  };

  const port = normalizePort(process.env.PORT || '8888');

  try {
    const server = app.listen(port, () => {
      const address = server.address();
      const bind = typeof address === 'string' ? `pipe ${address}` : ` ${port}`;

      logger.info(process.env.NODE_ENV);
      logger.info(`listening on port${bind}`);
      // Catching Exceptions

      // Application does not necessarily need to be crashed
      process.on('unhandledRejection', (err) => {
        logger.info('UNHANDLED REJECTION!...');
        logger.info(err.name, err.message);
        logger.info({ err });
        server.close(() => {
          process.exit();
        });
      });

      process.on('SIGINT', async () => {
        await connectDB.close();
        process.exit(0);
      });
    });
    connectDB();
  } catch (error) {
    logger.error(error);
  }
};

mainServer();
