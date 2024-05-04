import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Slider.css";
import { StoryContext } from "../../context/StoryContext";
import { UserContext } from "../../context/UserContext";
import Next from "../../assets/right.png";
import Prev from "../../assets/left.png";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';



const SliderModal = ({ onClose }) => {

  console.log(" in slider ")

  const handleCardClick = (event) => {
    const { clientX } = event;
    const cardWidth = document.querySelector('.card').offsetWidth;
    const clickPosition = clientX - event.currentTarget.getBoundingClientRect().left;

    if (clickPosition < cardWidth / 2) {
      prevSlide();
    } else {
      nextSlide();
    }
  };


  const {handleLoginClick} =  useContext(AuthContext)

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [BookLoading, setBookLoading] = useState(false);
  const [autoSlideTimer, setAutoSlideTimer] = useState(null);

  const { storyId } = useParams();

  console.log("In slider ",storyId)
  const { currentStorySlides , isLiked , setIsLiked , totalLikes , setTotalLikes , fetchStoryById , isBookmarked , setIsBookmarked } = useContext(StoryContext);
  const { id: userId } = useContext(UserContext);
  
  const handleShare = () => {
    const url = window.location.href; // Get the current URL
    navigator.clipboard.writeText(url); // Copy the URL to the clipboard
    toast.success('Copied to clipboard!',{
      position: "top-center",
    });

  };

  const toggleLike = async () => {
    if (!userId) {
      navigate('/login');

      return;
    }

    try {
      // Toggle the like status
      const url = `${import.meta.env.VITE_BACKEND_URL}/story/like/${storyId}`;
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(url);
      setIsLiked(response.data.data.liked);
      setTotalLikes(response.data.data.totalLikes);   

      (isLiked) ?   toast.success('Story Unliked Successfully!') : toast.success('Story Liked Successfully!')

    } catch (error) {
      throw new Error("Failed to get like ");
    }
  }

  const toggleBookmark = async () => {
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      // Toggle the bookmark status
      const response = isBookmarked ? await unbookmarkStory() : await bookmarkStory();
      const newBookmarkStatus = response.data.data.bookmarked;
      // Update state with new bookmark status
      setIsBookmarked(newBookmarkStatus);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };
  
  const bookmarkStory = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/user/bookmark/${storyId}`;
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(url);
      toast.success('Story Bookmarked Successfully!')
      return response;
    } catch (error) {
      throw new Error("Failed to bookmark story");
    }
  };

  const unbookmarkStory = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/user/remove_bookmark/${storyId}`;
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(url);
      toast.success('Story Unbookmarked Successfully!')
      return response;
    } catch (error) {
      throw new Error("Failed to unbookmark story");
    }
  };
  
  useEffect(() => {
    if (storyId ) {
      fetchStoryById(storyId);
    }
  }, [storyId, userId], isBookmarked);
  

  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
    onClose();
  };

  useEffect(() => {
    document.body.classList.add("modal-open");

    if (currentStorySlides && currentStorySlides.length > 0) {
      setLoading(false);
      
      if (currentStorySlides.length > 1) {
        const interval = setInterval(() => {
          setCurrentImageIndex((prevIndex) =>
            prevIndex === currentStorySlides.length - 1 ? prevIndex : prevIndex + 1
          );
        }, 3000);
        setAutoSlideTimer(interval);
        return () => {
          clearInterval(interval);
          document.body.classList.remove("modal-open");
        };
      }
    }
  }, [currentStorySlides]);

  
  const nextSlide = () => {
    clearInterval(autoSlideTimer); // Clear any existing auto slide timer

    setCurrentImageIndex((prevIndex) =>
      prevIndex === currentStorySlides.length - 1 ? prevIndex : prevIndex + 1
    );

    if (currentStorySlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === currentStorySlides.length - 1 ? prevIndex : prevIndex + 1
        );
      }, 5000);
      setAutoSlideTimer(interval);
    }
  };

  const prevSlide = () => {
    clearInterval(autoSlideTimer); 

    setCurrentImageIndex((prevIndex) => {
      let newIndex;
      if (prevIndex === 0) {
        newIndex = prevIndex;
      } else {
        newIndex = prevIndex - 1;
      }
      console.log("Previous index:", newIndex);
      console.log("Previous slide:", currentStorySlides[newIndex]); 
      return newIndex;
    });

    if (currentStorySlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === currentStorySlides.length - 1 ? prevIndex : prevIndex + 1
        );
      }, 5000);
      setAutoSlideTimer(interval);
    }
  };

  const currentSlide =
    currentStorySlides && currentStorySlides.length > 0
      ? currentStorySlides[currentImageIndex]
      : null;

  if (loading ) {
    return <div>Loading...</div>;
  }

  return (
    <div className="modal">
      <div className="modal-content ">
        <div className="slider-container">
          <div className="prev-button" onClick={prevSlide}>
            <img src={Prev} alt="" />
          </div>
          <div className="card" onClick={handleCardClick}>
            <div className="progress-bar-container">
              {currentStorySlides.map((_, index) => (
                <div
                  key={index}
                  className={`progress-bar-segment ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                ></div>
              ))}
            </div>
            <div className="icons">
              <div className="close-icon">
              <IoMdClose
                style={{
                  cursor: "pointer",
                  color: "white",
                  width: "2rem",
                  height: "2rem",
                }}
                
                onClick={handleClose}
              />
              </div>
              <div                 className="share-icon"
>
              <FaLocationArrow
                style={{
                  cursor: "pointer",
                  color: "white",
                  width: "1.5rem",
                  height: "1.5rem",
                }}
                onClick={handleShare}
              />
              </div>
              
            </div>
            {currentSlide && currentSlide.imageUrl && (
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.heading}
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
            <div className="categoryStoryContentSlider">
              <div className="categoryStoryHeaderSlider">
                {currentSlide && currentSlide.heading}
              </div>
              <div className="categoryStoryDescriptionSlider">
                {currentSlide && currentSlide.description}
              </div>
              <div>

              </div>
              
              <div className="lower-icons ">
                {BookLoading ? (
                  <div>Loading...</div>
                ) : (
                  <FaBookmark
                    className="bookmark-icon"
                    style={{
                      color: isBookmarked ? "blue" : "white",
                      cursor: "pointer",
                      width:'1.5rem' , height:'1.5rem'
                    }}
                    onClick={toggleBookmark}
                  />
                )}
                <div className=" heart-icon ">
                  <GoHeartFill 
                    className="like-icon"
                    style={{
                      color: isLiked ? "red" : "white",
                      cursor: "pointer",
                      width:'1.7rem' , height:'1.7rem'
                    }}
                    onClick={toggleLike}
                  />
                  <p className="total-likes">{totalLikes}</p>
                </div>
              </div>

              
            </div>




          </div>
          <div className="next-button" onClick={nextSlide}>
            <img src={Next} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderModal;
