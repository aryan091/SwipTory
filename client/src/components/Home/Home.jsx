import React, { useEffect, useState, useContext } from 'react';
import Header from '../Header/Header';
import FilterCardList from '../FilterCardList/FilterCardList';
import Cards from '../Cards/Cards';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Slider from '../Slider/Slider';
import AddStory from '../AddStory/AddStory'; // Import the AddStory component
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import EduCards from '../EducationCards/EduCards';
import AppContext from '../../context/AppContext';
import LoginModal from '../LoginModal/LoginModal';

const Home = () => {
  const { storyId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const { isUserLoggedIn } = useContext(UserContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

  const location = useLocation();
  const navigate = useNavigate();

  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const { selectedCategory } = useContext(AppContext);
  const [showModalLogin, setShowModalLogin] = useState(false);


  useEffect(() => {
    window.addEventListener('resize', () => {
      setIsMobile(window.innerWidth < 576);
    });
  
    return () => {
      window.removeEventListener('resize', () => {
        setIsMobile(window.innerWidth < 576);
      });
    }
  },[])



  const openAddStoryModal = () => {
    setIsAddStoryModalOpen(true);
  };

  const closeAddStoryModal = () => {
    navigate('/');
    setIsAddStoryModalOpen(false);
  };

  useEffect(() => {
    if (isAddStoryModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isAddStoryModalOpen]);

  useEffect(() => {
    if (storyId) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [storyId]);

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

  useEffect(() => {
    if (location.pathname === '/add-story') {
      setIsAddStoryModalOpen(true);
    } else {
      setIsAddStoryModalOpen(false); 
    }
  }, [location.pathname]);


  useEffect(() => {
    if (location.pathname === '/login') {
      setShowModalLogin(true);
    } else {
      setShowModalLogin(false);
    }
  }, [location.pathname]);


  

  return (
    <div>
      <Header openAddStoryModal={openAddStoryModal} />
      <FilterCardList />
      {isUserLoggedIn  && !isMobile && selectedCategory === 'All' && <EduCards 
      categoryText="Your Stories" 
      noText="No Stories Found" 
      stories={userStories} 
      isUser={true} 
      openAddStoryModal={openAddStoryModal} 
       />}
      <Cards />
      {isModalOpen && <Slider onClose={() => setIsModalOpen(false)} />}
      {isAddStoryModalOpen && <AddStory closeModal={() => closeAddStoryModal()} />}
      {showModalLogin && <LoginModal closeModal={() => 
        {setShowModalLogin(false)
          navigate('/');
        }} />}

    </div>
  );
};

export default Home;
