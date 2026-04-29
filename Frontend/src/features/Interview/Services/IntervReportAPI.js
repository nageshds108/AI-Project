import axios from "axios";

const BASE_URL = "https://ai-project-backend-j2qe.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
 
});

export const getInterviewReport = async ({jobDescription, selfDescription, resumeFile}) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/api/interviews/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}


export const getInterviewReportById = async (id) => {
    const response = await api.get(`/api/interviews/report/${id}`);
    return response.data;
}

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interviews/reports");
    return response.data;
}

export const deleteInterviewReport = async (id) => {
    const response = await api.delete(`/api/interviews/report/${id}`);
    return response.data;
}

export const downloadResumePDF = async (interviewReportId) => {
    const response = await api.get(`/api/interviews/resume/${interviewReportId}/pdf`, {
        responseType: "blob",
    });
    return response.data;
}
