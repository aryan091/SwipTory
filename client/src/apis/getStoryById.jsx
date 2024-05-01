import axios from 'axios'
export const getStoryById = async (storyId) => {
    try {
        const reqUrl = `${import.meta.env.VITE_BACKEND_URL}/story/view-story/${storyId}`;
        const response = await axios.get(reqUrl);
        console.log(response.data);
        return response.data ;
    } catch (error) {
        console.log(error);
    }
};