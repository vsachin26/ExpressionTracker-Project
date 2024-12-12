
import React, { useEffect, useRef } from 'react';
import './Confetti.css';

const Confetti = () => {
  const canvasRef = useRef(null);
  const blasterLeftImage = useRef(null);
  const blasterRightImage = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const confettiCount = 1000;
    const confetti = [];
    const gravity = 0.1; 

    const colors = ['#FFC107', '#FF5722', '#8BC34A', '#03A9F4', '#E91E63'];
    const shapes = ['rectangle', 'circle', 'triangle'];

   
    blasterLeftImage.current = new Image();
    blasterLeftImage.current.src = '/blaster-left.png'; 
    blasterRightImage.current = new Image();
    blasterRightImage.current.src = '/blaster-right.png';

   for (let i = 0; i < confettiCount; i++) {
      const fromLeftSide = i % 2 === 0; 
      confetti.push({
        x: fromLeftSide ? 30 : canvas.width - 30, 
        y: canvas.height - 10, 
        width: Math.random() * 8 + 4,
        height: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        initialSpeedY: Math.random() * -5 - 10, 
        speedX: (Math.random() - 0.5) * 6, 
        opacity: Math.random(),
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        isActive: true 
      });
    }

    function drawBlasters() {
      
      context.drawImage(blasterLeftImage.current, 0, canvas.height - 50, 50, 50);

      
      context.drawImage(blasterRightImage.current, canvas.width - 50, canvas.height - 50, 50, 50);
    }

    function renderConfetti() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBlasters(); 

      confetti.forEach((c) => {
        if (c.isActive) {
          
          c.y += c.initialSpeedY; 
          c.x += c.speedX; 
          c.initialSpeedY += gravity; 
          
          if (c.y > canvas.height) {
            c.y = canvas.height - 10;
            c.initialSpeedY = Math.random() * -5 - 10; 
          }

      
          context.globalAlpha = c.opacity;
          context.fillStyle = c.color;

          switch (c.shape) {
            case 'rectangle':
              context.fillRect(c.x, c.y, c.width, c.height);
              break;
            case 'circle':
              context.beginPath();
              context.arc(c.x, c.y, c.width / 2, 0, 2 * Math.PI);
              context.fill();
              break;
            case 'triangle':
              context.beginPath();
              context.moveTo(c.x, c.y);
              context.lineTo(c.x + c.width, c.y);
              context.lineTo(c.x + c.width / 2, c.y - c.height);
              context.closePath();
              context.fill();
              break;
          }
        }
      });

      requestAnimationFrame(renderConfetti);
    }

    renderConfetti();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas"></canvas>;
};

export default Confetti;
 




















