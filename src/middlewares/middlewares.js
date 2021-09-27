const { validationResult } = require("express-validator");
const { ApiError } = require("../errors/ApiError");
const config = require("config");
const jwt = require("jsonwebtoken");
const { User } = require("../models/models");
const path = require("path");
const multer = require("multer");


const validationError = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(ApiError.BadRequestError(errors.array(), "badrequest error"));
    } else {
        await next();
    }
};

const checkAuthToken = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        await next();
    } else {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
        }
        if (!token) {
            await next(ApiError.UnauthorizedError("faild token", "auth error"));
        } else {
            try {
                let decoded = jwt.verify(token, config.get("jwtSecret"));
                req.user = decoded;
                res.setHeader("Last-Modified", new Date().toUTCString());
                await next();
            } catch (error) {
                if (error instanceof jwt.TokenExpiredError) {
                    next(ApiError.BadRequestError(error, "token  exparied"));
                } else if (error instanceof jwt.JsonWebTokenError) {
                    next(ApiError.BadRequestError(error, "invalid token"));
                }
            }
        }
    }
};

// Check permissions
const setPermissions = (permissions) => async (req, res, next) => {
    const { userId } = req.user;
    const user = await User.findByPk(userId);
    if (!user) {
        next(ApiError.UnauthorizedError("faild role", "no role"));
    } else {
        const { role } = user;
        if (permissions.includes(role)) {
            await next();
        } else {
            next(ApiError.ForbiddenError("no permession"));
        }
    }
};


// Set
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./public/images`);
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

//Init Upload
const upload = multer({
    storage: storage,
}).single("image");

module.exports = {
    validationError,
    checkAuthToken,
    setPermissions,
    upload,
};