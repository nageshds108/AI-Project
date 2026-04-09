import "../Pages/auth.css";

function AuthLoader({ message = "Preparing your workspace..." }) {
  return (
    <div className="auth-loader-screen" role="status" aria-live="polite">
      <div className="auth-loader-orbit">
        <span className="auth-loader-core" />
      </div>
      <p>{message}</p>
    </div>
  );
}

export default AuthLoader;
