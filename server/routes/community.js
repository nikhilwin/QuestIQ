import express from 'express';
import { getModels } from '../db.js';

const router = express.Router();

// Get all posts, optional filter by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) query.category = category;

    const models = getModels();
    const posts = await models.CommunityPost.find(query);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving posts: ' + err.message });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { author, title, content, category, fileUrl } = req.body;
    if (!author || !title || !content) {
      return res.status(400).json({ error: 'Author, title, and content are required' });
    }

    const models = getModels();
    const newPost = await models.CommunityPost.create({
      author,
      title,
      content,
      category: category || 'Discussion',
      fileUrl
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating post: ' + err.message });
  }
});

// Like a post
router.post('/:id/like', async (req, res) => {
  try {
    const models = getModels();
    const post = await models.CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error liking post: ' + err.message });
  }
});

// Add comment to a post
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, content } = req.body;
    if (!author || !content) {
      return res.status(400).json({ error: 'Author and content are required for comments' });
    }

    const models = getModels();
    const post = await models.CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({ author, content, createdAt: new Date() });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error adding comment: ' + err.message });
  }
});

export default router;
