// usercontext
import { createContext, useState, useEffect } from "react";
import axios from 'axios';
//import { getUserProfile } from "../apis/getUserProfile";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [id, setId] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token -", token);
        if (token) {
          axios.defaults.headers.common["Authorization"] = token;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/profile`);
          setIsUserLoggedIn(true);
          setUsername(response.data.message.username);
          setId(response.data.message._id);
        } else {
          setIsUserLoggedIn(false);
          setUsername(null);
          setId(null);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getUser();
  }, [setIsUserLoggedIn, setUsername, setId]);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId, selectedCategory, setSelectedCategory , isUserLoggedIn, setIsUserLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
}
