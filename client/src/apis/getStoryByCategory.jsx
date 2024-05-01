import axios from 'axios'
export const getStoriesByCategory = async (category) => {
    try {
        const reqUrl = `${import.meta.env.VITE_BACKEND_URL}/story/all-stories/?category=${category}`;
        const response = await axios.get(reqUrl);
        console.log(response.data);
        return response.data ;
    } catch (error) {
        console.log(error.response.data.message);
    }
};