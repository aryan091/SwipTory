import axios from 'axios'
export const getUserProfile = async (category) => {
    try {
        const reqUrl = `${import.meta.env.VITE_BACKEND_URL}/user/profile`;
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.get(reqUrl);
        console.log(response.data);
        return response.data ;
    } catch (error) {
        console.log(error);
    }
};