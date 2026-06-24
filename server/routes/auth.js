import express from 'express';
import { getModels } from '../db.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const models = getModels();
    
    // Check if user exists
    const existingEmail = await models.User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const existingUsername = await models.User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Create user
    const newUser = await models.User.create({
      username,
      email,
      password // Plain password verification for simple prototype setup
    });

    // Strip password from response
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      targetExam: newUser.targetExam || '',
      savedPyqs: newUser.savedPyqs || []
    };

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const models = getModels();
    const user = await models.User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Strip password from response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      targetExam: user.targetExam || '',
      savedPyqs: user.savedPyqs || []
    };

    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// Toggle PYQ Bookmark
router.post('/save-pyq', async (req, res) => {
  try {
    const { userId, pyqId } = req.body;
    if (!userId || !pyqId) {
      return res.status(400).json({ error: 'User ID and PYQ ID are required' });
    }

    const models = getModels();
    const user = await models.User.findById(userId);
    if (!user) {
      return res.status(444).json({ error: 'User not found' });
    }

    // Initialize list if missing
    if (!user.savedPyqs) user.savedPyqs = [];

    // Toggle logic
    const index = user.savedPyqs.indexOf(pyqId);
    let bookmarked = false;

    if (index === -1) {
      user.savedPyqs.push(pyqId);
      bookmarked = true;
    } else {
      user.savedPyqs.splice(index, 1);
    }

    // Workaround for fallback structure which requires full mongoose-like .save()
    await user.save();

    res.json({
      message: bookmarked ? 'Question bookmarked' : 'Question removed from bookmarks',
      savedPyqs: user.savedPyqs,
      bookmarked
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to bookmark question: ' + err.message });
  }
});

// Retrieve all bookmarked questions for a user
router.get('/bookmarks', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const models = getModels();
    const user = await models.User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch all pyq documents corresponding to user.savedPyqs
    const allSavedPyqs = user.savedPyqs || [];
    
    // In-memory or mongoose queries
    const bookmarkedQuestions = [];
    for (const pyqId of allSavedPyqs) {
      // Find each question by id
      const questions = await models.Pyq.find({});
      const question = questions.find(q => q._id === pyqId);
      if (question) {
        bookmarkedQuestions.push(question);
      }
    }

    res.json(bookmarkedQuestions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve bookmarks: ' + err.message });
  }
});

export default router;
