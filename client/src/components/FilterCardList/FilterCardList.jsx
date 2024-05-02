import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';

import { FILTERS_MAPPING } from '../../utils/constants';
import './FilterCardList.css'

import AllImage from '../../assets/all.jpg';
import EducationImage from '../../assets/education.jpg';
import MoviesImage from '../../assets/movies.jpg';
import TravelImage from '../../assets/travel.jpg';
import HealthFitnessImage from '../../assets/health_and_fitness.jpg';
import FoodImage from '../../assets/food.jpg';


const FilterCardList = () => {
  const { handleFilterSelect, selectedCategory } = useContext(AppContext);



  return (
    <div className='filter-card-list '>
      {Object.keys(FILTERS_MAPPING).map((filterKey) => (
        <div
          key={filterKey}
          className={`filter-card`}
          style={{
            border: selectedCategory === FILTERS_MAPPING[filterKey] || (selectedCategory === 'All' && filterKey === 'All') ? '10px solid #3182ce' : 'none',
            borderRadius: selectedCategory === FILTERS_MAPPING[filterKey] || (selectedCategory === 'All' && filterKey === 'All') ? '2rem' : '0'
        
          }}
                    onClick={() => handleFilterSelect(filterKey)}
        >
          <img
            src={getImagePath(filterKey)}
            alt=''
            className='filter-card-img '
          />
          <div className='filter-card-text-area'>
            <h1 className='filter-card-text  '>
              {filterKey}
            </h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterCardList;
function getImagePath(filterKey) {
  switch(filterKey) {
    case 'All':
      return AllImage;
    case 'Education':
      return EducationImage;
    case 'Movies':
      return MoviesImage;
    case 'Travel':
      return TravelImage;
    case 'Health and Fitness':
      return HealthFitnessImage;
    case 'Food':
      return FoodImage;
    default:
      return '';
  }
}