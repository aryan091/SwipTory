// StoryProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "./UserContext";


export const StoryContext = createContext({});

export const StoryProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [currentStorySlides, setCurrentStorySlides] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [isLiked, setIsLiked] = useState(false);

  const [totalLikes , setTotalLikes] = useState(0);
  const [isBookmarked , setIsBookmarked] = useState(false);


  const {id: userId} = useContext(UserContext)

  const { storyId } = useParams();

  const fetchStoryById = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/story/view-story/${id}`);
      console.log(" In story context",response.data.data);
      setStories(response.data.data.story);
      setCurrentStorySlides(response.data.data.story.slides);
      setTotalLikes(response.data.data.story.totalLikes)
      if (response.data.data.story.likes.includes(userId)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }

      if (response.data.data.story.bookmarks.includes(userId)) {
        setIsBookmarked(true);
      } else {
        setIsBookmarked(false);
      }
  

          } catch (error) {
      console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (storyId) {
      fetchStoryById(storyId);
    }
  }, [storyId ,isLiked, totalLikes]);

  return (
    <StoryContext.Provider
      value={{
        stories,
        currentStorySlides,
        fetchStoryById,
        isLiked,
        setIsLiked,
        totalLikes, 
        setTotalLikes,
        isBookmarked,
        setIsBookmarked
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};
