

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of users from the backend
    fetch('http://localhost:5000/list-users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user list.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message || 'Error loading users.');
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const fetchAndAnalyzeImages = async (username) => {
    setLoading(true); // Set loading state
    setError(''); // Reset error state

    try {
      const response = await fetch(`http://localhost:5000/fetch-analyze/${username}`, {
        method: 'GET',
      });

      const data = await response.json();
      if (data.success) {
        alert(`Images analyzed successfully for ${username}!`);
        console.log('Analysis Results:', data.analysisResults);
        navigate(`/analysis`, { state: { username } }); // Navigate to the analysis page
      } else {
        setError(data.message || `Failed to analyze images for ${username}.`);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="dashboard">
      <h1>User Analysis Dashboard</h1>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index}>
                <td>{user}</td>
                <td>
                  <button
                    onClick={() => fetchAndAnalyzeImages(user)}
                    disabled={loading} // Disable button while loading
                  >
                    Fetch
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;