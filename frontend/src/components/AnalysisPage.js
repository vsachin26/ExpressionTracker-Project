// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';

// const AnalysisPage = () => {
//   const [results, setResults] = useState('Loading...');
//   const [error, setError] = useState(null);
//   const location = useLocation(); // Use location to get the query parameters

//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search); // Get query params from URL
//     const user = urlParams.get('user'); // Get the 'user' parameter

//     if (!user) {
//       setResults("No user specified.");
//     } else {
//       fetch(`/process-photos/${user}`)
//         .then(response => response.json())
//         .then(data => {
//           if (data.success) {
//             setResults(JSON.stringify(data.results, null, 2));
//           } else {
//             setResults(data.message || 'Error fetching analysis results.');
//           }
//         })
//         .catch(error => {
//           setError(error.message);
//           setResults('Error: ' + error.message);
//         });
//     }
//   }, [location]); // Re-run the effect when the location changes

//   return (
//     <div>
//       <h1>Analysis Results</h1>
//       <pre>{results}</pre>
//       {error && <div style={{ color: 'red' }}>Error: {error}</div>}
//     </div>
//   );
// };

// export default AnalysisPage;


// 





// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';

// const AnalysisPage = () => {
//   const [analysisResults, setAnalysisResults] = useState([]);
//   const [error, setError] = useState('');
//   const location = useLocation();
//   // const queryParams = new URLSearchParams(location.search);
//   const { username } = location.state || {};
//   // const username = queryParams.get('user'); // Get the username from query params

//   useEffect(() => {
//     // Check if username exists in query params
//     if (username) {
//       fetch(`http://localhost:5000/fetch-analyze/${username}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Failed to fetch analysis data.');
//           }
//           return response.json();
//         })
//         .then((data) => {
//           if (data.success && Array.isArray(data.results)) {
//             setAnalysisResults(data.results);
//           } else {
//             setError(data.message || 'No valid analysis data found.');
//           }
//         })
//         .catch((err) => {
//           setError(err.message);
//         });
//     } else {
//       setError('Username is missing in the query parameters.');
//     }
//   }, [username]);

//   if (error) {
//     return (
//       <div className="analysis-page">
//         <p className="error-message" style={{ color: 'red' }}>
//           {error}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="analysis-page">
//       <h1>Analysis Results for {username}</h1>
//       <div id="analysis-container">
//         {analysisResults.length > 0 ? (
//           analysisResults.map((result, index) => (
//             <div key={index}>
//               <img
//                 src={`http://localhost:5000/${result.imagePath}`}
//                 alt="User Image"
//                 style={{ width: '200px', margin: '10px' }}
//               />
//               <p>Analysis: {JSON.stringify(result.analysis)}</p>
//             </div>
//           ))
//         ) : (
//           <p>No analysis results available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AnalysisPage;




// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';

// const AnalysisPage = () => {
//   const [analysisResults, setAnalysisResults] = useState([]);
//   const [error, setError] = useState('');
//   const location = useLocation();
//   const { username } = location.state || {};

//   useEffect(() => {
//     // Fetch analysis data when the component mounts
//     if (username) {
//       fetch(`http://localhost:5000/fetch-analyze/${username}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Failed to fetch analysis data.');
//           }
//           return response.json();
//         })
//         .then((data) => {
//           if (data.success && Array.isArray(data.analysis)) {
//             setAnalysisResults(data.analysis);
//           } else {
//             setError(data.message || 'No valid analysis data found.');
//           }
//         })
//         .catch((err) => {
//           setError(err.message);
//         });
//     } else {
//       setError('Username is missing in the query parameters.');
//     }
//   }, [username]);

//   if (error) {
//     return (
//       <div className="analysis-page">
//         <p className="error-message" style={{ color: 'red' }}>
//           {error}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="analysis-page">
//       <h1>Analysis Results for {username}</h1>
//       <div id="analysis-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
//         {analysisResults.length > 0 ? (
//           analysisResults.map((result, index) => (
//             <div key={index} style={{ margin: '20px', textAlign: 'center' }}>
//               <img
//                 src={`http://localhost:5000/${result.path.replace(/\\/g, '/')}`}
//                 alt={`User Image ${index + 1}`}
//                 style={{
//                   width: '200px',
//                   height: '200px',
//                   objectFit: 'cover',
//                   marginBottom: '10px',
//                 }}
//               />
//               <div style={{ textAlign: 'left' }}>
//                 <h4>Emotion Scores:</h4>
//                 <ul>
//                   {result.analysis.map((emotion, idx) => (
//                     <li key={idx}>
//                       {emotion.label}: {emotion.score.toFixed(2)}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No analysis results available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AnalysisPage;


import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './AnalysisPage.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalysisPage = () => {
  const [analysisResults, setAnalysisResults] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();
  const { username } = location.state || {};

  useEffect(() => {
    if (username) {
      fetch(`http://localhost:5000/fetch-analyze/${username}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch analysis data.');
          }
          return response.json();
        })
        .then((data) => {
          if (data.success && Array.isArray(data.analysis)) {
            setAnalysisResults(data.analysis);
          } else {
            setError(data.message || 'No valid analysis data found.');
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      setError('Username is missing in the query parameters.');
    }
  }, [username]);

  if (error) {
    return (
      <div className="analysis-page">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <h1>Analysis Results for {username}</h1>
      <div id="analysis-container">
        {analysisResults.length > 0 ? (
          analysisResults.map((result, index) => {
            const labels = result.analysis.map((emotion) => emotion.label);
            const scores = result.analysis.map((emotion) => emotion.score);

            const data = {
              labels,
              datasets: [
                {
                  label: 'Emotion Scores',
                  data: scores,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            };

            const options = {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            };

            return (
              <div key={index} style={{ margin: '20px', textAlign: 'center' }}>
                <img
                  src={`http://localhost:5000/${result.path.replace(/\\/g, '/')}`}
                  alt={`User Image ${index + 1}`}
                />
                <div style={{ width: '600px', margin: '0 auto' }}>
                  <Bar data={data} options={options} />
                </div>
              </div>
            );
          })
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
