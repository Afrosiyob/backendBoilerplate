const { User, Token } = require("../models/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");
const nodemailer = require("nodemailer");
const { logger } = require("../logger/logger");

const {
    generateAccessToken,
    generateRefreshToken,
    replaceFromDBRefreshToken,
} = require("../helpers/token.helper");
const { ApiError } = require("../errors/ApiError");

const updateTokens = async(userId) => {
    const { accessToken } = generateAccessToken(userId);
    const { tokenId, refreshToken } = generateRefreshToken();
    await replaceFromDBRefreshToken(tokenId, userId);

    return {
        accessToken,
        refreshToken,
    };
};

const authLogin = async(req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (user === null) {
        next(ApiError.NotFoundError(`${username} not found`));
    } else {
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            next(
                ApiError.BadRequestError(
                    "failed password",
                    "please enter currect password"
                )
            );
        } else {
            const { id } = user;

            const token_info = await updateTokens(id).then((tokens) => tokens);

            res.status(200).json({
                data: {
                    // token,
                    token_info,
                    user_info: _.pick(user, ["username", "role"]),
                },
                message: "user info ",
            });
        }
    }
};

const authLogout = async(req, res, next) => {
    const { userId } = req.user;
    await Token.findOne({ where: { UserId: userId } })
        .then(async(token) => {
            await Token.destroy({ where: { UserId: token.UserId } })
                .then(() => {
                    res.status(200).json({ message: "user logged out" });
                })
                .catch((error) => {
                    logger.error(error);
                    next(ApiError.BadRequestError(error, "user didnt logged out"));
                });
        })
        .catch((error) => {
            logger.error(error);
            next(ApiError.NotFoundError("user not founded"));
        });
};

const refreshTokens = async(req, res, next) => {
    const { refreshToken } = req.body;
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, config.get("jwtSecret"));
        const { type } = decoded;
        if (type && type !== "refresh") {
            next(ApiError.BadRequestError("error", "this is not a refresh token"));
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            next(ApiError.BadRequestError(error, "token  exparied"));
        } else if (error instanceof jwt.JsonWebTokenError) {
            next(ApiError.BadRequestError(error, "invalid token"));
        }
    }
    const { tokenId } = decoded;
    await Token.findOne({ where: { tokenId } })
        .then((token) => {
            const { UserId } = token;
            return updateTokens(UserId);
        })
        .then((tokens) => {
            res.status(200).json({
                data: tokens,
                message: "new tokens",
            });
        })
        .catch((error) => {
            logger.error(error);
            next(ApiError.BadRequestError(error, "not founded token from DB"));
        });
};

const authMe = async(req, res, next) => {
    const { userId } = req.user;
    const user = await User.findByPk(userId);
    if (!user) {
        next(ApiError.UnauthorizedError("failid token", "wrong or invalid token"));
    } else {
        res.status(200).json({
            data: { user_info: _.pick(user, ["username", "role"]) },
            message: "user info",
        });

        // Send message
        // let transporter = nodemailer.createTransport( {
        //     service: "gmail",
        //     auth: {
        //         user: "leoafrosiyob.a97@gmail.com",
        //         pass: "2230102ab",
        //     },
        // } );

        // let mailOptions = {
        //     from: "leoafrosiyob.a97@gmail.com",
        //     to: "noligarx@gmail.com",
        //     subject: "Nodirboy cho tam nma gap.....",
        //     text: "ishla yaxshimi buvottimi chichib kelamizmi",
        //     html: "<b>Hello world?</b> <img src='https://cq-esports.com/storage/uploads/images/83795/image8.jpg' width='200px' alt='dota image' />", // html body
        // };

        // transporter.sendMail( mailOptions, ( err, data ) => {
        //     if ( err ) {
        //         console.log( err );
        //         console.log( "error send mail message" );
        //     } else {
        //         console.log( "success send mail message" );
        //     }
        // } );
    }
};

module.exports = {
    authLogin,
    authMe,
    refreshTokens,
    authLogout,
};