const path = require("path");
const multer = require('multer')
const fs = require("fs");

try {
    fs.mkdirSync(path.join(__dirname, '../images/users/'))
} catch (err) {
    if (err.code !== 'EEXIST') throw err
}

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../images/users/'),
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
    limits: {
        fileSize: 1024 * 5
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    } }).single("photo");

module.exports = upload;
