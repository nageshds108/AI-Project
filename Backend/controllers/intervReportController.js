import { PDFParse } from 'pdf-parse';
import { generateInterviewReport } from '../services/aiService.js';
import InterviewReport from '../models/InterviewReportModel.js';



 
async function generateReport(req, res) {
    try {
        console.log('=== generateReport Debug ===');
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);
        console.log('req.headers:', req.headers);
        
        if (!req.file) {
            console.log('No file attached');
            return res.status(400).json({ 
                message: 'Resume file is required',
                debug: {
                    fileReceived: !!req.file,
                    bodyKeys: Object.keys(req.body || {})
                }
            });
        }

        const resumeContent = await new PDFParse(Uint8Array.from(req.file.buffer)).getText();
        const { selfDescription, jobDescription } = req.body;


    const InterviewReportData = await generateInterviewReport({ 
        resume: resumeContent.text, 
        selfDescription,
        jobDescription
    });

    const interViewReport = await InterviewReport.create({
        userId: req.user._id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...InterviewReportData
    });

    return res.status(201).json(interViewReport);
    } catch (error) {
        console.error('Error generating interview report:', error);
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
}

export { generateReport };