const { logger } = require("../logger/logger");
const { ApiError } = require("./ApiError")

const errorHandler = (err, req, res, next) => {
    console.error(err)
        // Write errors to log
    logger.error(err);
    if (err instanceof ApiError) {
        res.status(err.code).json({
            error: err.error,
            message: err.message
        })
    } else {
        // Used the request sent by the frontend is correct, but there was an error from the backend.
        res.status(500).json("something went wrong")
    }
}

module.exports = {
    errorHandler
}