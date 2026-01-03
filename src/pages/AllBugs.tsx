import React, { useState, useEffect } from 'react';
import { bugService } from '../services/api';
import BugList from '../components/BugList';
import type { Bug } from '../types';

const AllBugs: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBugs();
  }, []);

  const loadBugs = async () => {
    try {
      const data = await bugService.getAllBugs();
      setBugs(data);
    } catch (error) {
      console.error('Failed to load bugs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <h1 className="page-title">All Bugs</h1>
          <p className="page-subtitle">View and manage all reported bugs in the system</p>
        </div>
        <BugList bugs={bugs} loading={loading} />
      </div>
    </div>
  );
};

export default AllBugs;
