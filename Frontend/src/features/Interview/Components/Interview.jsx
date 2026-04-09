import "../Pages/Interview.css";

function Interview() {
  const technicalQuestions = [
    {
      id: "01",
      question:
        "Explain how you would optimize a slow API endpoint that joins multiple collections.",
      context:
        "Focus on indexing strategy, query shaping, and backend caching decisions.",
    },
    {
      id: "02",
      question:
        "How do you design a fault-tolerant service for handling high-volume interview events?",
      context:
        "Discuss retries, message queues, idempotency keys, and observability.",
    },
  ];

  const behavioralQuestions = [
    {
      id: "01",
      question:
        "Describe a time when you had to resolve a disagreement in code review.",
      context:
        "Highlight how you balanced quality, delivery pressure, and team alignment.",
    },
    {
      id: "02",
      question:
        "Tell me about a project where scope changed late and how you handled it.",
      context:
        "Share tradeoffs, communication style, and final outcome.",
    },
  ];

  const preparationPlan = [
    "Revisit system design fundamentals for distributed services.",
    "Practice 3 mock sessions focused on concise technical communication.",
    "Deepen production-level expertise in CI/CD rollback strategies.",
  ];

  const skillGaps = [
    { label: "Message Queues (Kafka/RabbitMQ)", tone: "danger" },
    { label: "Advanced Docker & CI/CD Pipelines", tone: "warn" },
    { label: "Distributed Systems Design", tone: "warn" },
    { label: "Production-level Redis management", tone: "success" },
  ];

  return (
    <div className="interview-page">
      <div className="interview-shell">
        <aside className="sections-nav">
          <p className="sections-label">Sections</p>
          <button className="section-item is-active-tech" type="button">
            Technical Questions
          </button>
          <button className="section-item is-active-behavioral" type="button">
            Behavioral Questions
          </button>
          <button className="section-item" type="button">
            Preparation Plan
          </button>
        </aside>

        <main className="interview-main">
          <section className="question-block">
            <div className="block-head">
              <h2>Technical Questions</h2>
              <span>{technicalQuestions.length} questions</span>
            </div>
            <div className="question-list">
              {technicalQuestions.map((item) => (
                <article className="question-card" key={item.id}>
                  <p className="question-id">{item.id}</p>
                  <div className="question-copy">
                    <h3>{item.question}</h3>
                    <p>{item.context}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="question-block">
            <div className="block-head">
              <h2>Behavioral Questions</h2>
              <span>{behavioralQuestions.length} questions</span>
            </div>
            <div className="question-list">
              {behavioralQuestions.map((item) => (
                <article className="question-card" key={item.id}>
                  <p className="question-id">{item.id}</p>
                  <div className="question-copy">
                    <h3>{item.question}</h3>
                    <p>{item.context}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="question-block plan-block">
            <div className="block-head">
              <h2>Preparation Plan</h2>
              <span>{preparationPlan.length} steps</span>
            </div>
            <ol className="prep-list">
              {preparationPlan.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </main>

        <aside className="insights-panel">
          <div className="score-card">
            <p className="panel-title">Match Score</p>
            <div className="score-ring">
              <div className="score-core">
                <strong>92</strong>
                <span>%</span>
              </div>
            </div>
            <p className="score-note">Strong match for this role</p>
          </div>

          <div className="gaps-card">
            <p className="panel-title">Skill Gaps</p>
            <div className="gap-list">
              {skillGaps.map((gap) => (
                <span className={`gap-pill ${gap.tone}`} key={gap.label}>
                  {gap.label}
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
