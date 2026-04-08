import express from 'express';
import authUser from '../Middlewares/authUser.js';
import { generateReport } from '../controllers/intervReportController.js';
import { upload, uploadLogger } from '../Middlewares/fileMidleware.js';



const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Interview API is working' });
});

router.post('/', authUser, uploadLogger, upload.single('resume'), generateReport);

export default router;

