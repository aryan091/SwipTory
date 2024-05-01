// story.jsx
import React, { useState, useContext, useEffect } from "react";
import { StoryContext } from "../../context/StoryContext";
import { UserContext } from "../../context/UserContext";
import AddStory from "../AddStory/AddStory";
import { useNavigate , Link } from "react-router-dom";
import EditIcon from '../../assets/edit.png'
import "./Story.css"

const Story = ({ story , openAddStoryModal}) => {
  const { fetchStoryById , handleFilterSelect , selectedCategory } = useContext(StoryContext);
  const [canEdit , setCanEdit ] = useState(false);
  const {id , isUserLoggedIn } = useContext(UserContext)
  const [showAddStory, setShowAddStory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCanEdit(id === story.addedBy);
  },[canEdit])

  const handleEditClick = async (event) => {
    event.stopPropagation(); 
    event.preventDefault();

    
    navigate("/add-story", { state: { story: story, edit: true } });
  };
  
  
  
  const handleStoryClick = () => {
    fetchStoryById(story._id);
     navigate(`/view-story/${story._id}`);
  };
  


  return (
    <div className="wrapper ">
      <div
        className="categoryStory "
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0 ), rgba(0, 0, 0,  0.9)), url(${story.slides[0].imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={handleStoryClick}
      >
        <div className="categoryStoryContent">
          <div className="categoryStoryHeader ">
            {story.slides[0].heading}
          </div>
          <div className="categoryStoryDescription ">
            {story.slides[0].description}
          </div>
        </div>
        {isUserLoggedIn && canEdit && (
            <button className="editButton  "
            onClick={handleEditClick}
              >
                 <img src={EditIcon} alt="Edit" className="edit-image " />
              Edit
            </button>
          
        )}
      </div>
    </div>
  );
};

export default Story;
