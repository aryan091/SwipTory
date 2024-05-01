import React, { useContext , useState , useEffect } from 'react'
import EduCards from '../EducationCards/EduCards'
import { UserContext } from '../../context/UserContext'
import AppContext from '../../context/AppContext';

import axios from 'axios'
const Bookmarks = ({openAddStoryModal}) => {

    const { isUserLoggedIn } = useContext(UserContext)
    const [userBookmarks, setUserBookmarks] = useState([]);
    const {onlineStatus} = useContext(AppContext)


    useEffect(() => {
        if (isUserLoggedIn) {
          const fetchUserStories = async () => {
            try {
              const url = `${import.meta.env.VITE_BACKEND_URL}/user/bookmarks`;
              const token = localStorage.getItem('token');
              axios.defaults.headers.common['Authorization'] = token;
              const response = await axios.post(url);
              setUserBookmarks(response.data.data.bookmarks);
              console.log("Bookmarked - ",response.data)
            } catch (error) {
              console.error('Error fetching user bookmarks:', error);
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
      {isUserLoggedIn   && <EduCards categoryText="Your Bookmarks" noText="You haven't bookmarked any stories yet" stories={userBookmarks} isUser={true} openAddStoryModal={openAddStoryModal} />}

    </div>
  )
}

export default Bookmarks