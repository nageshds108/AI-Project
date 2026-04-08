import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024
    }
});

// Middleware to log upload details
const uploadLogger = (req, res, next) => {
    console.log('Upload attempt - Files:', req.files, 'File:', req.file);
    next();
};

export { upload, uploadLogger };