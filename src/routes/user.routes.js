const { Router } = require("express");
const { createUser } = require("../controllers/user.controller");
const { validationError } = require("../middlewares/middlewares");
const { userCreateValidation } = require("../validations/user.validation");

const router = Router();



router.post("/create", userCreateValidation, validationError, createUser);

module.exports = {
    userRouter: router,
};