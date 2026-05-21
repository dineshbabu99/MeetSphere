import axios from "axios";

const API =
  "http://localhost:5000/api/auth";

export const registerApi = async (
  userData: {
    name: string;
    email: string;
    password: string;
  }
) => {

  const response =
    await axios.post(
      `${API}/register`,
      userData
    );

  return response.data;
};