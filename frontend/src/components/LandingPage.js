// // src/components/LandingPage.js
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './LandingPage.css';

// function LandingPage(onPlayNow) {
//   const navigate = useNavigate();

//   const handlePlayNow = () => {
//     navigate('/quiz'); // Navigate to the QuizGame route
//   };

//   return (
//     <div className="container">
//       <div className="content-wrapper">
//         <div className="text-content">
//           <h1>Fun Learning for Dyslexic Kids</h1>
//           <p>"Engaging educational games for children, with insights to personalize learning through play."</p>
//         </div>
//         <div className="game-card">
//           <div className="image">
//             <img src="https://games.lol/wp-content/uploads/2022/11/word-collect-pc-full-version.jpg" alt="Word Adventure Game" />
//           </div>
//           <h2 className="game-title">Word Adventure</h2>
//           <p>Explore a magical world of words and letters!</p>
//           <button id="playButton" onClick={onPlayNow}><span>Play Now</span></button>
//         </div>
//       </div>
//     </div>
  
//   );
// }

// export default LandingPage;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './LandingPage.css';

// function LandingPage({ onPlayNow }) {  // Destructure the prop
//   const navigate = useNavigate();

//   const handlePlayNow = () => {
//     navigate('/quiz'); // Navigate to the QuizGame route
//     if (typeof onPlayNow === 'function') {  // Ensure it's a function
//       onPlayNow();  // Call the onPlayNow function if passed
//     }
//   };

//   return (
//     <div className="container">
//       <div className="content-wrapper">
//         <div className="text-content">
//           <h1>Fun Learning for Dyslexic Kids</h1>
//           <p>"Engaging educational games for children, with insights to personalize learning through play."</p>
//         </div>
//         <div className="game-card">
//           <div className="image">
//             <img src="https://games.lol/wp-content/uploads/2022/11/word-collect-pc-full-version.jpg" alt="Word Adventure Game" />
//           </div>
//           <h2 className="game-title">Word Adventure</h2>
//           <p>Explore a magical world of words and letters!</p>
//           {/* Ensure the onClick handler passes a function */}
//           <button id="playButton" onClick={handlePlayNow}><span>Play Now</span></button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LandingPage;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage({ onPlayNow }) {
  const navigate = useNavigate();

  const handlePlayNow = () => {
    // Ensure onPlayNow is a function, and call it
    if (typeof onPlayNow === 'function') {
      onPlayNow();
    }
    // Navigate to the Enter Name page
    navigate('/enter-name');
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="text-content">
          <h1>Fun Learning for Dyslexic Kids</h1>
          <p>"Engaging educational games for children, with insights to personalize learning through play."</p>
        </div>
        <div className="game-card">
          <div className="image">
            <img src="https://games.lol/wp-content/uploads/2022/11/word-collect-pc-full-version.jpg" alt="Word Adventure Game" />
          </div>
          <h2 className="game-title">Word Adventure</h2>
          <p>Explore a magical world of words and letters!</p>
          <button id="playButton" onClick={handlePlayNow}><span>Play Now</span></button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
