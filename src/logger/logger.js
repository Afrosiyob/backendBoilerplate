const { createLogger, transports, format } = require("winston");

const logger = createLogger({
    transports: [new transports.File({ filename: "src/logs/combined.log" })],
});

module.exports = {
    logger,
};