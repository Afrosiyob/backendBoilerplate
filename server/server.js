const express = require("express");
const serveIndex = require("serve-index");
const path = require("path");
const morgan = require("morgan");
const { logger } = require("../src/logger/logger");
const { userRouter } = require("../src/routes/user.routes");
const { errorHandler } = require("../src/errors/ErrorHandler");
const winston = require("winston");
const config = require("config");
const { authRouter } = require("../src/routes/auth.routes");

//  ANCHOR create app server
const app = express();

// set access json req.body
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));

// ANCHOR create static files
app.use(
    "/public",
    express.static("public"),
    serveIndex("public", { icons: true })
);

// second way create static files
app.use("/public", express.static(path.join(__dirname, "public")));

// ANCHOR show request to console only development
if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    // Write log
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

// ANCHOR create routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// ANCHOR error handler
app.use(errorHandler);

const PORT = config.get("PORT") || process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));