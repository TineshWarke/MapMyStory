import React, { useEffect, useState } from 'react';
import { handelError } from '../utils';

const StarRating = ({ onRatingChange }) => {
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState({ username: '' })

  const handleClick = (index) => {
    setRating(index);
    onRatingChange(index);
  };

  const getUser = async () => {
    try {
      const url = "https://map-my-story-server.vercel.app/auth/getuser";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      const result = await response.json();
      const { success, message, rating, error } = result;
      if (success) {
        console.log(message);
        setRating(rating);
      } else if (error) {
        const details = error?.details[0].message;
        handelError(details);
      } else if (!success) {
        handelError(message);
      }
    } catch (err) {
      handelError(err);
    }
  };

  useEffect(() => {
    user.username = localStorage.getItem('loggedInUser');
    getUser();
}, []);

  return (
    <div style={{ display: 'flex', cursor: 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star, index) => (
        <Star key={index} filled={index < rating} onClick={() => handleClick(index + 1)} />
      ))}
    </div>
  );
};

const Star = ({ filled, onClick }) => (
  <span onClick={onClick} style={{ fontSize: '24px', color: filled ? '#FFD700' : '#CCC' }}>
    ★
  </span>
);

export default StarRating;
