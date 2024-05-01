// AuthContext.js

import React, { createContext, useState , useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);

  
  const handleLoginClick = () => {
    setShowModalLogin(true);
  };

  const openAddStoryModal = () => {
    setIsAddStoryModalOpen(true);
  };

  const closeAddStoryModal = () => {
    navigate('/');
    setIsAddStoryModalOpen(false);
  };

  useEffect(() => {
    if (isAddStoryModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isAddStoryModalOpen]);


  return (
    <AuthContext.Provider value={{ handleLoginClick, showModalLogin , openAddStoryModal, closeAddStoryModal }}>
      {children}
    </AuthContext.Provider>
  );
};
