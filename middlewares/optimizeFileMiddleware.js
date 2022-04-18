const tinify = require('../config/tinifyImage')

module.exports = async (req, res, next) => {
    try{
        const { filename } = req.file

        const source = tinify.fromFile(`images/users/${filename}`);
        const resized = source.resize({
            method: "fit",
            width: 70,
            height: 70
        });

        await resized.toFile(`images/users/${filename}`);

        next()
    }catch (e) {
        next(e)
    }
}
