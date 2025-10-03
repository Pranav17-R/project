import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiPlus } from 'react-icons/fi';
import api from '../services/api';
import './AddProblem.css';

const AddProblem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    difficulty: 'Easy',
    status: 'attempted',
    tags: [],
    notes: '',
    url: '',
    description: ''
  });

  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const platforms = ['LeetCode', 'Codeforces', 'GeeksforGeeks', 'HackerRank', 'AtCoder'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const statuses = ['attempted', 'solved', 'bookmarked'];

  const commonTags = [
    'Array', 'String', 'Hash Table', 'Dynamic Programming', 'Tree', 'Graph',
    'Stack', 'Queue', 'Linked List', 'Binary Search', 'Two Pointers',
    'Sliding Window', 'Backtracking', 'Greedy', 'Sort', 'Math'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCommonTagClick = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title.trim()) {
      setError('Problem title is required');
      return;
    }

    try {
      setLoading(true);
      
      // Generate a unique problemId based on title and platform
      const problemId = `${formData.platform.toLowerCase()}-${formData.title.toLowerCase().replace(/\s+/g, '-')}`;
      
      await api.addSolvedProblem({
        problemId,
        title: formData.title,
        tags: formData.tags,
        difficulty: formData.difficulty,
        platform: formData.platform,
        dateSolved: new Date().toISOString()
      });

      navigate('/problems');
    } catch (err) {
      console.error('Failed to add problem:', err);
      setError(err.message || 'Failed to add problem');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/problems');
  };

  return (
    <div className="add-problem-page">
      <div className="page-header">
        <h1 className="page-title">Add New Problem</h1>
        <p className="page-subtitle">Save a new coding problem to your collection</p>
      </div>

      <div className="form-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="problem-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Problem Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Two Sum"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Platform</label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Problem URL (Optional)</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://leetcode.com/problems/two-sum/"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Tags & Categories</h3>
            
            <div className="form-group">
              <label className="form-label">Add Tags</label>
              <div className="tag-input-container">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="form-input"
                  placeholder="Add a custom tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn btn-primary"
                  disabled={!newTag.trim()}
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Common Tags</label>
              <div className="common-tags">
                {commonTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleCommonTagClick(tag)}
                    className={`common-tag ${formData.tags.includes(tag) ? 'selected' : ''}`}
                    disabled={formData.tags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {formData.tags.length > 0 && (
              <div className="form-group">
                <label className="form-label">Selected Tags</label>
                <div className="selected-tags">
                  {formData.tags.map(tag => (
                    <span key={tag} className="selected-tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="remove-tag"
                      >
                        <FiX />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-group">
              <label className="form-label">Problem Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-input"
                rows="4"
                placeholder="Brief description of the problem..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-input"
                rows="3"
                placeholder="Your thoughts, solution approach, or key insights..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              <FiX />
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave />
              {loading ? 'Saving...' : 'Save Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProblem; 