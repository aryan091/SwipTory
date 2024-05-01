// RegisterModal.js
import React , { useState , useEffect ,useContext} from 'react';
import "./LoginModal.css"
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { toast } from 'react-toastify';
import { GoEye } from "react-icons/go";
const LoginModal = ({ closeModal }) => {

    const { setIsUserLoggedIn , setUsername, setId } = useContext(UserContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);  

  const [statusMessage , setStatusMessage] = useState('')
  const handleLogin = async () => {
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
    }
  };

  useEffect(() => {

    document.body.classList.add('modal-open');
    return () => {

      document.body.classList.remove('modal-open');
    };
  }, []);

  

  return (
    <div className="login-modal ">
      <div className="login-modal-content ">
      <IoMdCloseCircleOutline style={{ position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer', fontSize: '1.5rem', color: 'red' }}
onClick={closeModal} />
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
        
        <div className='modal-button'>
        <button
          id='button-form-register'
          className='button '
          onClick={handleLogin} 
        >
          Login
        </button>
        </div>
        
        <p>{statusMessage}</p>
      </div>
      </div>
    </div>
  );
}

export default LoginModal;
