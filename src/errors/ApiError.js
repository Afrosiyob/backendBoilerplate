class ApiError {
    constructor(code, error, message) {
        this.code = code
        this.error = error
        this.message = message
    }

    // Used when user fails to include a field (like no credit card information in a payment form)
    // Also used when user enters incorrect information (Example: Entering different passwords in a password field and password confirmation field).
    static BadRequestError = (error, msg) =>
        new ApiError(400, error, msg)

    // Used when user enters incorrect login information (like username, email or password).
    static UnauthorizedError = (error, msg) =>
        new ApiError(401, error, msg)

    // Used when user is not allowed access the endpoint.
    static ForbiddenError = (msg) =>
        new ApiError(403, null, msg)

    // Used when the endpoint cannot be found.
    static NotFoundError = (msg) =>
        new ApiError(404, null, msg)

    // Used the request sent by the frontend is correct, but there was an error from the backend.
    static ServerError = (msg) =>
        new ApiError(500, null, msg)

}

module.exports = {
    ApiError
}