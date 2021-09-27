const { Router } = require( "express" );
const {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
} = require( "../controllers/user.controller" );
const {
    validationError,
    checkAuthToken,
} = require( "../middlewares/middlewares" );
const { userCreateValidation } = require( "../validations/user.validation" );

const router = Router();

router.post( "/create", userCreateValidation, validationError, createUser );
router.get( "/list", checkAuthToken, getUsers );
router.get( "/:userId", checkAuthToken, getUser );
router.put( "/:userId", checkAuthToken, updateUser );
router.delete( "/:userId", checkAuthToken, deleteUser );

module.exports = {
    userRouter: router,
};