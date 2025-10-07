import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiExternalLink, FiEdit, FiTrash2 } from 'react-icons/fi';
import api from '../services/api';
import './Problems.css';

const Problems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await api.getSolvedProblems({
        limit: 100,
        page: 1
      });
      
      const problemsData = response.items.map(item => ({
        id: item._id,
        title: item.problem.title,
        platform: item.problem.platform,
        difficulty: item.problem.difficulty,
        status: "solved",
        tags: item.problem.tags,
        url: item.problem.url,
        date: new Date(item.solvedAt).toISOString().split('T')[0],
        notes: "Solved problem"
      }));
      
      setProblems(problemsData);
    } catch (err) {
      console.error('Failed to fetch problems:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty.toLowerCase() === selectedDifficulty;
    const matchesPlatform = selectedPlatform === 'all' || problem.platform.toLowerCase() === selectedPlatform;
    const matchesStatus = selectedStatus === 'all' || problem.status === selectedStatus;

    return matchesSearch && matchesDifficulty && matchesPlatform && matchesStatus;
  });

  const handleDeleteProblem = async (id) => {
    // Optimistic UI update
    const prev = problems;
    setProblems(prev.filter(problem => problem.id !== id));
    try {
      await api.deleteSolvedProblem(id);
    } catch (err) {
      console.error('Failed to delete solved problem:', err);
      // Revert if backend delete failed
      setProblems(prev);
      alert(err.message || 'Failed to delete problem');
    }
  };

  if (loading) {
    return (
      <div className="problems-page">
        <div className="page-header">
          <h1 className="page-title">Problems</h1>
          <p className="page-subtitle">Manage and track your coding problems</p>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="problems-page">
        <div className="page-header">
          <h1 className="page-title">Problems</h1>
          <p className="page-subtitle">Manage and track your coding problems</p>
        </div>
        <div className="error-state">
          <p>Error loading problems: {error}</p>
          <button onClick={fetchProblems} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="problems-page">
      <div className="page-header">
        <h1 className="page-title">Problems</h1>
        <p className="page-subtitle">Manage and track your coding problems</p>
      </div>

      <div className="filters-section">
        <div className="search-filter">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search problems by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Platforms</option>
              <option value="leetcode">LeetCode</option>
              <option value="codeforces">Codeforces</option>
              <option value="geeksforgeeks">GeeksforGeeks</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="attempted">Attempted</option>
              <option value="bookmarked">Bookmarked</option>
            </select>
          </div>
        </div>
      </div>

      <div className="problems-stats">
        <div className="stat-item">
          <span className="stat-label">Total Problems</span>
          <span className="stat-value">{problems.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Solved</span>
          <span className="stat-value">{problems.filter(p => p.status === 'solved').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Attempted</span>
          <span className="stat-value">{problems.filter(p => p.status === 'attempted').length}</span>
        </div>
      </div>

      <div className="problems-list">
        {filteredProblems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No problems found</h3>
            <p>Try adjusting your filters or add a new problem</p>
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <div key={problem.id} className="problem-item">
              <div className="problem-main">
                <div className="problem-info">
                  <h3 className="problem-title">{problem.title}</h3>
                  <div className="problem-meta">
                    <span className="problem-platform">{problem.platform}</span>
                    <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                    <span className={`problem-status ${problem.status}`}>
                      {problem.status === 'solved' ? '✓ Solved' : '○ Attempted'}
                    </span>
                  </div>
                  <div className="problem-tags">
                    {problem.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  {problem.notes && (
                    <div className="problem-notes">
                      <strong>Notes:</strong> {problem.notes}
                    </div>
                  )}
                </div>
                <div className="problem-actions">
                  <button className="action-btn" title="Edit">
                    <FiEdit />
                  </button>
                  <button className="action-btn" title="Delete" onClick={() => handleDeleteProblem(problem.id)}>
                    <FiTrash2 />
                  </button>
                  <button className="action-btn" title="View on Platform" onClick={() => {
                    const link = (problem.url || '').trim();
                    if (link) {
                      const safeUrl = link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;
                      window.open(safeUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      alert('No URL available for this problem.');
                    }
                  }}>
                    <FiExternalLink />
                  </button>
                </div>
              </div>
              <div className="problem-footer">
                <span className="problem-date">Added: {problem.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Problems; 