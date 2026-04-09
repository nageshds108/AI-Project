import "../Pages/auth.css";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import {useAuth} from "../hooks/useAuth";
import AuthLoader from "./AuthLoader";



function Register() {
     const [username, setUsername] = useState("");
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const {handleRegister, Loading} = useAuth();
     const navigate = useNavigate();

     const handleSubmit=async (e)=>{

         e.preventDefault()
        const result = await handleRegister(username, email, password);
        if (result && result.user) {
            navigate("/");
        }

        }

     if(Loading){
        return <AuthLoader message="Creating your account..." />
    }
    return (  
        <div className="form-container">
        <div className="auth-card">
            <h1>Register</h1>
            <form  onSubmit={handleSubmit}>
                <div className="inp-grp">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="inp-grp">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div  className="inp-grp">
                <label htmlFor="password">Password</label>
                <input type="password"  id="password"  name="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <button className="btn btn-primary">submit</button>
                <p>Already have an account? <Link to="/login">Login</Link> </p>

            </form>
        </div>
        </div>
    );
}

export default Register ;
