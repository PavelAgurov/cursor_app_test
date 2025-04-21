import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface VacationRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const VacationRequests: React.FC = () => {
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<VacationRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    const fetchVacationRequests = async (): Promise<void> => {
      try {
        // Get username from session storage
        const username = sessionStorage.getItem('username');
        
        if (!username) {
          setError('User authentication lost. Please login again.');
          setIsLoading(false);
          return;
        }
        
        // Pass username as query parameter
        const response = await axios.get('/api/vacation-requests', {
          params: { username }
        });
        
        setRequests(response.data.requests);
        setFilteredRequests(response.data.requests);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching vacation requests:', err);
        const errorMessage = err.response?.data?.error || 
                            'Failed to load vacation requests. Please try again later.';
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    fetchVacationRequests();
  }, []);

  // Apply the status filter whenever statusFilter or requests change
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(request => request.status === statusFilter));
    }
  }, [statusFilter, requests]);

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const handleFilterChange = (newFilter: StatusFilter) => {
    setStatusFilter(newFilter);
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading vacation requests...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="vacation-requests">
      <div className="filter-controls">
        <div className="filter-buttons">
          <button 
            className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => handleFilterChange('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-button ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => handleFilterChange('approved')}
          >
            Approved
          </button>
          <button 
            className={`filter-button ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => handleFilterChange('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="no-requests">
          {requests.length === 0 
            ? "No vacation requests found." 
            : `No ${statusFilter !== 'all' ? statusFilter : ''} vacation requests found.`}
        </div>
      ) : (
        <div className="table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.employeeName}</td>
                  <td>{new Date(request.startDate).toLocaleDateString()}</td>
                  <td>{new Date(request.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VacationRequests; 