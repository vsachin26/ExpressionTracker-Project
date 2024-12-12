// import React, { useState, useEffect } from 'react';
// import quizData from '../quizData';
// import Confetti from './Confetti';
// import './Quiz.css';

// function QuizGame({ playerName }) {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showScore, setShowScore] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [backgroundColor, setBackgroundColor] = useState('default');

//   const handleNextQuestion = () => {
//     setBackgroundColor('default');
//     if (currentQuestion < quizData.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//       setTimeLeft(30);
//     } else {
//       setShowScore(true);
//       setShowConfetti(true);
//     }
//   };

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       handleNextQuestion();
//     }
//   }, [timeLeft]);

//   const handleAnswerOptionClick = (index) => {
//     if (index === quizData[currentQuestion].answer) {
//       setScore(score + 1);
//       setBackgroundColor('correct');
//     } else {
//       setBackgroundColor('incorrect');
//     }
//     setTimeout(handleNextQuestion, 2000);
//   };

//   const handleRestartQuiz = () => {
//     setCurrentQuestion(0);
//     setScore(0);
//     setShowScore(false);
//     setTimeLeft(30);
//     setShowConfetti(false);
//     setBackgroundColor('default');
//   };

//   return (
//     <div className={`one ${backgroundColor}`}>
//       <div className="quiz">
//         {showConfetti && <Confetti />}
//         {showScore ? (
//           <div className="score-section">
//             <h1>🎉 Congratulations {playerName}! 🎉</h1>
//             <h2>Your Score: {score} / {quizData.length}</h2>
//             <button onClick={handleRestartQuiz}>Restart Quiz</button>
//           </div>
//         ) : (
//           <>
//             <div className="progress-bar">
//               <div
//                 className="progress-bar-fill"
//                 style={{
//                   width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
//                 }}
//               ></div>
//             </div>
//             <div className="timer">Time Left: {timeLeft}s</div>
//             <div className="question-section">
//               <h2>{quizData[currentQuestion].question}</h2>
//               {quizData[currentQuestion].image && (
//                 <img
//                   src={quizData[currentQuestion].image}
//                   alt="quiz illustration"
//                 />
//               )}
//               <div className="options">
//                 {quizData[currentQuestion].options.map((option, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleAnswerOptionClick(index)}
//                     className="option-button"
//                   >
//                     {option}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default QuizGame;




// import React, { useState, useEffect, useRef } from 'react';
// import quizData from '../quizData';
// import Confetti from './Confetti';
// import './Quiz.css';

// function QuizGame({ playerName }) {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showScore, setShowScore] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [backgroundColor, setBackgroundColor] = useState('default');
//   const videoRef = useRef(null);
//   const captureInterval = useRef(null);

//   const handleNextQuestion = () => {
//     setBackgroundColor('default');
//     if (currentQuestion < quizData.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//       setTimeLeft(30);
//     } else {
//       setShowScore(true);
//       setShowConfetti(true);
//     }
//   };

//   // Timer for each question
//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       handleNextQuestion();
//     }
//   }, [timeLeft]);

//   // Handle answer selection
//   const handleAnswerOptionClick = (index) => {
//     if (index === quizData[currentQuestion].answer) {
//       setScore(score + 1);
//       setBackgroundColor('correct');
//     } else {
//       setBackgroundColor('incorrect');
//     }
//     setTimeout(handleNextQuestion, 2000);
//   };

//   // Handle quiz restart
//   const handleRestartQuiz = () => {
//     setCurrentQuestion(0);
//     setScore(0);
//     setShowScore(false);
//     setTimeLeft(30);
//     setShowConfetti(false);
//     setBackgroundColor('default');
//   };

//   // Capture images every 5 seconds
//   useEffect(() => {
//     const startWebcam = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();

//         // Set up image capturing interval
//         captureInterval.current = setInterval(() => {
//           captureImage();
//         }, 5000);
//       } catch (error) {
//         console.error('Error accessing webcam:', error);
//       }
//     };

//     const captureImage = () => {
//       if (videoRef.current && !showScore) {
//         const canvas = document.createElement('canvas');
//         canvas.width = videoRef.current.videoWidth;
//         canvas.height = videoRef.current.videoHeight;
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//         const imageData = canvas.toDataURL('image/jpeg');

//         // Send image to the backend
//         fetch('http://localhost:5000/upload-image', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             username: playerName,
//             image: imageData,
//           }),
//         })
//           .then((response) => response.json())
//           .then((data) => {
//             if (!data.success) {
//               console.error('Failed to save image:', data.message);
//             }
//           })
//           .catch((error) => console.error('Error uploading image:', error));
//       }
//     };

//     if (!showScore) {
//       startWebcam();
//     }

//     return () => {
//       // Clean up webcam and stop intervals
//       if (videoRef.current?.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//       }
//       clearInterval(captureInterval.current);
//     };
//   }, [showScore, playerName]);

//   return (
//     <div className={`one ${backgroundColor}`}>
//       <div className="quiz">
//         <video ref={videoRef} style={{ display: 'none' }} />
//         {showConfetti && <Confetti />}
//         {showScore ? (
//           <div className="score-section">
//             <h1>🎉 Congratulations {playerName}! 🎉</h1>
//             <h2>Your Score: {score} / {quizData.length}</h2>
//             <button onClick={handleRestartQuiz}>Restart Quiz</button>
//           </div>
//         ) : (
//           <>
//             <div className="progress-bar">
//               <div
//                 className="progress-bar-fill"
//                 style={{
//                   width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
//                 }}
//               ></div>
//             </div>
//             <div className="timer">Time Left: {timeLeft}s</div>
//             <div className="question-section">
//               <h2>{quizData[currentQuestion].question}</h2>
//               {quizData[currentQuestion].image && (
//                 <img
//                   src={quizData[currentQuestion].image}
//                   alt="quiz illustration"
//                 />
//               )}
//               <div className="options">
//                 {quizData[currentQuestion].options.map((option, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleAnswerOptionClick(index)}
//                     className="option-button"
//                   >
//                     {option}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default QuizGame;

import React, { useState, useEffect, useRef } from 'react';
import quizData from '../quizData';
import Confetti from './Confetti';
import './Quiz.css';

function QuizGame({ playerName }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showConfetti, setShowConfetti] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('default');
  const videoRef = useRef(null);
  const captureInterval = useRef(null);

  const handleNextQuestion = () => {
    setBackgroundColor('default');
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      setShowScore(true);
      setShowConfetti(true);
    }
  };

  // Timer for each question
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextQuestion();
    }
  }, [timeLeft]);

  // Handle answer selection
  const handleAnswerOptionClick = (index) => {
    if (index === quizData[currentQuestion].answer) {
      setScore(score + 1);
      setBackgroundColor('correct');
    } else {
      setBackgroundColor('incorrect');
    }
    setTimeout(handleNextQuestion, 2000);
  };

  // Handle quiz restart
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setTimeLeft(30);
    setShowConfetti(false);
    setBackgroundColor('default');
  };

  // Capture images every 5 seconds
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((error) => {
            console.error('Error playing video stream:', error);
          });
        };

        // Set up image capturing interval
        captureInterval.current = setInterval(() => {
          captureImage();
        }, 5000);
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    const captureImage = () => {
      if (videoRef.current && !showScore) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');

        // Send image to the backend
        fetch('http://localhost:5000/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: playerName,
            image: imageData,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.success) {
              console.error('Failed to save image:', data.message);
            }
          })
          .catch((error) => console.error('Error uploading image:', error));
      }
    };

    if (!showScore) {
      startWebcam();
    }

    return () => {
      // Clean up webcam and stop intervals
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      clearInterval(captureInterval.current);
    };
  }, [showScore, playerName]);

  return (
    <div className={`one ${backgroundColor}`}>
      <div className="quiz">
        <video ref={videoRef} style={{ display: 'none' }} />
        {showConfetti && <Confetti />}
        {showScore ? (
          <div className="score-section">
            <h1>🎉 Congratulations {playerName}! 🎉</h1>
            <h2>Your Score: {score} / {quizData.length}</h2>
            <button onClick={handleRestartQuiz}>Restart Quiz</button>
          </div>
        ) : (
          <>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
                }}
              ></div>
            </div>
            <div className="timer">Time Left: {timeLeft}s</div>
            <div className="question-section">
              <h2>{quizData[currentQuestion].question}</h2>
              {quizData[currentQuestion].image && (
                <img
                  src={quizData[currentQuestion].image}
                  alt="quiz illustration"
                />
              )}
              <div className="options">
                {quizData[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(index)}
                    className="option-button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default QuizGame;
