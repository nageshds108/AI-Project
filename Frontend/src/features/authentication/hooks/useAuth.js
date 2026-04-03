import { createContext } from "react";
import { useContext } from "react";
import { AuthContext } from "../services/authContext";
import {login, register,logout,getUser} from "../services/authApi";


export const useAuth = () => {
    const context = useContext(AuthContext);
    const {user, setUser, Loading, setLoading} = context;

    const handleLogin = async (email, password) => {
        setLoading(true);
        try{
            const response = await login(email, password);
            if (response?.user) {
                setUser(response.user);
            }
            return response;
        }catch(error){
            console.error('Login error:', error);
            return null;
        }finally{
        setLoading(false);
        }
    }

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        try{
            const response = await register(username, email, password);
            if (response?.user) {
                setUser(response.user);
            }
            return response;
        }
        catch(error){
            console.error('Registration error:', error);
            return null;
        }finally{
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);

        try {
        await logout();
        setUser(null);
        return true;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }finally {
        setLoading(false);
        }
    }

    const handleGetUser = async () => {
        setLoading(true);
        try {
            const response = await getUser();
            if (response?.user) {
                setUser(response.user);
            }
            setLoading(false);
            return response;
        } catch (error) {
            console.error('Get user error:', error);
            setLoading(false);
            return null;
        }
    }

    return { user, setUser, Loading, setLoading, handleLogin, handleRegister, handleLogout, handleGetUser };

}