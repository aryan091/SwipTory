import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterModal from '../RegisterModal/RegisterModal';
import LoginModal from '../LoginModal/LoginModal';
import { UserContext } from '../../context/UserContext';
import AppContext from '../../context/AppContext';
import Avatar from "../../assets/avatar.jpg"
import Ham from "../../assets/ham.png"
import HamforHeader from "../../assets/HamForHeader.png"
import AddStory from '../AddStory/AddStory';
import "./Header.css"
import { IoMdClose } from "react-icons/io";
import { FaBookmark } from "react-icons/fa";


const Header = ({openAddStoryModal}) => {
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  const [showMobilePopover, setShowMobilePopover] = useState(false);
  const [showMobileLoggedPopover, setShowMobileLoggedPopover] = useState(false);


  const { isUserLoggedIn, username , id  , setIsUserLoggedIn , setUsername , setId} = useContext(UserContext);

  const navigate = useNavigate();

  const openModalLogin = () => {
    setShowModalLogin(true);
  };

  const handleLoginClick = () => {
    if(isMobile) handleMobileHamIconClick();

    navigate('/login');
  };

  const closeModalLogin = () => {
    navigate('/');
  };

  const openModalRegister = () => {
    setShowModalRegister(true);
  };

  const closeModalRegister = () => {
    setShowModalRegister(false);
  };

  const handleRegisterClick = () => {
    if(isMobile) handleMobileHamIconClick();
    openModalRegister();
  };

  const handleLogout = () => {
    setId(null)
    setShowPopover(false)
    setShowMobilePopover(false)
    localStorage.removeItem('token')
    setUsername(null)
    setIsUserLoggedIn(false)
    navigate('/');
  };

  const handleMobileHamIconClick = () => {
    setShowMobilePopover(!showMobilePopover);
  }

  const handleHamIconClick = () => {
    setShowPopover(!showPopover);
  };

  const handleAddStoryClick = () => {
    if (isMobile) handleMobileHamIconClick();
    navigate('/add-story');
    openAddStoryModal(); // Call the function received as prop
  };

  const handleBookmarkClick= () => {
    navigate("/bookmarks");
  }

  const handleBrandClick = () => {
    setShowMobilePopover(false)
    navigate("/");
  }

  const handleYourStoryClick  = () => {
    setShowMobilePopover(false)
    navigate("/your-stories");
  }

  const handleClose = () => {
    setShowMobilePopover(false)
  }

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

  return (
    <div className='header '>
      <div>
        <h1 className='heading-text'
        onClick={handleBrandClick}
        >SwipTory</h1>
      </div>
      <div className=' button-place '>
      {!isMobile && !isUserLoggedIn && (
          <>
            <button id='button-register' className='button' onClick={handleRegisterClick}>Register Now</button>
            <button id='button-signin' className='button' onClick={handleLoginClick}>Sign In</button>
          </>
        )}
        {isMobile && (
          <img className='ham' src={HamforHeader} alt="Ham Icon" onClick={handleMobileHamIconClick} />
        )}

        {showMobilePopover && !isUserLoggedIn && (
        <div className='mobile-popover '>
          {/* <div>
          <p className='mobile-popover-text'>{username}</p>

          </div> */}
          <div className='mobile-popover-button '>
          <button id='button-register' className='button' onClick={handleRegisterClick}>Register Now</button>
            <button id='button-signin' className='button' onClick={handleLoginClick}>Sign In</button>
          </div>
          
        </div>
      )}
              {showMobilePopover &&  isUserLoggedIn && (
        <div className='mobile-popover '>

                <IoMdClose
                style={{
                  cursor: "pointer",
                  color: "black",
                  width: "1.5rem",
                  height: "1.5rem",
                  position: "absolute",
                  top:0,
                  right:"1rem"
                }}
                
                onClick={handleClose}
              />

          <div className='avt-name flex items-center gap-4'>
          <img src={Avatar} alt="Avatar" />

          <p className='mobile-popover-text '>{username}</p>


          </div>
          <div className=' all-items '>

          <button
              id='button-add-story'
              className='button '
              onClick={handleYourStoryClick}
            >
              Your Story
            </button>


            <button
              id='button-add-story'
              className='button '
              onClick={handleAddStoryClick}
            >
              Add Story
            </button>
            <div className='book-button'>
<button
              id='button-bookmark'
              className='button '
              onClick={handleBookmarkClick}
            >
                      <FaBookmark
          className="bookmark-icon"
          style={{
            color: "white",
            cursor: "pointer",
            width: '1.5rem',
            height: '1.5rem'
          }}
        />

              Bookmark
            </button>
</div>

          <div>
          <button onClick={handleLogout}
              className='logout-button  '
              >
            Logout
            </button>
          </div>


          </div>

          
        </div>
      )}


        {!isMobile && isUserLoggedIn && (

          <div className='all-item-pc '>

<div className='book-button'>
<button
              id='button-bookmark'
              className='button '
              onClick={handleBookmarkClick}
            >
                      <FaBookmark
          className="bookmark-icon"
          style={{
            color: "white",
            cursor: "pointer",
            width: '1.5rem',
            height: '1.5rem'
          }}
        />

              Bookmark
            </button>
</div>
                


            <button
              id='button-add-story'
              className='button '
              onClick={handleAddStoryClick}
            >
              Add Story
            </button>
            <div className='icon-class'>
              <img src={Avatar} alt="Avatar" />
              <img
                className='ham'
                src={Ham}
                alt="Ham Icon"
                onClick={handleHamIconClick}
              />
            </div>
          </div>


        )}
      </div>

      {showPopover && (
        <div className='popover '>
          <div>
          <p className='popover-text'>{username}</p>

          </div>
          <div>
          <button onClick={handleLogout}
              className='logout-button  '
              >
            Logout
            </button>
          </div>
          
        </div>
      )}
      {showModalRegister && <RegisterModal closeModal={closeModalRegister} />}
      

    </div>
  );
};

export default Header;
