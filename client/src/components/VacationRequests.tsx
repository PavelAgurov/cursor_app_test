import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface VacationRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const VacationRequests: React.FC = () => {
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchVacationRequests = async (): Promise<void> => {
      try {
        const response = await axios.get('/api/vacation-requests');
        setRequests(response.data.requests);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching vacation requests:', err);
        setError('Failed to load vacation requests. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchVacationRequests();
  }, []);

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

  if (isLoading) {
    return <div className="loading-spinner">Loading vacation requests...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="vacation-requests">
      {requests.length === 0 ? (
        <div className="no-requests">No vacation requests found.</div>
      ) : (
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
            {requests.map((request) => (
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
      )}
    </div>
  );
};

export default VacationRequests; 