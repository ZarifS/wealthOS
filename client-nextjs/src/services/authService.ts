import axios from "axios";

const API_URL = "localhost:5001/wealthos/us-central1/app/auth";

export interface RegisterPayload  {
    firstName: string,
    lastName: string,
    email: string,
    password: string
    confirmedPassword: string
}

export interface LoginPayload {
    email: string,
    password: string
}


const register = async ({firstName, lastName, email, password, confirmedPassword}: RegisterPayload) => {
  return axios.post(API_URL + "/signUp", {
    firstName,
    lastName,
    email,
    password,
    confirmedPassword
  });
};

const login = async ({email, password}: LoginPayload) => {
  const response = await axios
        .post(API_URL + "/signIn", {
            email,
            password,
        });
    if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

// Helper function to get auth header for user
export function authHeader() {
    const user = JSON.parse(localStorage.getItem('user') as string) || null;
  
    if (user && user.accessToken) {
      // for Node.js Express back-end
      return { 'x-access-token': user.accessToken };
    } else {
      return {};
    }
  }


export default {
    register,
    login,
    logout,
    authHeader,
};