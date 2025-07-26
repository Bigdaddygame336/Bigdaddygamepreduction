import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Target, BarChart3, History, Settings } from 'lucide-react';
import PredictionEngine from './components/PredictionEngine';
import GameTimer from './components/GameTimer';
import ResultHistory from './components/ResultHistory';
import Statistics from './components/Statistics';
import PatternAnalysis from './components/PatternAnalysis';

function App() {
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [userBalance, setUserBalance] = useState(10000);
  const [activeTab, setActiveTab] = useState('prediction');
  const [lastResult, setLastResult] = useState(null);

  // Initialize with some sample data
  useEffect(() => {
    const sampleHistory = [
      { id: 1, number: 5, color: 'green', time: new Date(Date.now() - 300000) },
      { id: 2, number: 2, color: 'red', time: new Date(Date.now() - 240000) },
      { id: 3, number: 8, color: 'red', time: new Date(Date.now() - 180000) },
      { id: 4, number: 0, color: 'violet', time: new Date(Date.now() - 120000) },
      { id: 5, number: 7, color: 'green', time: new Date(Date.now() - 60000) },
    ];
    setGameHistory(sampleHistory);
  }, []);

  const handleNewResult = (result) => {
    const newResult = {
      id: gameHistory.length + 1,
      number: result.number,
      color: result.color,
      time: new Date()
    };
    
    setGameHistory(prev => [newResult, ...prev.slice(0, 49)]); // Keep last 50 results
    setLastResult(newResult);
  };

  const getColorClass = (color) => {
    switch(color) {
      case 'red': return 'result-red';
      case 'green': return 'result-green';
      case 'violet': return 'result-violet';
      default: return 'result-red';
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ 
            fontSize: '3em', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            55 Club Wingo
          </h1>
          <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '20px' }}>
            Advanced Color Prediction System
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '12px',
              fontWeight: 'bold'
            }}>
              Balance: ₹{userBalance.toLocaleString()}
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '10px 20px',
              borderRadius: '12px',
              fontWeight: 'bold'
            }}>
              Games Played: {gameHistory.length}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px', 
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'prediction', icon: Target, label: 'Prediction' },
            { id: 'history', icon: History, label: 'History' },
            { id: 'stats', icon: BarChart3, label: 'Statistics' },
            { id: 'patterns', icon: TrendingUp, label: 'Patterns' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'rgba(255, 255, 255, 0.2)',
                color: activeTab === tab.id ? 'white' : '#666'
              }}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Game Timer */}
      <GameTimer onTimeUp={handleNewResult} />

      {/* Last Result Display */}
      {lastResult && (
        <div className={`result-display ${getColorClass(lastResult.color)}`}>
          Last Result: {lastResult.number} ({lastResult.color.toUpperCase()})
        </div>
      )}

      {/* Main Content Based on Active Tab */}
      {activeTab === 'prediction' && (
        <PredictionEngine 
          gameHistory={gameHistory}
          onPrediction={setCurrentPrediction}
          userBalance={userBalance}
          setUserBalance={setUserBalance}
        />
      )}

      {activeTab === 'history' && (
        <ResultHistory gameHistory={gameHistory} />
      )}

      {activeTab === 'stats' && (
        <Statistics gameHistory={gameHistory} />
      )}

      {activeTab === 'patterns' && (
        <PatternAnalysis gameHistory={gameHistory} />
      )}

      {/* Footer */}
      <div className="card" style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: '#666', fontSize: '0.9em' }}>
          🎯 Disclaimer: This is for entertainment purposes only. Gambling involves risk.
        </p>
        <p style={{ color: '#666', fontSize: '0.8em', marginTop: '10px' }}>
          Made with ❤️ for 55 Club Players
        </p>
      </div>
    </div>
  );
}

export default App;