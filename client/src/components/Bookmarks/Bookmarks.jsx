import React, { useContext, useState, useEffect } from 'react';
import EduCards from '../EducationCards/EduCards';
import { UserContext } from '../../context/UserContext';
import AppContext from '../../context/AppContext';
import axios from 'axios';
import { HashLoader } from "react-spinners";

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

const Bookmarks = ({ openAddStoryModal }) => {
  const { isUserLoggedIn } = useContext(UserContext);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const { onlineStatus } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserBookmarks = async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/bookmarks`;
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        const response = await axios.post(url);
        setUserBookmarks(response.data.data.bookmarks);
        console.log("Bookmarked - ", response.data);
      } catch (error) {
        console.error('Error fetching user bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isUserLoggedIn) {
      fetchUserBookmarks();
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
          categoryText="Your Bookmarks"
          noText="You haven't bookmarked any stories yet"
          stories={userBookmarks}
          isUser={true}
          openAddStoryModal={openAddStoryModal}
        />
      )}
    </div>
  );
};

export default Bookmarks;
