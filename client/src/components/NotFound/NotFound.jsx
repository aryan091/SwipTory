import React from 'react'
import NotFoundImg from '../../assets/NotFound.jpg'
import './NotFound.css'
import { useNavigate } from 'react-router-dom'
const NotFound = () => {

    const navigate = useNavigate()
  return (
    <div className='notFound '>
        <div>
        <h1 className='notFound-heading-text'
        onClick={() => navigate('/')}
        >SwipTory</h1>
      </div>
        <img  className='notFoundImg' src={NotFoundImg} alt="" />
        <button className='notFoundBtn'
        onClick={() => navigate('/')}
        >Go Back To Home</button>
    </div>
  )
}

export default NotFound