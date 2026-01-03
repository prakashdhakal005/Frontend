import React, { useState, useEffect } from 'react';
import { bugService } from '../services/api';
import BugList from '../components/BugList';
import type { Bug } from '../types';

const MyBugs: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyBugs();
  }, []);

  const loadMyBugs = async () => {
    try {
      const data = await bugService.getMyReportedBugs();
      setBugs(data);
    } catch (error) {
      console.error('Failed to load my bugs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <h1 className="page-title">My Reported Bugs</h1>
          <p className="page-subtitle">Track the bugs you have reported</p>
        </div>
        <BugList bugs={bugs} loading={loading} />
      </div>
    </div>
  );
};

export default MyBugs;
