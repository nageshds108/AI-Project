import "../Pages/Interview.css";
import { useInterview } from "../Hooks/useInterview";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Interview() {
  const { id } = useParams();
  const { report, loading, loadingMessage, fetchInterviewReportById, downloadResume } = useInterview();
  const [activeSection, setActiveSection] = useState("technical");

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchInterviewReportById(id).catch(() => {});
  }, [id, fetchInterviewReportById]);

  const sourceReport = report ?? {};
  const {
    technicalQuestions = [],
    behavioralQuestions = [],
    preparationPlan = [],
    skillGaps = [],
    matchScore = 0,
  } = sourceReport;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>{loadingMessage}</p>
      </div>
    );
  }

  const hasAnyData =
    technicalQuestions.length > 0 ||
    behavioralQuestions.length > 0 ||
    preparationPlan.length > 0 ||
    skillGaps.length > 0 ||
    matchScore > 0;

  if (!hasAnyData) {
    return (
      <div className="loading-screen">
        <p>No interview data found yet. Generate a report from the home page first.</p>
      </div>
    );
  }

  const getGapTone = (severity) => {
    if (severity === "high") return "danger";
    if (severity === "medium") return "warn";
    return "success";
  };

  const renderActiveSection = () => {
    if (activeSection === "technical") {
      return (
        <section className="question-block">
          <div className="block-head">
            <h2>Technical Questions</h2>
          </div>
          <div className="question-list">
            {technicalQuestions.map((item, index) => (
              <article className="question-card" key={`${item.question}-${index}`}>
                <p className="question-id">{index + 1}</p>
                <div className="question-copy">
                  <h3>{item.question}</h3>
                  <p>{item.intention}</p>
                  <p>{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeSection === "behavioral") {
      return (
        <section className="question-block">
          <div className="block-head">
            <h2>Behavioral Questions</h2>
          </div>
          <div className="question-list">
            {behavioralQuestions.map((item, index) => (
              <article className="question-card" key={`${item.question}-${index}`}>
                <p className="question-id">{index + 1}</p>
                <div className="question-copy">
                  <h3>{item.question}</h3>
                  <p>{item.intention}</p>
                  <p>{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="question-block plan-block">
        <div className="block-head">
          <h2>Preparation Plan</h2>
        </div>
        <ol className="prep-list">
          {preparationPlan.map((step, index) => (
            <li key={`${step.day}-${index}`}>
              Day {step.day}: {step.focus}
              {Array.isArray(step.tasks) && step.tasks.length > 0
                ? ` - ${step.tasks.join(", ")}`
                : ""}
            </li>
          ))}
        </ol>
      </section>
    );
  };

  const handleBuildResume = async () => {
    if (!id) {
      return;
    }

    try {
      await downloadResume(id);
    } catch {
      alert("Unable to build resume. Please try again.");
    }
  };

  return (
    <div className="interview-page">
      <div className="interview-shell">
        <aside className="sections-nav">
          <p className="sections-label">Sections</p>
          <button
            className={`section-item ${activeSection === "technical" ? "is-active-behavioral" : ""}`}
            type="button"
            onClick={() => setActiveSection("technical")}
          >
            Technical Questions
          </button>
          <button
            className={`section-item ${activeSection === "behavioral" ? "is-active-behavioral" : ""}`}
            type="button"
            onClick={() => setActiveSection("behavioral")}
          >
            Behavioral Questions
          </button>
          <button
            className={`section-item ${activeSection === "preparation" ? "is-active-behavioral" : ""}`}
            type="button"
            onClick={() => setActiveSection("preparation")}
          >
            Preparation Plan
          </button>
          <button className="build-resume-btn" type="button" onClick={handleBuildResume}>
            <i className="fa-solid fa-screwdriver-wrench" /> 
            Build Resume
          </button>
        </aside>

        <main className="interview-main">{renderActiveSection()}</main>

        <aside className="insights-panel">
          <div className="score-card">
            <p className="panel-title">Match Score</p>
            <div className="score-ring">
              <div className="score-core">
                <strong>{matchScore}</strong>
                <span>%</span>
              </div>
            </div>
            <p className="score-note">
              {matchScore >= 80
                ? "Strong match for this role"
                : matchScore >= 60
                  ? "Moderate match for this role"
                  : "Needs focused preparation for this role"}
            </p>
          </div>

          <div className="gaps-card">
            <p className="panel-title">Skill Gaps</p>
            <div className="gap-list">
              {skillGaps.map((gap) => (
                <span className={`gap-pill ${getGapTone(gap.severity)}`} key={`${gap.skill}-${gap.severity}`}>
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Interview;
