import "../Pages/Home.css";

function Home() {
  return (
    <div className="analysis-page">
      <div className="analysis-shell">
        <header className="analysis-topbar">
          <div className="brand">Luminal AI</div>
          <nav className="top-links">
            <button className="top-link active" type="button">
              Analysis
            </button>
            <button className="top-link" type="button">
              Talent Pool
            </button>
            <button className="top-link" type="button">
              Settings
            </button>
          </nav>
          <div className="top-icons" aria-hidden="true">
            <span className="icon-dot" />
            <span className="icon-dot" />
            <span className="avatar-dot" />
          </div>
        </header>

        <main className="analysis-main">
          <h1>
            Elevate Your <span>Sourcing Strategy</span>
          </h1>
          <p className="hero-subtitle">
            Upload a candidate&apos;s resume to unlock deep behavioral insights and
            alignment scores powered by Luminal&apos;s proprietary LLM.
          </p>

          <section className="upload-card">
            <label className="upload-zone" htmlFor="resume-upload">
              <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" />
              <span className="upload-icon">⬆</span>
              <strong>Drop your resume here</strong>
              <small>
                PDF, DOCX up to 10MB or <span>Click to browse</span>
              </small>
              <div className="upload-tags">
                <span>AI Scanning Ready</span>
                <span>Multi-Format Support</span>
              </div>
            </label>
          </section>

          <section className="context-grid">
            <div className="context-block">
              <p className="context-title">Job Description</p>
              <textarea
                rows={7}
                placeholder="Paste the target job description here to calibrate the AI alignment model..."
              />
            </div>
            <div className="context-block">
              <p className="context-title">Candidate Context</p>
              <textarea
                rows={7}
                placeholder="Add specific requirements, team culture notes, or candidate background for a more nuanced analysis..."
              />
            </div>
          </section>

          <p className="privacy-note">
            Luminal AI processes data securely and does not store sensitive PII.
          </p>

          <button className="start-btn" type="button">
            <span>⚡</span> Start AI Analysis
          </button>

          <div className="stats-row">
            <p>
              <strong>98%</strong> Accuracy Rate
            </p>
            <p>
              <strong>&lt; 3s</strong> Processing Time
            </p>
          </div>

          <p className="footer-mark">Powered by Luminal Architect 1.4</p>
        </main>
      </div>
    </div>
  );
}

export default Home;
