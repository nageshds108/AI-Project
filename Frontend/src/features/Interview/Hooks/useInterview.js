import {
    getAllInterviewReports,
    getInterviewReportById,
    getInterviewReport,
    deleteInterviewReport,
    downloadResumePDF
} from "../Services/IntervReportAPI";
import { useCallback, useContext } from "react";
import { InterviewContext } from "../Services/InterviewContext";

export const useInterview = () => {

    const context = useContext(InterviewContext);
    const report = context?.report ?? null;
    const setReport = context?.setReport ?? (() => {});
    const loading = context?.loading ?? false;
    const setLoading = context?.setLoading ?? (() => {});
    const loadingMessage = context?.loadingMessage ?? "Loading...";
    const setLoadingMessage = context?.setLoadingMessage ?? (() => {});
    const reports = context?.reports ?? [];
    const setReports = context?.setReports ?? (() => {});

    const extractReport = (result) => {
        if (!result) return null;
        if (result.report) return result.report;
        return result;
    };

    const fetchInterviewReport = useCallback(async ( {jobDescription, selfDescription, resumeFile} ) => {
        setLoadingMessage("Generating your interview report...");
        setLoading(true);
        try {
            const result = await getInterviewReport({jobDescription, selfDescription, resumeFile});
            const normalizedReport = extractReport(result);
            setReport(normalizedReport);
            return normalizedReport;
        }finally {
            setLoading(false);
        }
    }, [setLoading, setLoadingMessage, setReport])
;

    const fetchInterviewReportById = useCallback(async (id) => {
        setLoadingMessage("Loading interview report...");
        setLoading(true);
        try {
            const result = await getInterviewReportById(id);
            const normalizedReport = extractReport(result);
            setReport(normalizedReport);
            return normalizedReport;
        }finally {
            setLoading(false);
        }
    }, [setLoading, setLoadingMessage, setReport]);

    const fetchAllInterviewReports = useCallback(async () => {
        setLoadingMessage("Loading reports...");
        setLoading(true);
        try {
            const result = await getAllInterviewReports();
            const normalizedReports = result?.reports ?? result ?? [];
            setReports(normalizedReports);
            return normalizedReports;
        }finally {
            setLoading(false);
        }}, [setLoading, setLoadingMessage, setReports]);

    const deleteInterviewReportById = useCallback(async (id) => {
        setLoadingMessage("Deleting report...");
        setLoading(true);
        try {
            const result = await deleteInterviewReport(id);
            setReports((prevReports) => prevReports.filter((item) => item._id !== id));
            setReport((prevReport) => (prevReport?._id === id ? null : prevReport));
            return result;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setLoadingMessage, setReport, setReports]);

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const downloadResume = useCallback(async (interviewReportId) => {
        setLoadingMessage("Building resume...");
        setLoading(true);
        try {
            const pdfBlob = await downloadResumePDF(interviewReportId);
            const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } finally {
            setLoading(false);
        }}, [setLoading, setLoadingMessage]);

    return {
        report,
        loading,
        loadingMessage,
        reports,
        fetchInterviewReport,
        fetchInterviewReportById,
        fetchAllInterviewReports,
        deleteInterviewReportById,
        downloadResume
    };
}
