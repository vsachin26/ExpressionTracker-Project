// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './EnterNamePage.css'; // For styling

// const EnterNamePage = ({ setPlayerName }) => {
//   const [name, setName] = useState('');
//   const navigate = useNavigate();

//   const handleInputChange = (event) => {
//     setName(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (name) {
//       setPlayerName(name); // Set player name in parent state
//       navigate('/quiz'); // Navigate to the quiz page
//     } else {
//       alert("Please enter your name.");
//     }
//   };

//   return (
//     <div className="container">
//       <div className="form-container">
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="name">Enter your name:</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={handleInputChange}
//             placeholder="Your name"
//             required
//           />
//           <button type="submit">Start Quiz</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EnterNamePage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterNamePage.css';

const EnterNamePage = ({ setPlayerName }) => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (name) {
            try {
                const response = await fetch('http://localhost:5000/add-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                });

                const result = await response.json();

                if (result.success) {
                    setPlayerName(name);
                    localStorage.setItem('playerName', name); // Save name for persistence
                    navigate('/quiz');
                } else {
                    alert(result.message || 'Error saving name. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to save your name. Please try again.');
            }
        } else {
            alert('Please enter your name.');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Enter your name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                />
                <button type="submit">Start Quiz</button>
            </form>
        </div>
    );
};

export default EnterNamePage;
