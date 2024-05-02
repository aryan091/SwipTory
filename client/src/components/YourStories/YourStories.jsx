import React, { useContext , useState , useEffect } from 'react'
import EduCards from '../EducationCards/EduCards'
import { UserContext } from '../../context/UserContext'
import AppContext from '../../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import HashLoader from "react-spinners/HashLoader";

const loadingSpinnerStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  transform:"none"
}

const YourStories = () => {

  const { isUserLoggedIn } = useContext(UserContext);
  const [userStories, setUserStories] = useState([]);
  const { onlineStatus } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_BACKEND_URL}/story/my-stories`;
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        const response = await axios.post(url);
        setUserStories(response.data.data.stories);
      } catch (error) {
        console.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    if (isUserLoggedIn) {
      fetchUserStories();
    }
  }, [isUserLoggedIn]);

  if (!onlineStatus) {
    return (
      <div className='offline'>
        <h1>🔴 Looks like you are Offline. Kindly Check Your Internet Connection</h1>
      </div>
    );
  }


      return (
        <div>
          {loading ? (
            <div className="loading-spinner">
              <HashLoader
                color={"#ffffff"}
                loading={loading}
                cssOverride={loadingSpinnerStyles}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : (
            <EduCards
              categoryText="Your Stories"
              noText="No Stories Found"
              stories={userStories}
              isUser={true}
              openAddStoryModal={() => navigate('/your-stories')}
            />
          )}
        </div>
      );
    
}

export default YourStories