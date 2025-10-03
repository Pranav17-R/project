import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiStar, FiClock, FiTarget } from 'react-icons/fi';
import api from '../services/api';
import './Recommendations.css';

const Recommendations = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await api.getRecommendations();
      
      const recommendationsData = response.items.map((item, index) => ({
        id: item._id,
        title: item.title,
        platform: item.platform,
        difficulty: item.difficulty,
        similarity: Math.random() * 0.3 + 0.7, // Mock similarity score
        reason: `Recommended based on your ${response.tagsUsed[0] || 'coding'} practice`,
        tags: item.tags,
        estimatedTime: `${Math.floor(Math.random() * 30) + 15}-${Math.floor(Math.random() * 30) + 30} min`,
        priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low'
      }));
      
      setRecommendations(recommendationsData);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Recommendations' },
    { id: 'similar', name: 'Similar Problems' },
    { id: 'next-level', name: 'Next Level' },
    { id: 'weak-areas', name: 'Weak Areas' }
  ];

  const difficulties = [
    { id: 'all', name: 'All Difficulties' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' }
  ];

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesCategory = selectedCategory === 'all' || rec.reason.includes(selectedCategory);
    const matchesDifficulty = selectedDifficulty === 'all' || rec.difficulty.toLowerCase() === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--danger-color)';
      case 'medium': return 'var(--warning-color)';
      case 'low': return 'var(--success-color)';
      default: return 'var(--text-muted)';
    }
  };

  const getSimilarityColor = (similarity) => {
    if (similarity >= 0.9) return 'var(--success-color)';
    if (similarity >= 0.8) return 'var(--warning-color)';
    return 'var(--text-muted)';
  };

  if (loading) {
    return (
      <div className="recommendations-page">
        <div className="page-header">
          <h1 className="page-title">AI Recommendations</h1>
          <p className="page-subtitle">Smart problem suggestions based on your learning pattern</p>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-page">
        <div className="page-header">
          <h1 className="page-title">AI Recommendations</h1>
          <p className="page-subtitle">Smart problem suggestions based on your learning pattern</p>
        </div>
        <div className="error-state">
          <p>Error loading recommendations: {error}</p>
          <button onClick={fetchRecommendations} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <div className="page-header">
        <h1 className="page-title">AI Recommendations</h1>
        <p className="page-subtitle">Smart problem suggestions based on your learning pattern</p>
      </div>

      <div className="recommendations-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FiTrendingUp />
          </div>
          <h3>Recommended Today</h3>
          <div className="stat-value">{recommendations.length}</div>
          <div className="stat-change">
            Based on your recent activity
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiTarget />
          </div>
          <h3>Success Rate</h3>
          <div className="stat-value">78%</div>
          <div className="stat-change">
            +5% from last week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiClock />
          </div>
          <h3>Avg. Time</h3>
          <div className="stat-value">25 min</div>
          <div className="stat-change">
            Per recommended problem
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-controls">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="recommendations-list">
        {filteredRecommendations.map((rec) => (
          <div key={rec.id} className="recommendation-card">
            <div className="recommendation-header">
              <div className="recommendation-title">
                <h3>{rec.title}</h3>
                <div className="recommendation-meta">
                  <span className="platform">{rec.platform}</span>
                  <span className={`badge badge-${rec.difficulty.toLowerCase()}`}>
                    {rec.difficulty}
                  </span>
                </div>
              </div>
              <div className="recommendation-score">
                <div className="similarity-score">
                  <span className="score-label">Similarity</span>
                  <span 
                    className="score-value"
                    style={{ color: getSimilarityColor(rec.similarity) }}
                  >
                    {Math.round(rec.similarity * 100)}%
                  </span>
                </div>
                <div className="priority-indicator">
                  <FiStar 
                    style={{ color: getPriorityColor(rec.priority) }}
                  />
                </div>
              </div>
            </div>

            <div className="recommendation-content">
              <div className="recommendation-reason">
                <strong>Why recommended:</strong> {rec.reason}
              </div>
              
              <div className="recommendation-tags">
                {rec.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>

              <div className="recommendation-details">
                <div className="detail-item">
                  <FiClock />
                  <span>Estimated time: {rec.estimatedTime}</span>
                </div>
                <div className="detail-item">
                  <FiTarget />
                  <span>Priority: {rec.priority}</span>
                </div>
              </div>
            </div>

            <div className="recommendation-actions">
              <button className="btn btn-primary">
                Add to Problems
              </button>
              <button className="btn btn-secondary">
                View on Platform
              </button>
              <button className="btn btn-secondary">
                Skip for Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="ai-insights">
        <div className="insights-header">
          <h2>AI Learning Insights</h2>
          <p>Based on your problem-solving patterns</p>
        </div>
        
        <div className="insights-grid">
          <div className="insight-card">
            <h3>Strong Areas</h3>
            <ul>
              <li>Array manipulation (85% success rate)</li>
              <li>String problems (78% success rate)</li>
              <li>Easy difficulty problems (92% success rate)</li>
            </ul>
          </div>
          
          <div className="insight-card">
            <h3>Areas for Improvement</h3>
            <ul>
              <li>Dynamic Programming (45% success rate)</li>
              <li>Tree traversal (52% success rate)</li>
              <li>Medium difficulty problems (65% success rate)</li>
            </ul>
          </div>
          
          <div className="insight-card">
            <h3>Recommended Focus</h3>
            <ul>
              <li>Practice more DP problems</li>
              <li>Work on tree-based algorithms</li>
              <li>Gradually increase difficulty</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations; 