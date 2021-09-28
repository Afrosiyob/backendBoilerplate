const { User } = require("../models/models");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { ApiError } = require("../errors/ApiError");
const { logger } = require("../logger/logger");
const { map } = require("lodash");

// ANCHOR create user controller
const createUser = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({ username, password: hashedPassword });
        await newUser.save();
        res.status(200).json({
            data: {
                id: newUser.id,
                role: newUser.role,
                username: newUser.username,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            },
            message: "new user created",
        });
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

// ANCHOR get all users without admin
const getUsers = async (req, res, next) => {
    const { page, size } = req.query;
    // /api/user/list?page=1&size=5
    await User.findAndCountAll({
        where: { role: "user" },
        offset: parseInt(page),
        limit: parseInt(size),
    })
        .then((users) => {
            res.status(200).json({
                data: {
                    count: users.count,
                    users: users.rows.map((user) => ({
                        id: user.id,
                        username: user.username,
                        role: user.role,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    })),
                },
            });
        })
        .catch((error) => {
            console.log(error);
            logger.error(error);
            next(ApiError.NotFoundError("user not founded or some error"));
        });
};

// ANCHOR get user controller
const getUser = async (req, res, next) => {
    const { userId } = req.params;
    await User.findOne({ where: { id: userId } })
        .then((user) => {
            if (user.role === "admin") {
                next(
                    ApiError.ForbiddenError("u cant take information about this userId")
                );
            } else {
                res.status(200).json({
                    data: user,
                    message: "single user data",
                });
            }
        })
        .catch((error) => {
            console.log(error);
            logger.error(error);
            next(ApiError.BadRequestError(error, "wrong user id"));
        });
};

// ANCHOR update user
const updateUser = async (req, res, next) => {
    const { userId: userIdParam } = req.params;
    const { userId } = req.user;
    const { username } = req.body;
    await User.findByPk(userIdParam)
        .then(async (user) => {
            const { role } = await User.findByPk(userId);
            if (userId === user.id) {
                try {
                    user.username = username;
                    await user.save();
                    res.status(200).json({
                        data: {
                            id: user.id,
                            username: user.username,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                        },
                        message: "user updated",
                    });
                } catch (error) {
                    logger.error(error);
                    next(ApiError.ServerError(error));
                }
            } else if (role === "admin") {
                try {
                    user.username = username;
                    await user.save();
                    res.status(200).json({
                        data: {
                            id: user.id,
                            username: user.username,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                        },
                        message: "user updated",
                    });
                } catch (error) {
                    logger.error(error);
                    next(ApiError.ServerError(error));
                }
            } else {
                next(ApiError.ForbiddenError("you dont have a permission"));
            }
        })
        .catch((error) => {
            console.log(error);
            logger.error(error);
            next(ApiError.NotFoundError("user not founded or some error"));
        });
};

// ANCHOR delete user
const deleteUser = async (req, res, next) => {
    const { userId: userIdParam } = req.params;
    const { userId } = req.user;
    await User.findByPk(userIdParam)
        .then(async (user) => {
            const { role } = await User.findByPk(userId);
            if (role === "admin") {
                await User.destroy({ where: { id: user.id } }).then((deletedUser) => {
                    console.log(deletedUser);
                    res.status(200).json({ message: "user deleted" });
                });
            }
        })
        .catch((error) => {
            console.log(error);
            logger.error(error);
            next(ApiError.NotFoundError("user not founded or some error"));
        });
};

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};