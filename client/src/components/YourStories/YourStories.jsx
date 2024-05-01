import React, { useContext , useState , useEffect } from 'react'
import EduCards from '../EducationCards/EduCards'
import { UserContext } from '../../context/UserContext'
import AppContext from '../../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const YourStories = () => {

    const { isUserLoggedIn } = useContext(UserContext)
    const [userStories, setUserStories] = useState([]);
    const {onlineStatus} = useContext(AppContext)

    const navigate = useNavigate();

    useEffect(() => {
        if (isUserLoggedIn) {
          const fetchUserStories = async () => {
            try {
              const url = `${import.meta.env.VITE_BACKEND_URL}/story/my-stories`;
              const token = localStorage.getItem('token');
              axios.defaults.headers.common['Authorization'] = token;
              const response = await axios.post(url);
              setUserStories(response.data.data.stories);
            } catch (error) {
              console.error(error.response.data.message);
            }
          };
          fetchUserStories();
        }
      }, [isUserLoggedIn]);
    

    if(!onlineStatus){
        return (
          <div className='offline'>
            <h1>🔴 Looks like you are Offline. Kindly Check Your Internet Connection</h1>
            </div>
        )
      }


  return (
    <div>
      {isUserLoggedIn  && <EduCards 
      categoryText="Your Stories" 
      noText="No Stories Found" 
      stories={userStories} 
      isUser={true} 
      openAddStoryModal={() => navigate('/your-stories')} 
       />}

    </div>
  )
}

export default YourStories