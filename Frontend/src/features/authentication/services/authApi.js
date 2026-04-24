import axios from 'axios';
const API_URL = 'http://localhost:8080/api/auth';

export async function register (username, email, password) {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password
    },{withCredentials: true});
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
  }
}

export async function login (email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    },{withCredentials: true});
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
  }
}

export async function logout () {
  try {
    await axios.get(`${API_URL}/logout`,{withCredentials: true});
  } catch (error) {
    console.error('Logout error:', error);
  }}

export async function getUser () {
  try {
    const response = await axios.get(`${API_URL}/get-me`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      return null;
    }
    console.error('Get current user error:', error);
    throw error;
  }
}
