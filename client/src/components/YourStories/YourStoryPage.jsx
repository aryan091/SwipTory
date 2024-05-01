// BookmarkPage.jsx
import { useContext } from 'react';
import Header from '../Header/Header';
import YourStories from './YourStories';
import { AuthContext } from '../../context/AuthContext';
const YourStoryPage = () => {
  const { openAddStoryModal } = useContext(AuthContext);
  return (
    <div>
      
      <Header openAddStoryModal={openAddStoryModal} />
      <YourStories />
    </div>
  );
};

export default YourStoryPage;
