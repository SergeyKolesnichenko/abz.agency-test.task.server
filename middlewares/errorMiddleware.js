module.exports = (err, req, res, next) => {
    let { status, message, errors } = err

    if(!status)
        status = 400

    let result = {
        success: false,
        message: message ? message : "Error.",
        fails: errors ? errors : undefined
    }

    return res.status(status).json(result);
}