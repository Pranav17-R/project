import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTarget, FiClock, FiCheckCircle } from 'react-icons/fi';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import api from '../services/api';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    thisWeek: 0,
    streak: 0
  });

  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [progressSummary, solvedProblems, timelineData] = await Promise.all([
          api.getProgressSummary(),
          api.getSolvedProblems({ limit: 4 }),
          api.getProgressTimeline(7)
        ]);

        // Update stats from progress summary
        setStats({
          totalProblems: progressSummary.total,
          solvedProblems: progressSummary.total,
          thisWeek: timelineData.items.reduce((sum, item) => sum + item.count, 0),
          streak: 0 // Calculate streak from timeline data
        });

        // Update recent problems
        setRecentProblems(solvedProblems.items.map(item => ({
          id: item._id,
          title: item.problem.title,
          platform: item.problem.platform,
          difficulty: item.problem.difficulty,
          status: "solved",
          date: new Date(item.solvedAt).toISOString().split('T')[0]
        })));

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const progressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Problems Solved',
        data: [3, 5, 2, 8, 4, 6, 3],
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
        data: [45, 32, 12],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
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

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track your competitive programming progress</p>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track your competitive programming progress</p>
        </div>
        <div className="error-state">
          <p>Error loading dashboard: {error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Track your competitive programming progress</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiTarget />
          </div>
          <h3>Total Problems</h3>
          <div className="stat-value">{stats.totalProblems}</div>
          <div className="stat-change">
            <FiTrendingUp />
            +12 this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <h3>Solved Problems</h3>
          <div className="stat-value">{stats.solvedProblems}</div>
          <div className="stat-change">
            <FiTrendingUp />
            +8 this week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiClock />
          </div>
          <h3>This Week</h3>
          <div className="stat-value">{stats.thisWeek}</div>
          <div className="stat-change">
            <FiTrendingUp />
            +3 from yesterday
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiTrendingUp />
          </div>
          <h3>Current Streak</h3>
          <div className="stat-value">{stats.streak} days</div>
          <div className="stat-change">
            <FiTrendingUp />
            Keep it up!
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="main-content-section">
          <div className="section-header">
            <h2>Weekly Progress</h2>
            <p>Your problem-solving activity over the past week</p>
          </div>
          <div className="chart-container">
            <Line data={progressData} options={chartOptions} />
          </div>
        </div>

        <div className="sidebar-content-section">
          <div className="section-header">
            <h2>Difficulty Distribution</h2>
            <p>Breakdown of solved problems by difficulty</p>
          </div>
          <div className="chart-container">
            <Doughnut data={difficultyData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="recent-problems-section">
        <div className="section-header">
          <h2>Recent Problems</h2>
          <p>Your latest problem-solving activities</p>
        </div>
        <div className="problems-grid">
          {recentProblems.map((problem) => (
            <div key={problem.id} className="problem-card">
              <div className="problem-header">
                <h3 className="problem-title">{problem.title}</h3>
                <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
              </div>
              <div className="problem-meta">
                <span className="problem-platform">{problem.platform}</span>
                <span className={`problem-status ${problem.status}`}>
                  {problem.status === 'solved' ? '✓ Solved' : '○ Attempted'}
                </span>
              </div>
              <div className="problem-date">{problem.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 