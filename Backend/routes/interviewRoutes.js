import express from 'express';
import authUser from '../Middlewares/authUser.js';
import { generateReport } from '../controllers/intervReportController.js';
import { upload, uploadLogger } from '../Middlewares/fileMidleware.js';
import { getReportByInterviewId, getAllReports, deleteReportByInterviewId, ResumePDFController } from '../controllers/intervReportController.js';



const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Interview API is working' });
});

router.post('/', authUser, uploadLogger, upload.single('resume'), generateReport);

router.get('/report/:InterviewId', authUser, getReportByInterviewId);

router.get('/reports', authUser, getAllReports);

router.delete('/report/:InterviewId', authUser, deleteReportByInterviewId);

router.get('/resume/:InterviewReportId/pdf', authUser, ResumePDFController);

export default router;

