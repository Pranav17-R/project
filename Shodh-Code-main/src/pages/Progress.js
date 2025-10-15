import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiCalendar, FiTarget, FiBarChart } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import api from '../services/api';
import './Progress.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Progress = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [progressData, setProgressData] = useState(null);
  const [streak, setStreak] = useState(0);
  const [profile, setProfile] = useState(null);
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [weeklySolved, setWeeklySolved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgressData();
  }, [selectedTimeframe]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [summary, timeline, me] = await Promise.all([
        api.getProgressSummary(),
        api.getProgressTimeline(30),
        api.getProfile()
      ]);

      setProgressData({
        summary,
        timeline: timeline.items
      });

      setProfile(me);
      setWeeklyGoal(Number(me?.weeklyGoal || 0));
      setMonthlyGoal(Number(me?.monthlyGoal || 0));

      // Compute current streak: consecutive days up to today with count > 0
      const countsByDate = new Set(
        (timeline.items || []).filter(it => it.count > 0).map(it => {
          const y = it._id.y;
          const m = String(it._id.m).padStart(2, '0');
          const d = String(it._id.d).padStart(2, '0');
          return `${y}-${m}-${d}`;
        })
      );
      let s = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const da = String(d.getDate()).padStart(2, '0');
        const key = `${y}-${m}-${da}`;
        if (countsByDate.has(key)) {
          s += 1;
        } else {
          break;
        }
      }
      setStreak(s);

      // Compute solved in last 7 days for weekly progress
      const countsByDateMap = new Map(
        (timeline.items || []).map(it => {
          const key = `${it._id.y}-${String(it._id.m).padStart(2, '0')}-${String(it._id.d).padStart(2, '0')}`;
          return [key, it.count];
        })
      );
      const now = new Date();
      let weekSum = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        weekSum += countsByDateMap.get(key) || 0;
      }
      setWeeklySolved(weekSum);
    } catch (err) {
      console.error('Failed to fetch progress data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Problems Solved',
        data: progressData?.timeline?.map((item, index) => item.count) || [8, 12, 15, 18],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const difficultyData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Solved',
        data: progressData?.summary?.byDifficulty?.map(item => {
          const difficulty = item._id.toLowerCase();
          return difficulty === 'easy' ? item.count : 
                 difficulty === 'medium' ? item.count : item.count;
        }) || [45, 32, 12],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topicData = {
    labels: progressData?.summary?.byTag?.slice(0, 7).map(item => item._id) || ['Array', 'String', 'DP', 'Tree', 'Graph', 'Stack', 'Queue'],
    datasets: [
      {
        label: 'Problems Solved',
        data: progressData?.summary?.byTag?.slice(0, 7).map(item => item.count) || [25, 18, 12, 15, 8, 10, 7],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const platformData = {
    labels: (progressData?.summary?.byPlatform || []).map(p => p._id),
    datasets: [
      {
        data: (progressData?.summary?.byPlatform || []).map(p => p.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(99, 102, 241, 0.8)'
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Solved your first 10 problems",
      icon: "🎯",
      achieved: true,
      date: "2024-01-10"
    },
    {
      id: 2,
      title: "Consistency",
      description: "Solved problems for 7 consecutive days",
      icon: "🔥",
      achieved: true,
      date: "2024-01-15"
    },
    {
      id: 3,
      title: "Medium Master",
      description: "Solved 25 medium difficulty problems",
      icon: "⚡",
      achieved: false,
      progress: 20
    },
    {
      id: 4,
      title: "Array Expert",
      description: "Solved 50 array-based problems",
      icon: "📊",
      achieved: false,
      progress: 45
    }
  ];

  // Real-time counts for easy/medium
  const easyCount = (progressData?.summary?.byDifficulty || []).find(d => d._id === 'Easy')?.count || 0;
  const mediumCount = (progressData?.summary?.byDifficulty || []).find(d => d._id === 'Medium')?.count || 0;
  const handleSaveWeeklyGoal = async () => {
    try {
      const updated = await api.updateProfile({ weeklyGoal: Number(weeklyGoal) });
      setProfile(updated);
    } catch (err) {
      alert(err.message || 'Failed to update weekly goal');
    }
  };

  const handleSaveMonthlyGoal = async () => {
    try {
      const updated = await api.updateProfile({ monthlyGoal: Number(monthlyGoal) });
      setProfile(updated);
    } catch (err) {
      alert(err.message || 'Failed to update monthly goal');
    }
  };

  if (loading) {
    return (
      <div className="progress-page">
        <div className="page-header">
          <h1 className="page-title">Progress Analytics</h1>
          <p className="page-subtitle">Track your learning journey and achievements</p>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-page">
        <div className="page-header">
          <h1 className="page-title">Progress Analytics</h1>
          <p className="page-subtitle">Track your learning journey and achievements</p>
        </div>
        <div className="error-state">
          <p>Error loading progress: {error}</p>
          <button onClick={fetchProgressData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-page">
      <div className="page-header">
        <h1 className="page-title">Progress Analytics</h1>
        <p className="page-subtitle">Track your learning journey and achievements</p>
      </div>

      <div className="progress-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FiTrendingUp />
          </div>
          <h3>Total Solved</h3>
          <div className="stat-value">{progressData?.summary?.total || 0}</div>
          <div className="stat-change">
            +12 this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <h3>Current Streak</h3>
          <div className="stat-value">{streak} {streak === 1 ? 'day' : 'days'}</div>
          <div className="stat-change">
            Keep it up!
          </div>
        </div>

        
      </div>

      <div className="progress-content">
        <div className="chart-section">
          <div className="section-header">
            <h2>Progress Over Time</h2>
            <div className="timeframe-selector">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="timeframe-select"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="goals-section">
          <div className="section-header">
            <h2>Goals & Targets</h2>
            <p>Track your progress towards your learning goals</p>
          </div>
          <div className="goals-grid">
            <div className="goal-card">
              <div className="goal-header">
                <h3>Weekly Goal</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="number" min="0" value={weeklyGoal} onChange={(e) => setWeeklyGoal(Number(e.target.value))} className="timeframe-select" style={{ width: 90 }} />
                  <button className="btn btn-primary" onClick={handleSaveWeeklyGoal}>Save</button>
                </div>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${weeklyGoal ? Math.min(100, Math.round((weeklySolved / weeklyGoal) * 100)) : 0}%` }}
                  ></div>
                </div>
                <div className="goal-stats">
                  <span>{weeklySolved}</span>
                  <span>/ {weeklyGoal} problems</span>
                </div>
              </div>
            </div>

            <div className="goal-card">
              <div className="goal-header">
                <h3>Monthly Goal</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="number" min="0" value={monthlyGoal} onChange={(e) => setMonthlyGoal(Number(e.target.value))} className="timeframe-select" style={{ width: 90 }} />
                  <button className="btn btn-primary" onClick={handleSaveMonthlyGoal}>Save</button>
                </div>
              </div>
              <div className="goal-progress">
                <div className="goal-stats">
                  <span>{progressData?.summary?.total || 0}</span>
                  <span>/ {monthlyGoal} problems</span>
                </div>
              </div>
            </div>

            <div className="goal-card">
              <div className="goal-header">
                <h3>Easy Problems</h3>
                <span className="goal-percentage">{easyCount}</span>
              </div>
              <div className="goal-progress">
                <div className="goal-stats">
                  <span>{easyCount}</span>
                  <span> solved</span>
                </div>
              </div>
            </div>

            <div className="goal-card">
              <div className="goal-header">
                <h3>Medium Problems</h3>
                <span className="goal-percentage">{mediumCount}</span>
              </div>
              <div className="goal-progress">
                <div className="goal-stats">
                  <span>{mediumCount}</span>
                  <span> solved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="section-header">
            <h2>Difficulty Distribution</h2>
            <p>Breakdown of solved problems by difficulty</p>
          </div>
          <div className="chart-container">
            <Doughnut data={difficultyData} options={doughnutOptions} />
          </div>
        </div>

        <div className="analytics-card">
          <div className="section-header">
            <h2>Topic Performance</h2>
            <p>Problems solved by topic category</p>
          </div>
          <div className="chart-container">
            <Bar data={topicData} options={barOptions} />
          </div>
        </div>

        <div className="analytics-card">
          <div className="section-header">
            <h2>Platform Usage</h2>
            <p>Problems solved across different platforms</p>
          </div>
          <div className="chart-container">
            <Doughnut data={platformData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <div className="section-header">
          <h2>Achievements & Milestones</h2>
          <p>Celebrate your learning milestones</p>
        </div>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div key={achievement.id} className={`achievement-card ${achievement.achieved ? 'achieved' : ''}`}>
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-content">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                {achievement.achieved ? (
                  <span className="achievement-date">Achieved: {achievement.date}</span>
                ) : (
                  <div className="achievement-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                    <span>{achievement.progress}% complete</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress; 