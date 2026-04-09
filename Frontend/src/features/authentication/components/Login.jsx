import "../Pages/auth.css";
import { Link ,useNavigate} from "react-router-dom";
import { useState } from "react";
import {useAuth} from "../hooks/useAuth";
import AuthLoader from "./AuthLoader";

function Login() {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const {handleLogin, Loading} = useAuth();
     const navigate = useNavigate();

     const handleSubmit=async (e)=>{
        e.preventDefault()
        const result = await handleLogin(email, password);
        if (result && result.user) {
            navigate("/");
        }
        }

    if(Loading){
        return <AuthLoader message="Signing you in..." />
    }

    return ( 
        <>
        <div className="form-container">
            <div className="auth-card">
                <h1>Login</h1>
                <form  onSubmit={handleSubmit}>
                    <div className="inp-grp">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div  className="inp-grp">
                    <label htmlFor="password">Password</label>
                    <input type="password"  id="password"  name="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                    <button className="btn btn-primary">submit</button>
                    <p>Don't have an account? <Link to="/register">Register</Link> </p>
                </form>
            </div>
        </div>
        </>
     );
}

export default Login;
