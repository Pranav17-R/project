import React, { useState } from 'react';
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

  const progressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Problems Solved',
        data: [8, 12, 15, 18],
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
        data: [45, 32, 12],
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
    labels: ['Array', 'String', 'DP', 'Tree', 'Graph', 'Stack', 'Queue'],
    datasets: [
      {
        label: 'Problems Solved',
        data: [25, 18, 12, 15, 8, 10, 7],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const platformData = {
    labels: ['LeetCode', 'Codeforces', 'GeeksforGeeks'],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
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

  const goals = [
    {
      id: 1,
      title: "Monthly Goal",
      target: 50,
      current: 35,
      unit: "problems"
    },
    {
      id: 2,
      title: "Easy Problems",
      target: 30,
      current: 25,
      unit: "solved"
    },
    {
      id: 3,
      title: "Medium Problems",
      target: 20,
      current: 15,
      unit: "solved"
    }
  ];

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
          <div className="stat-value">89</div>
          <div className="stat-change">
            +12 this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <h3>Current Streak</h3>
          <div className="stat-value">7 days</div>
          <div className="stat-change">
            Keep it up!
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiTarget />
          </div>
          <h3>Success Rate</h3>
          <div className="stat-value">78%</div>
          <div className="stat-change">
            +5% from last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiBarChart />
          </div>
          <h3>Avg. Time</h3>
          <div className="stat-value">25 min</div>
          <div className="stat-change">
            Per problem
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
            <Line data={progressData} options={chartOptions} />
          </div>
        </div>

        <div className="goals-section">
          <div className="section-header">
            <h2>Goals & Targets</h2>
            <p>Track your progress towards your learning goals</p>
          </div>
          <div className="goals-grid">
            {goals.map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <h3>{goal.title}</h3>
                    <span className="goal-percentage">{Math.round(percentage)}%</span>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="goal-stats">
                      <span>{goal.current}</span>
                      <span>/ {goal.target} {goal.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
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