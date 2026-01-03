import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bugService } from '../services/api';
import { BugSeverity } from '../types';

const CreateBug: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reproductionSteps: '',
    severity: BugSeverity.Medium,
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const bug = await bugService.createBug({
        ...formData,
        severity: Number(formData.severity) as BugSeverity,
      });

      if (file) {
        await bugService.uploadAttachment(bug.id, file);
      }

      setSuccess('Bug reported successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create bug. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '900px', margin: '20px auto' }}>
        <div className="page-header">
          <h1 className="page-title">Report a Bug</h1>
          <p className="page-subtitle">Help us improve by reporting bugs you encounter</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Bug Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief summary of the issue"
              required
              maxLength={200}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Max 200 characters
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the bug and its impact"
              required
              style={{ minHeight: '120px' }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reproductionSteps">Steps to Reproduce *</label>
            <textarea
              id="reproductionSteps"
              name="reproductionSteps"
              className="form-control"
              value={formData.reproductionSteps}
              onChange={handleChange}
              placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
              required
              style={{ minHeight: '120px' }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="severity">Severity *</label>
            <select
              id="severity"
              name="severity"
              className="form-control"
              value={formData.severity}
              onChange={handleChange}
            >
              <option value={BugSeverity.Low}>Low</option>
              <option value={BugSeverity.Medium}>Medium</option>
              <option value={BugSeverity.High}>High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="file">Attachment (Optional)</label>
            <input
              type="file"
              id="file"
              className="form-control"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.log,.zip"
              style={{
                padding: '12px',
                border: '2px dashed #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            />
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '8px' }}>
              📎 Accepted formats: Images (JPG, PNG, GIF), PDF, Text files, Logs, ZIP (max 10MB)
            </small>
            {file && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#333'
              }}>
                Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Submitting...' : '✓ Submit Bug Report'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBug;
