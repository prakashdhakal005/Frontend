import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Bug } from '../types';
import { BugSeverity, BugStatus } from '../types';

interface BugListProps {
  bugs: Bug[];
  loading: boolean;
  showAssignButton?: boolean;
  onAssign?: (bugId: number) => void;
  onStatusUpdate?: (bugId: number) => void;
}

const BugList: React.FC<BugListProps> = ({ bugs, loading, showAssignButton, onAssign, onStatusUpdate }) => {
  const navigate = useNavigate();

  const getSeverityBadge = (severity: BugSeverity) => {
    const badges = {
      [BugSeverity.Low]: 'badge-low',
      [BugSeverity.Medium]: 'badge-medium',
      [BugSeverity.High]: 'badge-high',
    };
    const labels = {
      [BugSeverity.Low]: 'Low',
      [BugSeverity.Medium]: 'Medium',
      [BugSeverity.High]: 'High',
    };
    return <span className={`badge ${badges[severity]}`}>{labels[severity]}</span>;
  };

  const getStatusBadge = (status: BugStatus) => {
    const badges = {
      [BugStatus.Open]: 'badge-open',
      [BugStatus.InProgress]: 'badge-inprogress',
      [BugStatus.Resolved]: 'badge-resolved',
      [BugStatus.Closed]: 'badge-closed',
    };
    const labels = {
      [BugStatus.Open]: 'Open',
      [BugStatus.InProgress]: 'In Progress',
      [BugStatus.Resolved]: 'Resolved',
      [BugStatus.Closed]: 'Closed',
    };
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading bugs...</div>;
  }

  if (bugs.length === 0) {
    return <div className="alert alert-info">No bugs found.</div>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Severity</th>
          <th>Status</th>
          <th>Reported By</th>
          <th>Assigned To</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {bugs.map((bug) => (
          <tr key={bug.id}>
            <td>{bug.id}</td>
            <td>
              <span
                style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                onClick={() => navigate(`/bugs/${bug.id}`)}
              >
                {bug.title}
              </span>
            </td>
            <td>{getSeverityBadge(bug.severity)}</td>
            <td>{getStatusBadge(bug.status)}</td>
            <td>{bug.reportedBy}</td>
            <td>{bug.assignedTo || 'Unassigned'}</td>
            <td>{formatDate(bug.createdAt)}</td>
            <td>
              <div style={{ display: 'flex', gap: '5px' }}>
                {showAssignButton && !bug.assignedTo && onAssign && (
                  <button
                    className="btn btn-primary"
                    onClick={() => onAssign(bug.id)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Assign to Me
                  </button>
                )}
                {bug.assignedTo && onStatusUpdate && (
                  <button
                    className="btn btn-success"
                    onClick={() => onStatusUpdate(bug.id)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Update Status
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BugList;
