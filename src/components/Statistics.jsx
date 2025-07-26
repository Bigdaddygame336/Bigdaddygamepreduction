import React from 'react';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Statistics = ({ gameHistory }) => {
  // Calculate statistics
  const calculateStats = () => {
    if (gameHistory.length === 0) return null;

    const colorCounts = { red: 0, green: 0, violet: 0 };
    const numberCounts = {};
    const hourlyData = {};

    gameHistory.forEach(game => {
      colorCounts[game.color]++;
      numberCounts[game.number] = (numberCounts[game.number] || 0) + 1;
      
      const hour = new Date(game.time).getHours();
      hourlyData[hour] = (hourlyData[hour] || 0) + 1;
    });

    // Most frequent number
    const mostFrequentNumber = Object.entries(numberCounts)
      .sort(([,a], [,b]) => b - a)[0];

    // Longest streak
    let longestStreak = 1;
    let currentStreak = 1;
    let streakColor = gameHistory[0]?.color;

    for (let i = 1; i < gameHistory.length; i++) {
      if (gameHistory[i].color === gameHistory[i-1].color) {
        currentStreak++;
      } else {
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
          streakColor = gameHistory[i-1].color;
        }
        currentStreak = 1;
      }
    }

    return {
      colorCounts,
      numberCounts,
      hourlyData,
      mostFrequentNumber,
      longestStreak,
      streakColor,
      totalGames: gameHistory.length
    };
  };

  const stats = calculateStats();

  if (!stats) {
    return (
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <BarChart3 size={24} />
          Game Statistics
        </h2>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          fontSize: '1.1em'
        }}>
          No data available for statistics. Play some games first!
        </div>
      </div>
    );
  }

  // Prepare chart data
  const colorChartData = Object.entries(stats.colorCounts).map(([color, count]) => ({
    name: color.toUpperCase(),
    value: count,
    fill: color === 'red' ? '#ff416c' : color === 'green' ? '#56ab2f' : '#667eea'
  }));

  const numberChartData = Object.entries(stats.numberCounts)
    .map(([number, count]) => ({ number: parseInt(number), count }))
    .sort((a, b) => a.number - b.number);

  const COLORS = ['#ff416c', '#56ab2f', '#667eea'];

  return (
    <div className="card">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <BarChart3 size={24} />
        Game Statistics
      </h2>

      {/* Key Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#667eea' }}>
            {stats.totalGames}
          </div>
          <div>Total Games</div>
        </div>

        <div className="stat-card">
          <div className="stat-number" style={{ color: '#56ab2f' }}>
            {stats.mostFrequentNumber[0]}
          </div>
          <div>Most Frequent Number</div>
          <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
            Appeared {stats.mostFrequentNumber[1]} times
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-number" style={{ color: '#ff416c' }}>
            {stats.longestStreak}
          </div>
          <div>Longest Streak</div>
          <div style={{ 
            fontSize: '0.8em', 
            color: stats.streakColor === 'red' ? '#ff416c' : 
                  stats.streakColor === 'green' ? '#56ab2f' : '#667eea',
            marginTop: '5px',
            fontWeight: 'bold'
          }}>
            {stats.streakColor.toUpperCase()}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-number" style={{ color: '#f093fb' }}>
            {Math.round((stats.colorCounts.violet / stats.totalGames) * 100)}%
          </div>
          <div>Violet Frequency</div>
          <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
            Rarest outcome
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid">
        {/* Color Distribution Pie Chart */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '20px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
            Color Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={colorChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {colorChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Number Frequency Bar Chart */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '20px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
            Number Frequency
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={numberChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="number" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pattern Analysis */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '20px', color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TrendingUp size={20} />
          Pattern Analysis
        </h3>
        
        <div className="grid">
          {/* Recent Trends */}
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '20px' }}>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>Recent Trends (Last 10)</h4>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {gameHistory.slice(0, 10).map((game, index) => (
                <div
                  key={game.id}
                  style={{
                    width: '40px',
                    height: '40px',
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
                    fontSize: '0.9em'
                  }}
                >
                  {game.number}
                </div>
              ))}
            </div>
          </div>

          {/* Win Rate Analysis */}
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '20px' }}>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>Probability Insights</h4>
            <div style={{ fontSize: '0.9em', color: '#666', lineHeight: '1.6' }}>
              <p>• Red/Green appear in {Math.round(((stats.colorCounts.red + stats.colorCounts.green) / stats.totalGames) * 100)}% of games</p>
              <p>• Violet appears in {Math.round((stats.colorCounts.violet / stats.totalGames) * 100)}% of games</p>
              <p>• Numbers 0 & 5 (Violet) have {Math.round(((stats.numberCounts[0] || 0) + (stats.numberCounts[5] || 0)) / stats.totalGames * 100)}% frequency</p>
              <p>• Even numbers appear {Math.round(([0,2,4,6,8].reduce((sum, n) => sum + (stats.numberCounts[n] || 0), 0) / stats.totalGames) * 100)}% of the time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;