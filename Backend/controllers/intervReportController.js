import { PDFParse } from 'pdf-parse';
import { generateInterviewReport, generateResumePdf } from '../services/aiService.js';
import InterviewReport from '../models/InterviewReportModel.js';


 
async function generateReport(req, res) {
    try {
        
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
        userId: req.user.id || req.user._id,
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


const getReportByInterviewId = async (req, res) => {
    try {
        const { InterviewId } = req.params;
        const report = await InterviewReport.findById(InterviewId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        return res.status(200).json({message : 'Report found successfully ', report});
    } catch (error) {
        console.error('Error fetching interview report:', error);
        res.status(500).json({ message: 'Error fetching report', error: error.message });
    }
};


const getAllReports = async (req, res) => {
    try {
        const currentUserId = req.user.id || req.user._id;
        let reports = await InterviewReport.find({ userId: currentUserId }).sort({ createdAt: -1 }).select('-resume -selfDescription -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan '); // Exclude resume content for list view

        if (!reports.length) {
            const legacyReports = await InterviewReport.find({
                $or: [{ userId: { $exists: false } }, { userId: null }],
            }).sort({ createdAt: -1 });

            if (legacyReports.length) {
                const legacyIds = legacyReports.map((item) => item._id);
                await InterviewReport.updateMany(
                    { _id: { $in: legacyIds } },
                    { $set: { userId: currentUserId } }
                );

                reports = await InterviewReport.find({ userId: currentUserId }).sort({ createdAt: -1 }).select('-resume -selfDescription -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan ');
            }
        }

        return res.status(200).json({ message: 'Reports found successfully', reports });
    } catch (error) {
        console.error('Error fetching interview reports:', error);
        res.status(500).json({ message: 'Error fetching reports', error: error.message });
    }
};

const deleteReportByInterviewId = async (req, res) => {
    try {
        const { InterviewId } = req.params;
        const currentUserId = req.user.id || req.user._id;

        const deletedReport = await InterviewReport.findOneAndDelete({
            _id: InterviewId,
            userId: currentUserId,
        });

        if (!deletedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }

        return res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting interview report:', error);
        return res.status(500).json({ message: 'Error deleting report', error: error.message });
    }
};


async function ResumePDFController(req,res){
    try {
        const { InterviewReportId } = req.params;

        const interviewReport = await InterviewReport.findById(InterviewReportId);
        if (!interviewReport) {
            return res.status(404).json({ message: 'Interview report not found' });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=interview_report_${InterviewReportId}.pdf`,
        });

        return res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating resume PDF:', error);
        return res.status(500).json({ message: 'Error generating resume PDF', error: error.message });
    }
}

export { generateReport, getReportByInterviewId, getAllReports, deleteReportByInterviewId, ResumePDFController };
