// BookmarkPage.jsx
import { useContext } from 'react';
import Header from '../Header/Header';
import Bookmarks from './Bookmarks';
import { AuthContext } from '../../context/AuthContext';
const BookmarkPage = () => {
  const { openAddStoryModal } = useContext(AuthContext);
  return (
    <div>
      
      <Header openAddStoryModal={openAddStoryModal} />
      <Bookmarks />
    </div>
  );
};

export default BookmarkPage;
