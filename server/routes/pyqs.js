import express from 'express';
import { getModels } from '../db.js';

const router = express.Router();

// Get list of all exams and their subjects
router.get('/exams', async (req, res) => {
  try {
    const models = getModels();
    const exams = await models.Exam.find({});
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving exams: ' + err.message });
  }
});

// Get syllabus details for a specific exam
router.get('/exams/:name', async (req, res) => {
  try {
    const models = getModels();
    const exam = await models.Exam.findOne({ name: req.params.name });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving exam details: ' + err.message });
  }
});

// Get PYQs optionally filtered by exam, subject, topic, and/or year
router.get('/pyqs', async (req, res) => {
  try {
    const { exam, subject, topic, year } = req.query;
    const query = {};
    if (exam) query.exam = exam;
    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    if (year) query.year = Number(year);

    const models = getModels();
    const pyqs = await models.Pyq.find(query);
    res.json(pyqs);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving PYQs: ' + err.message });
  }
});

// Create a single PYQ
router.post('/pyqs', async (req, res) => {
  try {
    const models = getModels();
    const newPyq = await models.Pyq.create(req.body);
    res.status(201).json(newPyq);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating PYQ: ' + err.message });
  }
});

export default router;
