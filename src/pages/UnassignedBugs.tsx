import React, { useState, useEffect } from 'react';
import { bugService } from '../services/api';
import BugList from '../components/BugList';
import type { Bug } from '../types';

const UnassignedBugs: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadUnassignedBugs();
  }, []);

  const loadUnassignedBugs = async () => {
    setLoading(true);
    try {
      const data = await bugService.getUnassignedBugs();
      setBugs(data);
    } catch (error) {
      console.error('Failed to load unassigned bugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadUnassignedBugs();
      return;
    }

    setSearching(true);
    try {
      const data = await bugService.searchBugs(searchTerm);
      setBugs(data);
    } catch (error) {
      console.error('Failed to search bugs:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAssign = async (bugId: number) => {
    try {
      await bugService.assignBug(bugId);
      await loadUnassignedBugs();
      alert('Bug assigned successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to assign bug');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    loadUnassignedBugs();
  };

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <h1 className="page-title">Unassigned Bugs</h1>
          <p className="page-subtitle">Pick bugs to work on and assign them to yourself</p>
        </div>
        <form onSubmit={handleSearch} className="search-bar" style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search bugs by title, description, or steps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
          {searchTerm && (
            <button type="button" className="btn btn-secondary" onClick={handleClearSearch}>
              Clear
            </button>
          )}
        </form>
        <BugList bugs={bugs} loading={loading} showAssignButton onAssign={handleAssign} />
      </div>
    </div>
  );
};

export default UnassignedBugs;
