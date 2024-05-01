// RegisterModal.js
import React , { useState , useEffect} from 'react';
import axios from 'axios';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { toast } from 'react-toastify';
import { GoEye } from "react-icons/go";
import "./RegisterModal.css"
const RegisterModal = ({ closeModal }) => {

  console.log("Register Modal")

    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage , setStatusMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const handleRegister = async () => {
    try {
        const reqUrl = `${import.meta.env.VITE_BACKEND_URL}/user/register`;
        
        const response = await axios.post(reqUrl, {
            username,
            password
        });
        console.log(response.data);
        setStatusMessage(response.data)

        toast.success(`${username} Registered Successfully!`);

        closeModal();
        return response.data ;
    } catch (error) {
        setStatusMessage(error.response.data.message)
    }
  }

  useEffect(() => {
    // Disable scroll bar when the modal is open
    document.body.classList.add('modal-open');
    return () => {
      // Re-enable scroll bar when the modal is closed
      document.body.classList.remove('modal-open');
    };
  }, []);


  return (
    <div className="login-modal ">
      <div className="login-modal-content ">
      <IoMdCloseCircleOutline style={{ position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer', fontSize: '1.5rem', color: 'red' }}
onClick={closeModal} />
        <div className='login-modal-text'>
          <h2 className="">Register to SwipTory</h2>
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
                                onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                            >
                                <GoEye />
                            </span>
            </div>
            
        </div>
        
        <div className='modal-button'>
        <button
          id='button-form-register'
          className='button '
          onClick={handleRegister} // Call closeModal to close the modal
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

export default RegisterModal;
