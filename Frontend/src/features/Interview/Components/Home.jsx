import "../Pages/Home.css";
import { useInterview } from "../Hooks/useInterview";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authentication/hooks/useAuth";


function Home() {
  const {
    loading,
    loadingMessage,
    fetchInterviewReport,
    fetchAllInterviewReports,
    deleteInterviewReportById,
    reports
  } = useInterview();
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [selectedResumeName, setSelectedResumeName] = useState("");
  const resumeInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReports = async () => {
      try {
        await fetchAllInterviewReports();
      } catch {
        return;
      }
    };

    loadReports();
  }, [fetchAllInterviewReports]);

  const handleGetReport = async () => {
    const selectedResume = resumeInputRef.current?.files?.[0];
    if (!selectedResume) {
      alert("Please upload a resume file.");
      return;
    }
    try {
      const data = await fetchInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile: selectedResume
      });
      if (data?._id) {
        navigate(`/interview/${data._id}`);
      } else {
        alert("Report generated response was incomplete. Please try again.");
      }
    } catch {
      alert("Unable to generate report. Please try again.");
    }
  };

  const handleDeleteReport = async (reportId) => {
    const shouldDelete = window.confirm("Delete this report?");
    if (!shouldDelete) {
      return;
    }

    try {
      await deleteInterviewReportById(reportId);
    } catch {
      alert("Unable to delete report. Please try again.");
    }
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedResumeName(file ? file.name : "");
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>{loadingMessage}</p>
      </div>
    );
  }


  return (
    <div className="analysis-page">
      <div className="analysis-shell">
        <header className="analysis-topbar">
          <div className="brand">Sherpa AI</div>
          <div className="welcome-user">
            Welcome, <span>{user?.username || "User"}</span>
          </div>
        </header>

        <main className="analysis-main">
          <h1>
            Elevate Your <span>Job Readiness</span>
          </h1>
          <p className="hero-subtitle">
            Upload a resume and let the AI Genie illuminate the path to the ideal hire with deep insights and smart matching.
          </p>

          <section className="upload-card">
            <label className={`upload-zone ${selectedResumeName ? "uploaded" : ""}`} htmlFor="resume-upload">
              <input ref={resumeInputRef} id="resume-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
              <span className="upload-icon">&#8593;</span>
              <strong>{selectedResumeName ? "Resume uploaded" : "Drop your resume here"}</strong>
              <small>
                {selectedResumeName ? <span className="uploaded-file-name">{selectedResumeName}</span> : <>PDF, DOCX up to 10MB or <span>Click to browse</span></>}
              </small>
            </label>
          </section>

          <section className="context-grid">
            <div className="context-block">
              <p className="context-title">Job Description</p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={7}
                placeholder="Paste the target job description here..."
              />
            </div>
            <div className="context-block">
              <p className="context-title">Candidate Description</p>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}

                rows={7}
                placeholder="Briefly describe candidate's background, technical skills, strengths, weaknesses and behavioral traits..."
              />
            </div>
          </section>



          <button className="start-btn" type="button" onClick={handleGetReport}>
          <span>&#9889;</span>Generate Report
          </button>



          <section className="reports-section">
            <div className="reports-head">
              <h3 className="reports-title">Generated Reports</h3>
            </div>

            {reports.length > 0 ? (
              <div className="reports-grid">
                {reports.map((report) => (
                  (() => {
                    const rawTitle = report.title || "Untitled Report";
                    const cleanTitle = rawTitle
                      .replace(/^interview\s*report\s*[-:|]?\s*/i, "")
                      .trim();

                    return (
                      <article className="report-mini-card" key={report._id}>
                        <button
                          className="report-card-open"
                          type="button"
                          onClick={() => navigate(`/interview/${report._id}`)}
                        >
                          <h3 className="report-name">{cleanTitle || "Untitled Report"}</h3>
                          <p className="report-meta">Generated on</p>
                          <p className="report-date">
                            {new Date(report.createdAt || report.timestamp || Date.now()).toLocaleDateString()}
                          </p>
                          <p className="report-score">Match Score: {report.matchScore ?? 0}%</p>
                        </button>
                        <button
                          className="report-delete-btn"
                          type="button"
                          onClick={() => handleDeleteReport(report._id)}
                        >
                          Delete
                        </button>
                      </article>
                    );
                  })()
                ))}
              </div>
            ) : (
              <p className="reports-empty">No reports yet. Generate one to see it here.</p>
            )}
          </section>

          <p className="footer-mark">Powered by LLM</p>
        </main>
      </div>

    </div>
  );
}

export default Home;
