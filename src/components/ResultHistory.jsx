import React from 'react';
import { History, Clock } from 'lucide-react';

const ResultHistory = ({ gameHistory }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
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
    <div className="card">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <History size={24} />
        Game Results History
      </h2>

      {gameHistory.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          fontSize: '1.1em'
        }}>
          No game results yet. Play some games to see history!
        </div>
      ) : (
        <>
          {/* Recent Results Grid */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Last 10 Results</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '10px'
            }}>
              {gameHistory.slice(0, 10).map((game) => (
                <div
                  key={game.id}
                  style={{
                    background: `linear-gradient(135deg, ${
                      game.color === 'red' ? '#ff416c, #ff4b2b' :
                      game.color === 'green' ? '#56ab2f, #a8e6cf' :
                      '#667eea, #764ba2'
                    })`,
                    color: 'white',
                    padding: '15px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  <div style={{ fontSize: '1.5em', marginBottom: '5px' }}>
                    {game.number}
                  </div>
                  <div style={{ fontSize: '0.8em', opacity: 0.9 }}>
                    {game.color.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed History List */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Detailed History</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {gameHistory.map((game) => (
                <div key={game.id} className="history-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${
                          game.color === 'red' ? '#ff416c, #ff4b2b' :
                          game.color === 'green' ? '#56ab2f, #a8e6cf' :
                          '#667eea, #764ba2'
                        })`,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}
                    >
                      {game.number}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                        Game #{game.id}
                      </div>
                      <div style={{ color: '#666', fontSize: '0.9em' }}>
                        Color: {game.color.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
                      <Clock size={16} />
                      {formatTime(game.time)}
                    </div>
                    <div style={{ fontSize: '0.8em', color: '#999', marginTop: '2px' }}>
                      {new Date(game.time).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Distribution */}
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Color Distribution</h3>
            {(() => {
              const colorCounts = { red: 0, green: 0, violet: 0 };
              gameHistory.forEach(game => colorCounts[game.color]++);
              const total = gameHistory.length;

              return (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px'
                }}>
                  {Object.entries(colorCounts).map(([color, count]) => {
                    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                    return (
                      <div
                        key={color}
                        style={{
                          background: `linear-gradient(135deg, ${
                            color === 'red' ? '#ff416c, #ff4b2b' :
                            color === 'green' ? '#56ab2f, #a8e6cf' :
                            '#667eea, #764ba2'
                          })`,
                          color: 'white',
                          padding: '20px',
                          borderRadius: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '5px' }}>
                          {count}
                        </div>
                        <div style={{ fontSize: '1.1em', marginBottom: '5px' }}>
                          {color.toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.9em', opacity: 0.9 }}>
                          {percentage}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
};

export default ResultHistory;