import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bugService } from '../services/api';
import BugList from '../components/BugList';
import type { Bug } from '../types';

const AssignedBugs: React.FC = () => {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignedBugs();
  }, []);

  const loadAssignedBugs = async () => {
    try {
      const data = await bugService.getMyAssignedBugs();
      setBugs(data);
    } catch (error) {
      console.error('Failed to load assigned bugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (bugId: number) => {
    navigate(`/bugs/${bugId}`);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <h1 className="page-title">My Assigned Bugs</h1>
          <p className="page-subtitle">Bugs assigned to you for resolution</p>
        </div>
        <BugList bugs={bugs} loading={loading} onStatusUpdate={handleStatusUpdate} />
      </div>
    </div>
  );
};

export default AssignedBugs;
