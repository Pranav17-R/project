import React, { useState } from 'react';
import { FiSearch, FiFilter, FiExternalLink, FiEdit, FiTrash2 } from 'react-icons/fi';
import './Problems.css';

const Problems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [problems, setProblems] = useState([
    {
      id: 1,
      title: "Two Sum",
      platform: "LeetCode",
      difficulty: "Easy",
      status: "solved",
      tags: ["Array", "Hash Table"],
      date: "2024-01-15",
      notes: "Used HashMap for O(n) solution"
    },
    {
      id: 2,
      title: "Valid Parentheses",
      platform: "LeetCode",
      difficulty: "Easy",
      status: "solved",
      tags: ["Stack", "String"],
      date: "2024-01-14",
      notes: "Stack-based solution"
    },
    {
      id: 3,
      title: "Maximum Subarray",
      platform: "LeetCode",
      difficulty: "Medium",
      status: "attempted",
      tags: ["Array", "Dynamic Programming"],
      date: "2024-01-13",
      notes: "Kadane's algorithm"
    },
    {
      id: 4,
      title: "Binary Tree Inorder Traversal",
      platform: "LeetCode",
      difficulty: "Medium",
      status: "solved",
      tags: ["Tree", "Stack"],
      date: "2024-01-12",
      notes: "Iterative solution with stack"
    },
    {
      id: 5,
      title: "Merge Two Sorted Lists",
      platform: "LeetCode",
      difficulty: "Easy",
      status: "solved",
      tags: ["Linked List"],
      date: "2024-01-11",
      notes: "Simple merge algorithm"
    },
    {
      id: 6,
      title: "Climbing Stairs",
      platform: "LeetCode",
      difficulty: "Easy",
      status: "solved",
      tags: ["Dynamic Programming"],
      date: "2024-01-10",
      notes: "Fibonacci sequence pattern"
    }
  ]);

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty.toLowerCase() === selectedDifficulty;
    const matchesPlatform = selectedPlatform === 'all' || problem.platform.toLowerCase() === selectedPlatform;
    const matchesStatus = selectedStatus === 'all' || problem.status === selectedStatus;

    return matchesSearch && matchesDifficulty && matchesPlatform && matchesStatus;
  });

  const handleDeleteProblem = (id) => {
    setProblems(problems.filter(problem => problem.id !== id));
  };

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
                  <button className="action-btn" title="View on Platform">
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