const express = require("express")
const serveIndex = require("serve-index")
const path = require("path")
const morgan = require("morgan")
const { logger } = require("../src/logger/logger")
const { userRouter } = require("../src/routes/user.routes")
const { errorHandler } = require("../src/errors/ErrorHandler")
const winston = require("winston");
const config = require("config");
const { authRouter } = require("../src/routes/auth.routes")
const http = require("http");
const socketIO = require("socket.io");


const app = express()

app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: false }))

app.use(
    "/public",
    express.static("public"),
    serveIndex("public", { icons: true })
)

app.use("/public", express.static(path.join(__dirname, "public")))

if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    // Write log
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

const PORT = config.get("PORT") || process.env.PORT || 5000;

let server = http.createServer(app);

let io = socketIO(server);

server.listen(PORT, () => console.log(`Server is running on ${ PORT }`));

module.exports = {
    io
}