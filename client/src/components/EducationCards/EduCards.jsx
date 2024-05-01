import React, { useState , useContext} from 'react';
import Story from '../Story/Story';
import { Link } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import "./EduCards.css"
const EduCards = ({ categoryText, stories, isUser, openAddStoryModal }) => {
  const [visibleStories, setVisibleStories] = useState(4);
  const {onlineStatus} = useContext(AppContext)

  const handleLoadMore = () => {
    setVisibleStories(prevVisibleStories => prevVisibleStories + 4);
  };

  if(!onlineStatus){
    return (
      <div className='offline'>
        <h1>🔴 Looks like you are Offline. Kindly Check Your Internet Connection</h1>
        </div>
    )
  }

  return (
    <div className='containerStory'>
      <div className='container-heading'>
        {isUser ? <h1>{categoryText}</h1> : <h1>Top Stories About {categoryText}</h1>}
      </div>
      {stories.length > 0 ? (
        <div className='storyContainer'>
          {stories.slice(0, visibleStories).map(story => (
            <Story key={story._id} story={story} openAddStoryModal={openAddStoryModal} />
          ))}
        </div>
      ) : (
        <div className='no-stories'>
          <div className='no-story-div  '>
            <p className=' no-story-text'>No Stories Available</p>
          </div>
        </div>
      )}
      {stories.length > visibleStories && (
        <div className=" see-more-div ">
          <button className="see-more " onClick={handleLoadMore}>
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default EduCards;
