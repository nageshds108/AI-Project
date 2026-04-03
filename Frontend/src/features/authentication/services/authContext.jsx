import {createContext,useState, useEffect} from "react";
import { getUser } from "./authApi";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [Loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await getUser();
                if (response && response.user) {
                    setUser(response.user);
                }
            } catch (error) {
                console.error('Error checking user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        
        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{Loading, setLoading, user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
}