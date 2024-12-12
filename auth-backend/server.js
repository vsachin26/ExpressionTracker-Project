const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use("/uploads", express.static(path.join(__dirname , "uploads")));

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || ' mongodb://127.0.0.1:27017/photoDB';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// // Schemas and Models
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    imagePaths: [{ type: String }],
});
const UserModel = mongoose.model('User', userSchema);


const imageSchema = new mongoose.Schema({
    path: String,
    analysis: Object,
    user: String,
});
const ImageModel = mongoose.model('Image', imageSchema);




// Hardcoded Admin Credentials
const ADMIN_CREDENTIALS = { username: 'admin1', password: 'admin@123' };

// Routes

// Admin Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        return res.json({ success: true });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});

// List Users
app.get('/list-users', (req, res) => {
    try {
        const uploadsDir = path.join(__dirname, 'uploads');
        const users = fs.readdirSync(uploadsDir).filter(file => fs.statSync(path.join(uploadsDir, file)).isDirectory());
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ success: false, message: 'Error listing users' });
    }
});

// Add User
app.post('/add-user', async (req, res) => {
    const { name } = req.body;
    console.log("Name received:", name);

    if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    try {
        await UserModel.create({ name:name });
        res.json({ success: true, message: 'User saved successfully.' });
    } catch (error) {
        console.error('Error saving user:', error);

        if (error.code === 11000) { // Handle duplicate key error
            res.status(400).json({ success: false, message: 'Name already exists.' });
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }
    }
});

// Upload Image
app.post('/upload-image', async (req, res) => {
    const { username, image } = req.body;

    if (!username || !image) {
        return res.status(400).json({ success: false, message: 'Username and image are required.' });
    }

    const uploadsDir = path.join('uploads', username);

    // Create user-specific folder if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Decode image and save to file
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');
    const fileName = `image_${Date.now()}.jpg`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFile(filePath, base64Data, 'base64', async (err) => {
        if (err) {
            console.error('Error saving image:', err);
            return res.status(500).json({ success: false, message: 'Error saving image.' });
        }

        try {
            // Save file path to MongoDB
            let user = await UserModel.findOne({ name: username });
            if (!user) {
                // Create a new user if not exists
                user = new UserModel({ name: username, imagePaths: [] });
            }
            user.imagePaths.push(filePath);
            await user.save();

            res.json({ success: true, message: 'Image saved successfully.', filePath });
        } catch (dbError) {
            console.error('Error saving to database:', dbError);
            res.status(500).json({ success: false, message: 'Error saving image path to database.' });
        }
    });
});

// Helper Function: Analyze Image using Hugging Face API
async function analyzeImage(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const data = fs.readFileSync(filePath);

        const response = await fetch('https://api-inference.huggingface.co/models/trpakov/vit-face-expression', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/octet-stream',
            },
            body: data,
            
        });
        console.log(response);

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error(`Hugging Face API error: ${response.status} ${response.statusText} - ${errorDetails}`);
            throw new Error(`Hugging Face API error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error analyzing image:', error.message);
        throw error;
    }
    
}

// Fetch and Analyze Images
app.get('/fetch-analyze/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await UserModel.findOne({ name: username });

        if (!user || user.imagePaths.length === 0) {
            return res.status(404).json({ success: false, message: 'No images found for this user.' });
        }

        const analysisResults = [];

        for (const imagePath of user.imagePaths) {
            const analysis = await analyzeImage(imagePath);

            const image = new ImageModel({
                path: imagePath,
                analysis,
                user: username,
            });

            await image.save();
            analysisResults.push({ path: imagePath, analysis });
        }

        res.json({ success: true, analysis: analysisResults });
    } catch (error) {
        console.error('Error analyzing images:', error);
        res.status(500).json({ success: false, message: 'Error analyzing images.' });
    }
});




// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
