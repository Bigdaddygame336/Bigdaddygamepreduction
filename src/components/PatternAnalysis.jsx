import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, Eye, Zap } from 'lucide-react';

const PatternAnalysis = ({ gameHistory }) => {
  const [patterns, setPatterns] = useState(null);
  const [hotNumbers, setHotNumbers] = useState([]);
  const [coldNumbers, setColdNumbers] = useState([]);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (gameHistory.length > 0) {
      analyzePatterns();
    }
  }, [gameHistory]);

  const analyzePatterns = () => {
    const recent = gameHistory.slice(0, 20);
    
    // Analyze sequences and patterns
    const colorSequences = recent.map(g => g.color);
    const numberSequences = recent.map(g => g.number);
    
    // Find repeating patterns
    const findRepeatingPatterns = (sequence, length) => {
      const patterns = {};
      for (let i = 0; i <= sequence.length - length; i++) {
        const pattern = sequence.slice(i, i + length).join('-');
        patterns[pattern] = (patterns[pattern] || 0) + 1;
      }
      return Object.entries(patterns)
        .filter(([_, count]) => count > 1)
        .sort(([_, a], [__, b]) => b - a);
    };

    // Color patterns
    const colorPatterns2 = findRepeatingPatterns(colorSequences, 2);
    const colorPatterns3 = findRepeatingPatterns(colorSequences, 3);

    // Number frequency analysis
    const numberFreq = {};
    gameHistory.forEach(game => {
      numberFreq[game.number] = (numberFreq[game.number] || 0) + 1;
    });

    // Hot and cold numbers
    const sortedNumbers = Object.entries(numberFreq)
      .sort(([_, a], [__, b]) => b - a);
    
    const hot = sortedNumbers.slice(0, 3).map(([num, count]) => ({ number: parseInt(num), count }));
    const cold = sortedNumbers.slice(-3).map(([num, count]) => ({ number: parseInt(num), count }));

    // Gap analysis (distance between same colors)
    const gapAnalysis = {};
    ['red', 'green', 'violet'].forEach(color => {
      const positions = [];
      recent.forEach((game, index) => {
        if (game.color === color) positions.push(index);
      });
      
      const gaps = [];
      for (let i = 1; i < positions.length; i++) {
        gaps.push(positions[i] - positions[i-1]);
      }
      
      gapAnalysis[color] = {
        averageGap: gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0,
        lastGap: positions.length > 0 ? positions[0] : recent.length,
        positions: positions
      };
    });

    // Generate predictions based on patterns
    const generatePredictions = () => {
      const preds = [];
      
      // Anti-streak prediction
      const lastThree = colorSequences.slice(0, 3);
      if (lastThree.every(c => c === lastThree[0])) {
        const otherColors = ['red', 'green', 'violet'].filter(c => c !== lastThree[0]);
        preds.push({
          type: 'Anti-Streak',
          prediction: otherColors[Math.floor(Math.random() * otherColors.length)],
          confidence: 75,
          reason: `${lastThree[0].toUpperCase()} appeared 3 times in a row`
        });
      }

      // Gap-based prediction
      Object.entries(gapAnalysis).forEach(([color, data]) => {
        if (data.lastGap > data.averageGap * 1.5) {
          preds.push({
            type: 'Gap Analysis',
            prediction: color,
            confidence: 60 + Math.min(data.lastGap * 2, 20),
            reason: `${color.toUpperCase()} is overdue (last seen ${data.lastGap} rounds ago)`
          });
        }
      });

      // Pattern continuation
      if (colorPatterns2.length > 0) {
        const mostCommon = colorPatterns2[0][0];
        const [first, second] = mostCommon.split('-');
        if (colorSequences[0] === first) {
          preds.push({
            type: 'Pattern Continuation',
            prediction: second,
            confidence: 55,
            reason: `Pattern ${first}-${second} has occurred ${colorPatterns2[0][1]} times`
          });
        }
      }

      return preds.slice(0, 3); // Top 3 predictions
    };

    setPatterns({
      colorPatterns2,
      colorPatterns3,
      gapAnalysis,
      recentSequence: colorSequences.slice(0, 10)
    });

    setHotNumbers(hot);
    setColdNumbers(cold);
    setPredictions(generatePredictions());
  };

  if (!patterns) {
    return (
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <TrendingUp size={24} />
          Pattern Analysis
        </h2>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          fontSize: '1.1em'
        }}>
          Analyzing patterns... Need more data for comprehensive analysis.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <TrendingUp size={24} />
        Advanced Pattern Analysis
      </h2>

      {/* AI Predictions */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <Brain size={20} />
          AI Predictions
        </h3>
        
        {predictions.length === 0 ? (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '12px', 
            padding: '20px',
            textAlign: 'center',
            color: '#666'
          }}>
            No clear patterns detected. Continue playing for better predictions.
          </div>
        ) : (
          <div className="grid">
            {predictions.map((pred, index) => (
              <div
                key={index}
                style={{
                  background: `linear-gradient(135deg, ${
                    pred.prediction === 'red' ? '#ff416c, #ff4b2b' :
                    pred.prediction === 'green' ? '#56ab2f, #a8e6cf' :
                    '#667eea, #764ba2'
                  })`,
                  color: 'white',
                  borderRadius: '15px',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Zap size={20} />
                  <strong>{pred.type}</strong>
                </div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '10px' }}>
                  {pred.prediction.toUpperCase()}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  Confidence: {pred.confidence}%
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>
                  {pred.reason}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid">
        {/* Hot & Cold Numbers */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '20px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Eye size={20} />
            Hot & Cold Numbers
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#ff416c', marginBottom: '10px' }}>🔥 Hot Numbers</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {hotNumbers.map(({ number, count }) => (
                <div
                  key={number}
                  style={{
                    background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '60px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{number}</div>
                  <div style={{ fontSize: '0.8em' }}>{count}x</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: '#667eea', marginBottom: '10px' }}>🧊 Cold Numbers</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {coldNumbers.map(({ number, count }) => (
                <div
                  key={number}
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '60px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{number}</div>
                  <div style={{ fontSize: '0.8em' }}>{count}x</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Sequence Analysis */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Recent Sequence (Last 10)</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {patterns.recentSequence.map((color, index) => (
              <div
                key={index}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${
                    color === 'red' ? '#ff416c, #ff4b2b' :
                    color === 'green' ? '#56ab2f, #a8e6cf' :
                    '#667eea, #764ba2'
                  })`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.8em',
                  position: 'relative'
                }}
                title={`Position ${index + 1}: ${color}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          
          {/* Sequence Patterns */}
          <div>
            <h4 style={{ marginBottom: '10px' }}>Detected Patterns</h4>
            {patterns.colorPatterns2.length > 0 ? (
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                {patterns.colorPatterns2.slice(0, 3).map(([pattern, count], index) => (
                  <div key={index} style={{ marginBottom: '5px' }}>
                    • Pattern "{pattern.replace('-', ' → ')}" appeared {count} times
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                No repeating patterns detected in recent games.
              </div>
            )}
          </div>
        </div>

        {/* Gap Analysis */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Gap Analysis</h3>
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            {Object.entries(patterns.gapAnalysis).map(([color, data]) => (
              <div key={color} style={{ marginBottom: '15px' }}>
                <div style={{ 
                  color: color === 'red' ? '#ff416c' : color === 'green' ? '#56ab2f' : '#667eea',
                  fontWeight: 'bold',
                  marginBottom: '5px'
                }}>
                  {color.toUpperCase()}:
                </div>
                <div>• Last seen: {data.lastGap} rounds ago</div>
                <div>• Average gap: {data.averageGap.toFixed(1)} rounds</div>
                <div>• Status: {data.lastGap > data.averageGap ? '⚠️ Overdue' : '✅ Normal'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Recommendations */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Strategy Recommendations</h3>
          <div style={{ fontSize: '0.9em', color: '#666', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>📊 Based on current patterns:</strong>
            </div>
            <div>• Consider anti-streak betting after 3+ consecutive colors</div>
            <div>• Watch for overdue colors in gap analysis</div>
            <div>• Violet (0,5) has lower frequency but higher payout</div>
            <div>• Use pattern continuation for short-term predictions</div>
            <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
              <strong>⚠️ Remember:</strong> All predictions are based on historical data. 
              Each game result is independent. Bet responsibly!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternAnalysis;