const { check } = require("express-validator");

const authLoginValidation = [
    check("username", "enter username").isLength({ min: 3 }),
    check("password", "enter password").isLength({ min: 6 }),
];

module.exports = {
    authLoginValidation,
};