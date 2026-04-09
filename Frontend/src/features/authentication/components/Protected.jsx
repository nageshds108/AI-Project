import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import AuthLoader from "./AuthLoader";


function Protected({children}) {
    const {user, Loading} = useAuth();

    if(Loading){
        return <AuthLoader message="Loading your dashboard..." />;
    }   
    if(!user){
        return <Navigate to="/login" replace />;
    }


    return children;
}

export default Protected;
