import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";


function Protected({children}) {
    const {user, Loading} = useAuth();

    if(Loading){
        return <div>Loading...</div>;
    }   
    if(!user){
        return <Navigate to="/login" replace />;
    }


    return children;
}

export default Protected;