module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = null) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}