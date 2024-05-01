// add story
import React, { useState , useEffect, useContext } from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "./AddStory.css";
import {FILTERS_MAPPING} from "../../utils/constants";
import axios from 'axios';
import { useNavigate , useLocation } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import { toast } from 'react-toastify';


const categories = ["education", "health_and_fitness", "travel", "food", "movies"];

const AddStory = ({closeModal}) => {

  console.log("In AddStory")
  const {onlineStatus} = useContext(AppContext)


  const [slides, setSlides] = useState([
    { heading: '', description: '', imageUrl: '', category: '' },
    { heading: '', description: '', imageUrl: '', category: '' },
    { heading: '', description: '', imageUrl: '', category: '' },
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const { state } = useLocation();
  const {fetchData} = useContext(AppContext)

  useEffect(() => {
    if (state && state.story) {
      const receivedStory = state.story;
      setSlides(receivedStory.slides);
      setSelectedCategory(receivedStory.slides[0].category); 

    }
  }, [state]);


  //const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');


  const handleSlideChange = (field, value) => {
    const updatedSlides = slides.map((slide, index) => {
      if (index === activeSlideIndex) {
        return { ...slide, [field]: value };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSlides(slides.map(slide => ({ ...slide, category: value })));
    setCategoryError('');
  };

  const handleNextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };

  
  const handleAddSlide = () => {
    if (slides.length < 6) {
      setSlides([...slides, { heading: '', description: '', imageUrl: '', category: selectedCategory }]);
      setActiveSlideIndex(slides.length);
    }
  };

  const handleRemoveSlide = (index) => {
    if (slides.length > 3 && index >= 3) {
      const updatedSlides = slides.filter((_, i) => i !== index);
      setSlides(updatedSlides);
      setActiveSlideIndex(Math.min(activeSlideIndex, slides.length - 2));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if any of the slides have empty fields
    const hasEmptyFields = slides.some(slide => (
      slide.heading.trim() === '' ||
      slide.description.trim() === '' ||
      slide.imageUrl.trim() === '' ||
      slide.category.trim() === ''
    ));
  
    if (hasEmptyFields) {
      setCategoryError('Please fill in all fields before submitting.');
      return;
    } else {
      setCategoryError('');
    }
  
    try {
      
  
      if (state?.edit) {
        // Update an existing story
        const url = `${import.meta.env.VITE_BACKEND_URL}/story/update/${state?.story?._id}`;
        const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.put(url, { slides });
        console.log("Post updated successfully:", response.data);
        toast.success('Story Updated Successfully!');

      } else {
        const url = `${import.meta.env.VITE_BACKEND_URL}/story/create`;
        const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(url, { slides });
        console.log("Story created successfully:", response.data);
        toast.success('Story Created Successfully!');

      }

      fetchData();
  
      closeModal();
    } catch (error) {
      setCategoryError(error.response.data.message);
    }
  
    console.log('Story data:', slides);
  };
  
  if(!onlineStatus){
    return (
      <div className='offline'>
        <h1>🔴 Looks like you are Offline. Kindly Check Your Internet Connection</h1>
        </div>
    )
  }

  


  return (
    <div className='container'>
<div className='add-story  '>
<IoMdCloseCircleOutline style={{ position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer', fontSize: '1.5rem', color: 'red' }}
onClick={closeModal} />


<div className='slide-buttons '>
          {slides.map((slide, index) => (
            <div key={index}
            style={{ position: 'relative' }}
            >
              <button
              style={{ border: index === activeSlideIndex ? '2px solid blue' : '2px solid transparent' }}
                onClick={() => setActiveSlideIndex(index)}
                disabled={index >= 3 && slides.length === 3} // Disable adding more than 3 slides initially
                type="button" // Add type="button" to prevent form submission
                className='slide-button-div' 
                >
                Slide {index + 1}
              </button>
              {index >= 3 && ( // Show close icon for slides added by user'
                    <div style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem' }}>

                <IoCloseCircleOutline
                  onClick={() => handleRemoveSlide(index)}
                  style={{ cursor: 'pointer', marginLeft: '5px', fontSize: '1.2rem', color: 'red' }}
                />
              </div>
              )}
            </div>
          ))}
          <div>
          {slides.length < 6 && ( // Show add button only when slides are less than 6
              <div>
                <button type="button" onClick={handleAddSlide} className='slide-buuton-div '>Add</button>
              </div>
            )}
          </div>
        </div>

  <div className=' formy '>
    



      <form onSubmit={handleSubmit}>
                <div className='slide-form'>
        <div className='slide '>
          <div className='form-values'>
            <label htmlFor="heading">Heading</label>
            <input
              id="heading"
              type="text"
              placeholder='Your Heading'
              value={slides[activeSlideIndex].heading || ''}
              onChange={(event) => handleSlideChange('heading', event.target.value)}
            />
          </div>
          <div className='form-values'>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder='Story Description'
              value={slides[activeSlideIndex].description || ''}
              onChange={(event) => handleSlideChange('description', event.target.value)}
            />
          </div>
          <div className='form-values'>
            <label htmlFor="imageUrl">Image </label>
            <input
              id="imageUrl"
              type="text"
              placeholder='Add Image Url '
              value={slides[activeSlideIndex].imageUrl || ''}
              onChange={(event) => handleSlideChange('imageUrl', event.target.value)}
            />
          </div>
          <div className='form-values'>
  <label htmlFor="category">Category</label>
  <select
  id="category"
  value={selectedCategory}
  onChange={(event) => handleCategoryChange(event.target.value)}
>
  <option value="" disabled hidden>Select Category</option>
  {Object.entries(FILTERS_MAPPING).map(([key, value]) => (
    categories.includes(value) && (
      <option key={value} value={value}>{key}</option>
    )
  ))}
</select>

</div>
{categoryError && <p className="error-message">{categoryError}</p>}

        </div>
        </div>

        


        <div className='action-button ' >
          <div className='slide-buttons-actions'>
            <div className='previous-btn'>
            <button  className='prev' type="button" onClick={handlePrevSlide} disabled={activeSlideIndex === 0}>Previous</button>

            </div>
            <div className='add-next-btn'>
            <button className='next' type="button" onClick={handleNextSlide} disabled={activeSlideIndex === slides.length - 1}>Next</button>

            </div>
          </div>

          <div className='submit-btn'>
            <button className='submit' type="submit"> 
            {state?.edit ? "Edit" : "Post"}

            </button>
          </div>

        </div>
      </form>

  </div>
      

</div>

    </div>
      );
};

export default AddStory;
