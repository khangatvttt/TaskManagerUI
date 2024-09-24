import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = new Date(targetDate) - now;

      let timeLeft = '';

      if (difference > 0) {
        const seconds = Math.floor((difference / 1000) % 60);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) {
          timeLeft = `${years}y left`;
        } else if (months > 0) {
          timeLeft = `${months}m left`;
        } else if (days > 0) {
          timeLeft = `${days}d left`;
        } else if (hours > 0) {
          timeLeft = `${hours}h left`;
        } else if (minutes > 0) {
          timeLeft = `${minutes}m left`;
        } else {
          timeLeft = `${seconds}s left`;
        }
      } else {
        timeLeft = "Time's up";
      }

      setTimeLeft(timeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

export default CountdownTimer;
