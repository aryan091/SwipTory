import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';
import EduCards from '../EducationCards/EduCards';
import { FILTERS_MAPPING } from '../../utils/constants';
const Cards = () => {
  const { storiesByCategory, selectedCategory } = useContext(AppContext);
  console.log("Slt cat cards - ",selectedCategory)
  const getKeyByValue = (value) => {
    for (const [key, val] of Object.entries(FILTERS_MAPPING)) {
        if (val === value) {
            return key;
        }
    }
    return null;
};
return (
  <div>
    {Object.entries(storiesByCategory).map(([category, stories]) => (
      <EduCards key={category} categoryText={getKeyByValue(category)} stories={stories} isUser={false} />
    ))}
  </div>
);
};

export default Cards;
