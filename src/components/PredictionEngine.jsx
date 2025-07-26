import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';

const PredictionEngine = ({ gameHistory, onPrediction, userBalance, setUserBalance }) => {
  const [aiPrediction, setAiPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [selectedBet, setSelectedBet] = useState(null);
  const [betAmount, setBetAmount] = useState(100);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Wingo number to color mapping
  const getNumberColor = (num) => {
    if (num === 0 || num === 5) return 'violet';
    if ([1, 3, 7, 9].includes(num)) return 'green';
    if ([2, 4, 6, 8].includes(num)) return 'red';
    return 'red';
  };

  // Advanced prediction algorithm
  const generatePrediction = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      if (gameHistory.length < 3) {
        // Random prediction for insufficient data
        const colors = ['red', 'green', 'violet'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setAiPrediction({
          color: randomColor,
          probability: 33 + Math.random() * 20,
          method: 'Random (Insufficient Data)'
        });
        setConfidence(40 + Math.random() * 20);
        setIsAnalyzing(false);
        return;
      }

      // Pattern Analysis
      const recent = gameHistory.slice(0, 10);
      const colorCounts = { red: 0, green: 0, violet: 0 };
      
      recent.forEach(game => {
        colorCounts[game.color]++;
      });

      // Trend Analysis
      const recentColors = recent.map(g => g.color);
      const lastColor = recentColors[0];
      const secondLastColor = recentColors[1];
      
      // Anti-pattern logic (if same color repeated, predict different)
      let predictedColor;
      let method = 'Pattern Analysis';
      let probability = 50;

      // Check for streaks
      let streak = 1;
      for (let i = 1; i < recentColors.length; i++) {
        if (recentColors[i] === lastColor) {
          streak++;
        } else {
          break;
        }
      }

      if (streak >= 3) {
        // Anti-streak prediction
        const otherColors = ['red', 'green', 'violet'].filter(c => c !== lastColor);
        predictedColor = otherColors[Math.floor(Math.random() * otherColors.length)];
        method = 'Anti-Streak Analysis';
        probability = 60 + Math.random() * 15;
      } else if (colorCounts.red > colorCounts.green && colorCounts.red > colorCounts.violet) {
        // If red is dominant, predict green or violet
        predictedColor = Math.random() > 0.5 ? 'green' : 'violet';
        method = 'Frequency Analysis';
        probability = 55 + Math.random() * 15;
      } else if (colorCounts.green > colorCounts.violet) {
        predictedColor = Math.random() > 0.6 ? 'violet' : 'red';
        method = 'Frequency Analysis';
        probability = 55 + Math.random() * 15;
      } else {
        // Balanced prediction
        const weights = {
          red: (10 - colorCounts.red) / 10,
          green: (10 - colorCounts.green) / 10,
          violet: (10 - colorCounts.violet) / 10
        };
        
        const totalWeight = weights.red + weights.green + weights.violet;
        const random = Math.random() * totalWeight;
        
        if (random < weights.red) {
          predictedColor = 'red';
        } else if (random < weights.red + weights.green) {
          predictedColor = 'green';
        } else {
          predictedColor = 'violet';
        }
        method = 'Weighted Analysis';
        probability = 50 + Math.random() * 20;
      }

      setAiPrediction({
        color: predictedColor,
        probability: Math.round(probability),
        method: method
      });
      
      setConfidence(Math.round(probability));
      setIsAnalyzing(false);
      
      if (onPrediction) {
        onPrediction({ color: predictedColor, confidence: probability });
      }
    }, 2000); // Simulate AI processing time
  };

  const placeBet = (color) => {
    if (betAmount > userBalance) {
      alert('Insufficient balance!');
      return;
    }

    setSelectedBet({ color, amount: betAmount });
    setUserBalance(prev => prev - betAmount);
    
    // Simulate result after 3 seconds
    setTimeout(() => {
      const resultNumber = Math.floor(Math.random() * 10);
      const resultColor = getNumberColor(resultNumber);
      
      let winnings = 0;
      if (resultColor === color) {
        if (color === 'violet') {
          winnings = betAmount * 4.5; // Violet pays 4.5x
        } else {
          winnings = betAmount * 2; // Red/Green pays 2x
        }
        setUserBalance(prev => prev + winnings);
        alert(`🎉 You Won! Result: ${resultNumber} (${resultColor.toUpperCase()}) - Winnings: ₹${winnings}`);
      } else {
        alert(`❌ You Lost! Result: ${resultNumber} (${resultColor.toUpperCase()})`);
      }
      
      setSelectedBet(null);
    }, 3000);
  };

  return (
    <div className="grid">
      {/* AI Prediction Panel */}
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Brain size={24} />
          AI Prediction Engine
        </h2>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            onClick={generatePrediction}
            disabled={isAnalyzing}
            className="btn btn-primary"
            style={{ 
              background: isAnalyzing 
                ? 'linear-gradient(135deg, #ccc 0%, #999 100%)' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
          >
            {isAnalyzing ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #fff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Analyzing...
              </>
            ) : (
              <>
                <Zap size={20} />
                Generate Prediction
              </>
            )}
          </button>
        </div>

        {aiPrediction && (
          <div style={{ 
            background: `linear-gradient(135deg, ${
              aiPrediction.color === 'red' ? '#ff416c, #ff4b2b' :
              aiPrediction.color === 'green' ? '#56ab2f, #a8e6cf' :
              '#667eea, #764ba2'
            })`,
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '10px' }}>
              Predicted Color: {aiPrediction.color.toUpperCase()}
            </h3>
            <p style={{ marginBottom: '5px' }}>
              Confidence: {confidence}%
            </p>
            <p style={{ fontSize: '0.9em', opacity: 0.9 }}>
              Method: {aiPrediction.method}
            </p>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
          marginTop: '20px'
        }}>
          {gameHistory.slice(0, 5).map((game, index) => (
            <div key={game.id} style={{
              background: `linear-gradient(135deg, ${
                game.color === 'red' ? '#ff416c, #ff4b2b' :
                game.color === 'green' ? '#56ab2f, #a8e6cf' :
                '#667eea, #764ba2'
              })`,
              color: 'white',
              padding: '10px',
              borderRadius: '10px',
              textAlign: 'center',
              fontSize: '0.9em'
            }}>
              #{game.id}: {game.number}
            </div>
          ))}
        </div>
      </div>

      {/* Betting Panel */}
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Target size={24} />
          Place Your Bet
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Bet Amount: ₹{betAmount}
          </label>
          <input 
            type="range"
            min="10"
            max={Math.min(userBalance, 5000)}
            step="10"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {[100, 500, 1000, 2000].map(amount => (
              <button 
                key={amount}
                onClick={() => setBetAmount(amount)}
                className="btn"
                style={{ 
                  background: betAmount === amount 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  color: betAmount === amount ? 'white' : '#666',
                  fontSize: '0.8em',
                  padding: '8px 16px'
                }}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => placeBet('red')}
            className="color-btn red-btn"
            disabled={selectedBet !== null}
          >
            <span>RED</span>
            <span style={{ fontSize: '14px' }}>2x</span>
          </button>
          <button 
            onClick={() => placeBet('green')}
            className="color-btn green-btn"
            disabled={selectedBet !== null}
          >
            <span>GREEN</span>
            <span style={{ fontSize: '14px' }}>2x</span>
          </button>
          <button 
            onClick={() => placeBet('violet')}
            className="color-btn violet-btn"
            disabled={selectedBet !== null}
          >
            <span>VIOLET</span>
            <span style={{ fontSize: '14px' }}>4.5x</span>
          </button>
        </div>

        {selectedBet && (
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ fontWeight: 'bold' }}>
              Bet Placed: ₹{selectedBet.amount} on {selectedBet.color.toUpperCase()}
            </p>
            <p style={{ fontSize: '0.9em', marginTop: '5px' }}>
              Waiting for result...
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PredictionEngine;