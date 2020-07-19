/*

What we want todo here is create our own storage function that uploads files to
our cdn github repository.

Our API Server doesn't much space so we don't want to host these files locally.

^^^^^

maybe we could also, using the exordium-cdn repo, make a nodejs script that listens
for new files that are created, updated or removed, push the changes via git push,
then remove the files without pushing that they were deleted.

*/

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Allow the following mimetypes
const mimetypes = ['image/jpg', 'image/jpeg', 'image/png'];

// Storage Location and File Naming
const storageBlog = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = path.join(__dirname, '../../uploads/blog');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        let fileName = crypto.randomBytes(18).toString('hex')
        let fileExtension = path.extname(file.originalname).split('.')[1];

        callback(null, fileName + '.' + fileExtension);
    }
});

// Only Allow Images
const fileFilter = (req, file, callback) => {
    if (mimetypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

// Upload The File
const upload = multer({
    storage: storageBlog,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
