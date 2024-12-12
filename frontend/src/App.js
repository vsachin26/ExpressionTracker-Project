// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import LandingPage from './components/LandingPage';
// import QuizGame from './components/QuizGame';
// import LoginPage from './components/LoginPage';
// import About from './components/About';
// import AnalysisPage from './components/AnalysisPage';
// //import EnterNamePage from './components/EnterNamePage';
// import './App.css';

// // Component to conditionally show Navbar based on route
// function ConditionalNavbar() {
//   const location = useLocation();
  
//   // Show Navbar only on the LandingPage
//   const showNavbar = location.pathname === '/';
  
//   return showNavbar ? <Navbar /> : null;
// }

// function App() {
//   const [isPlaying, setIsPlaying] = useState(false);

//   const handlePlayNow = () => {
//     setIsPlaying(true); // Sets isPlaying to true to show the quiz
//   };

//   return (
//     <Router>
//       <div className="app">
//         {/* Conditionally render Navbar */}
//         <ConditionalNavbar />
        
//         <Routes>
//           <Route 
//             path="/" 
//             element={<LandingPage onPlayNow={handlePlayNow} />} // Pass the function as a prop
//           />
//           <Route path="/quiz" element={<QuizGame />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/about" element={<About />} />
//           <Route path='AnaysisPage' element={<AnalysisPage/>} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import LandingPage from './components/LandingPage';
// import QuizGame from './components/QuizGame';
// import EnterNamePage from './components/EnterNamePage';
// import LoginPage from './components/LoginPage';
// import About from './components/About';
// import AnalysisPage from './components/AnalysisPage';
// import './App.css';

// function ConditionalNavbar() {
//   const location = useLocation();
//   const showNavbar = location.pathname === '/';
//   return showNavbar ? <Navbar /> : null;
// }

// function App() {
//   const [playerName, setPlayerName] = useState(''); // Store the player's name
//   const [isPlaying, setIsPlaying] = useState(false);

//   const handlePlayNow = () => {
//     setIsPlaying(true); // Allow quiz start
//   };

//   return (
//     <Router>
//       <div className="app">
//         <ConditionalNavbar />
//         <Routes>
//           <Route 
//             path="/" 
//             element={<LandingPage onPlayNow={handlePlayNow} />} 
//           />
//           <Route 
//             path="/enter-name" 
//             element={<EnterNamePage setPlayerName={setPlayerName} />} 
//           />
//           <Route 
//             path="/quiz" 
//             element={isPlaying ? <QuizGame playerName={playerName} /> : <div>Please start from the homepage.</div>} 
//           />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/analysis" element={<AnalysisPage />} />
//           <Route path="*" element={<div>404 - Page Not Found</div>} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import QuizGame from './components/QuizGame';
import EnterNamePage from './components/EnterNamePage';
import LoginPage from './components/LoginPage';
import About from './components/About';
import UserDashboard from './components/Dashboard';
import AnalysisPage from './components/AnalysisPage';
import './App.css';

function ConditionalNavbar() {
  const location = useLocation();
  const showNavbar = location.pathname === '/';
  return showNavbar ? <Navbar /> : null;
}

function App() {
  const [playerName, setPlayerName] = useState(''); // Store the player's name
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayNow = () => {
    setIsPlaying(true); // Redirect to EnterNamePage
  };

  return (
    <Router>
      <div className="app">
        <ConditionalNavbar />
        <Routes>
          <Route 
            path="/" 
            element={<LandingPage onPlayNow={handlePlayNow} />} 
          />
          <Route 
            path="/enter-name" 
            element={<EnterNamePage setPlayerName={setPlayerName} />} 
          />
          <Route 
            path="/quiz" 
            element={playerName ? <QuizGame playerName={playerName} /> : <div>Please enter your name first.</div>} 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path='/dashboard' element={<UserDashboard />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
