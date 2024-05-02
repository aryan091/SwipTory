//App.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import AppContext from './context/AppContext';
import { getStoriesByCategory } from './apis/getStoryByCategory';
import { FILTERS_MAPPING } from './utils/constants';
import Home from './components/Home/Home';
import { UserContext , UserContextProvider } from './context/UserContext';
import { StoryContext , StoryProvider } from './context/StoryContext';
import AddStory from './components/AddStory/AddStory';
import BookmarkPage from './components/Bookmarks/BookmarkPage';
import NotFound from './components/NotFound/NotFound';
import { ToastContainer , Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useOnlineStatus from './utils/useOnlineStatus';
import YourStories from './components/YourStories/YourStories';
import YourStoryPage from './components/YourStories/YourStoryPage';

function App() {
  
  const [storiesByCategory, setStoriesByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [storyClicked, setStoryClicked] = useState(null);
  const { isUserLoggedIn, setIsUserLoggedIn, setUsername, setId } = useContext(UserContext);

  const onlineStatus = useOnlineStatus()


  const fetchData = async () => {
    try {
      const categories = ["education", "health_and_fitness", "travel", "food", "movies"];
      const fetchedData = {};
      await Promise.all(categories.map(async category => {
        const stories = await getStoriesByCategory(category);
        fetchedData[category] = stories.data.stories;
      }));
      const sortedFetchedData = Object.keys(fetchedData).sort();
      setStoriesByCategory(fetchedData);
      console.log("sbc - ",storiesByCategory)
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    setSelectedCategory("All");
  },[])
  
  
  useEffect(() => {

    fetchData();
  }, []);


  const handleFilterSelect = async (filterKey) => {
    if (filterKey === "All") {
      const allCategoriesData = {};
      try {
        const categories = ["education", "health_and_fitness", "travel", "food", "movies"];
        for (const category of categories) {
          const stories = await getStoriesByCategory(category);
          allCategoriesData[category] = stories.data.stories;
        }
        setStoriesByCategory(allCategoriesData);
        setSelectedCategory("All");
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    } else {
      const category = FILTERS_MAPPING[filterKey];
      try {
        const stories = await getStoriesByCategory(category);
        setStoriesByCategory({ [category]: stories.data.stories });
        setSelectedCategory(category);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    }
  };

  
  

  return (
    <Router>
    <UserContextProvider>
    <StoryProvider> 

      <AppContext.Provider value={{ storiesByCategory, selectedCategory, handleFilterSelect, storyClicked, setStoryClicked , fetchData , onlineStatus , YourStories }}>
        <Routes>


          <Route path="/" element={<Home />} />
          <Route path="/view-story/:storyId" element={<Home />} />
          <Route path='/add-story' element={<Home />} />
          <Route path='/login' element={<Home />} />

          <Route path='/bookmarks' element={<BookmarkPage />} />
          <Route path='/your-stories' element={<YourStoryPage />} />
          <Route path="*" element={<NotFound />} />
          


        </Routes>
      </AppContext.Provider>
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition: Bounce /> {/* Render ToastContainer at the top level of your component tree */}

      </StoryProvider>
    </UserContextProvider>
  </Router>

  );
}

export default App;
