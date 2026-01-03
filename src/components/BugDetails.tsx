import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bugService } from '../services/api';
import type { Bug } from '../types';
import { BugSeverity, BugStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

const BugDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bug, setBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState<BugStatus | ''>('');
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadBug();
  }, [id]);

  const loadBug = async () => {
    try {
      const data = await bugService.getBugById(Number(id));
      setBug(data);
      setNewStatus(data.status);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bug details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === bug?.status) return;

    setUpdating(true);
    try {
      await bugService.updateBugStatus(Number(id), { status: newStatus });
      await loadBug();
      alert('Status updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getSeverityLabel = (severity: BugSeverity) => {
    const labels = {
      [BugSeverity.Low]: 'Low',
      [BugSeverity.Medium]: 'Medium',
      [BugSeverity.High]: 'High',
    };
    return labels[severity];
  };

  const getStatusLabel = (status: BugStatus) => {
    const labels = {
      [BugStatus.Open]: 'Open',
      [BugStatus.InProgress]: 'In Progress',
      [BugStatus.Resolved]: 'Resolved',
      [BugStatus.Closed]: 'Closed',
    };
    return labels[status];
  };

  const isImageFile = (fileName: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.pdf')) return '📄';
    if (fileName.toLowerCase().endsWith('.zip')) return '📦';
    if (fileName.toLowerCase().endsWith('.txt') || fileName.toLowerCase().endsWith('.log')) return '📝';
    return '📎';
  };

  if (loading) {
    return <div className="loading">Loading bug details...</div>;
  }

  if (error || !bug) {
    return <div className="alert alert-error">{error || 'Bug not found'}</div>;
  }

  const canUpdateStatus = user?.role === 'Developer' && bug.assignedToEmail === user.email;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div className="page-header">
            <h1 className="page-title">Bug #{bug.id}</h1>
            <p className="page-subtitle">{bug.title}</p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: '12px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Severity</div>
              <span className={`badge badge-${getSeverityLabel(bug.severity).toLowerCase()}`}>
                {getSeverityLabel(bug.severity)}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Status</div>
              <span className={`badge badge-${getStatusLabel(bug.status).toLowerCase().replace(' ', '')}`}>
                {getStatusLabel(bug.status)}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Reported By</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                {bug.reportedBy}
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '400' }}>{bug.reportedByEmail}</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Assigned To</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                {bug.assignedTo || <span style={{ color: '#999' }}>Unassigned</span>}
                {bug.assignedToEmail && <div style={{ fontSize: '12px', color: '#666', fontWeight: '400' }}>{bug.assignedToEmail}</div>}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Created</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                {new Date(bug.createdAt).toLocaleDateString()}
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '400' }}>
                  {new Date(bug.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
            {bug.updatedAt && (
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Updated</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                  {new Date(bug.updatedAt).toLocaleDateString()}
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: '400' }}>
                    {new Date(bug.updatedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{
            padding: '20px',
            background: 'white',
            borderRadius: '12px',
            border: '2px solid #f0f0f0'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '8px',
              textTransform: 'uppercase',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              Description
            </div>
            <p style={{
              marginTop: '0',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              color: '#333'
            }}>
              {bug.description}
            </p>
          </div>

          <div style={{
            padding: '20px',
            background: 'white',
            borderRadius: '12px',
            border: '2px solid #f0f0f0'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '8px',
              textTransform: 'uppercase',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              Reproduction Steps
            </div>
            <p style={{
              marginTop: '0',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              color: '#333'
            }}>
              {bug.reproductionSteps}
            </p>
          </div>

          {bug.attachments && bug.attachments.length > 0 && (
            <div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                marginBottom: '12px',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                Attachments ({bug.attachments.length})
              </div>
              <div className="attachment-gallery">
                {bug.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="attachment-item"
                    onClick={() => {
                      if (isImageFile(attachment.fileName)) {
                        setSelectedImage(bugService.getAttachmentUrl(attachment.filePath));
                      }
                    }}
                  >
                    {isImageFile(attachment.fileName) ? (
                      <>
                        <img
                          src={bugService.getAttachmentUrl(attachment.filePath)}
                          alt={attachment.fileName}
                          className="attachment-image"
                        />
                        <div className="attachment-info">
                          <div className="attachment-name" title={attachment.fileName}>
                            {attachment.fileName}
                          </div>
                          <div className="attachment-size">
                            {(attachment.fileSize / 1024).toFixed(2)} KB
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="attachment-file">
                          <div className="attachment-file-icon">{getFileIcon(attachment.fileName)}</div>
                          <div style={{ fontSize: '14px', fontWeight: '500' }}>
                            {attachment.fileName}
                          </div>
                        </div>
                        <div className="attachment-info">
                          <div className="attachment-size">
                            {(attachment.fileSize / 1024).toFixed(2)} KB
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {canUpdateStatus && (
            <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
              <h4>Update Status</h4>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <select
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(Number(e.target.value) as BugStatus)}
                >
                  <option value={BugStatus.Open}>Open</option>
                  <option value={BugStatus.InProgress}>In Progress</option>
                  <option value={BugStatus.Resolved}>Resolved</option>
                  <option value={BugStatus.Closed}>Closed</option>
                </select>
                <button
                  className="btn btn-primary"
                  onClick={handleStatusUpdate}
                  disabled={updating || newStatus === bug.status}
                >
                  {updating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <img src={selectedImage} alt="Bug attachment" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BugDetails;
