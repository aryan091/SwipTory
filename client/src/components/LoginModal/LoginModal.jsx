// RegisterModal.js
import React , { useState , useEffect ,useContext} from 'react';
import "./LoginModal.css"
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { toast } from 'react-toastify';
import { GoEye } from "react-icons/go";

import { PropagateLoader } from 'react-spinners'; // Import the spinner component

const loadingSpinnerStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  transform:"none"
}

const LoginModal = ({ closeModal }) => {

  const { setIsUserLoggedIn , setUsername, setId } = useContext(UserContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);  
  const [loading, setLoading] = useState(false); // Loading state

  const [statusMessage , setStatusMessage] = useState('');

  const handleLogin = async () => {
      setLoading(true); // Set loading to true when API call starts
      try {
          const reqUrl = `${import.meta.env.VITE_BACKEND_URL}/user/login`;
          const response = await axios.post(reqUrl, {
              username: name,
              password
          });

          localStorage.setItem("token", response.data.message.token);

          setIsUserLoggedIn(true);
          setUsername(response.data.message.user.username);
          setId(response.data.message.user._id);

          toast.success(`Welcome ${response.data.message.user.username}!`);
          closeModal();
      } catch (error) {
          setStatusMessage(error.response.data.message);
      } finally {
          setLoading(false); // Set loading back to false when API call completes
      }
  };

  useEffect(() => {
      console.log("Login Modal Open")
      document.body.classList.add('modal-open');
      return () => {
          document.body.classList.remove('modal-open');
      };
  }, []);

  return (
      <div className="login-modal ">
          <div className="login-modal-content ">
              <IoMdCloseCircleOutline style={{ position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer', fontSize: '1.5rem', color: 'red' }} onClick={closeModal} />
              <div className='login-modal-text'>
                  <h2 className="">Login to SwipTory</h2>
              </div>
              <div className=''>
                  <div className="field-value   ">
                      <label htmlFor="username" className="">Username</label>
                      <input
                          type="text"
                          id="username"
                          placeholder="Enter your username"
                          className="input-field "
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                      />
                  </div>
                  <div className="field-value ">
                      <label htmlFor="password" className="">Password</label>
                      <div style={{ position: 'relative' }}>
                          <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              placeholder="Enter your password"
                              className="input-field"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                          />
                          <span
                              style={{
                                  position: 'absolute',
                                  top: '50%',
                                  right: '1rem',
                                  transform: 'translateY(-50%)',
                                  cursor: 'pointer'
                              }}
                              onClick={() => setShowPassword(!showPassword)} 
                          >
                              <GoEye />
                          </span>
                      </div>
                  </div>
                  <p className='status-message'>{statusMessage}</p>
                  <div className='modal-button'>
                      <button
                          id='button-form-register'
                          className='button '
                          onClick={handleLogin} 
                      >
                          Login
                      </button>
                      {loading && <PropagateLoader color="#000000" 
                      cssOverride={loadingSpinnerStyles}
                      />} {/* Show spinner only when loading */}

                  </div>
              </div>
          </div>
      </div>
  );
}

export default LoginModal;
