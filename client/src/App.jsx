import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  
  const [storiesByCategory, setStoriesByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [storyClicked, setStoryClicked] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const { isUserLoggedIn, setIsUserLoggedIn, setUsername, setId } = useContext(UserContext);

  const onlineStatus = useOnlineStatus();

  const fetchData = async () => {
    try {
      setLoading(true); // Start loading
      
      const categories = ["education", "health_and_fitness", "travel", "food", "movies"];
      const fetchedData = {};
      await Promise.all(categories.map(async category => {
        const stories = await getStoriesByCategory(category);
        fetchedData[category] = stories.data.stories;
      }));
      const sortedFetchedData = Object.keys(fetchedData).sort();
      setStoriesByCategory(fetchedData);
      setLoading(false); // Stop loading
      console.log("sbc - ",storiesByCategory)
    } catch (error) {
      console.error("Error fetching stories:", error);
      setLoading(false); // Stop loading in case of error
    }
  };

  useEffect(() => {
    setSelectedCategory("All");
  }, [])
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterSelect = async (filterKey) => {
    if (filterKey === "All") {
      const allCategoriesData = {};
      try {
        setLoading(true); // Start loading
        const categories = ["education", "health_and_fitness", "travel", "food", "movies"];
        for (const category of categories) {
          const stories = await getStoriesByCategory(category);
          allCategoriesData[category] = stories.data.stories;
        }
        setStoriesByCategory(allCategoriesData);
        setSelectedCategory("All");
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false); // Stop loading in case of error
      }
    } else {
      const category = FILTERS_MAPPING[filterKey];
      try {
        setLoading(true); // Start loading
        const stories = await getStoriesByCategory(category);
        setStoriesByCategory({ [category]: stories.data.stories });
        setSelectedCategory(category);
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false); // Stop loading in case of error
      }
    }
  };

  return (
    <Router>
      <UserContextProvider>
        <StoryProvider> 
          <AppContext.Provider value={{ storiesByCategory, selectedCategory, handleFilterSelect, storyClicked, setStoryClicked , fetchData , onlineStatus , YourStories }}>
            {loading ? ( // Show loading message if loading is true
              <div className='' >
              <HashLoader
                color={"#000000"}
                loading={loading}
                cssOverride={loadingSpinnerStyles}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : ( // Render app content if loading is false
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/view-story/:storyId" element={<Home />} />
                <Route path='/add-story' element={<Home />} />
                <Route path='/login' element={<Home />} />
                <Route path='/bookmarks' element={<BookmarkPage />} />
                <Route path='/your-stories' element={<YourStoryPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
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
            transition={Bounce} /> {/* Render ToastContainer at the top level of your component tree */}
        </StoryProvider>
      </UserContextProvider>
    </Router>
  );
}

export default App;
