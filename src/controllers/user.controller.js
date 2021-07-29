const { User } = require("../models/models");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { ApiError } = require("../errors/ApiError");
const { logger } = require("../logger/logger");

// ANCHOR create user controller
const createUser = async(req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({ username, password: hashedPassword });
        await newUser.save();
        res.status(200).json({ message: "new user created" });
    } else {
        if (user instanceof User) {
            logger.error("same username");
            next(
                ApiError.BadRequestError(
                    `failed ${username}`,
                    "please enter other username"
                )
            );
        }
    }
};

module.exports = {
    createUser,
};