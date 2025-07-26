import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const GameTimer = ({ onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameNumber, setGameNumber] = useState(240001);
  const [isActive, setIsActive] = useState(true);

  const getNumberColor = (num) => {
    if (num === 0 || num === 5) return 'violet';
    if ([1, 3, 7, 9].includes(num)) return 'green';
    if ([2, 4, 6, 8].includes(num)) return 'red';
    return 'red';
  };

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Generate random result
      const resultNumber = Math.floor(Math.random() * 10);
      const resultColor = getNumberColor(resultNumber);
      
      if (onTimeUp) {
        onTimeUp({ number: resultNumber, color: resultColor });
      }
      
      // Reset timer for next round
      setTimeLeft(30);
      setGameNumber(prev => prev + 1);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 5) return '#ff416c';
    if (timeLeft <= 10) return '#f093fb';
    return '#667eea';
  };

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <Clock size={32} color={getTimerColor()} />
        <div>
          <h2 style={{ margin: 0, color: '#333' }}>Game #{gameNumber}</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>
            Next round in:
          </p>
        </div>
      </div>

      <div 
        className="timer"
        style={{ 
          color: getTimerColor(),
          textShadow: `2px 2px 4px ${getTimerColor()}33`
        }}
      >
        {formatTime(timeLeft)}
      </div>

      <div style={{
        width: '100%',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '20px'
      }}>
        <div style={{
          width: `${(timeLeft / 30) * 100}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${getTimerColor()}, ${getTimerColor()}aa)`,
          transition: 'width 1s linear',
          borderRadius: '4px'
        }} />
      </div>

      <div style={{ 
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.9em',
        color: '#666'
      }}>
        <span>Betting {timeLeft > 5 ? 'Open' : 'Closed'}</span>
        <span>{timeLeft <= 5 ? 'Drawing...' : 'Place your bets!'}</span>
      </div>
    </div>
  );
};

export default GameTimer;