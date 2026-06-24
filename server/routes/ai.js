import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Helper to get Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Route: Explain a topic
router.post('/explain', async (req, res) => {
  const { topic, subject, exam } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  const ai = getGeminiClient();
  if (!ai) {
    // Return simulated explanation
    return res.json({
      explanation: `### Explanation for: **${topic}** *(Simulated AI Mode - Configure GEMINI_API_KEY in server/.env for actual AI)*\n\n` +
        `This is a detailed overview of the topic **${topic}** relevant to the subject of **${subject || 'General Studies'}** for the **${exam || 'General Exams'}** exam.\n\n` +
        `#### Key Core Concepts\n` +
        `1. **Definition & Context:** Understanding the primary definitions and how it interacts within the syllabus.\n` +
        `2. **Fundamental Principles:** The core guidelines and components that define this area.\n` +
        `3. **Real-world Applications & Significance:** Why this topic is highly relevant for exam questions (often tested through conceptual problems or case studies).\n\n` +
        `#### Important Points to Remember\n` +
        `- Highlight 1: Make sure to study the historical timeline or direct equations corresponding to ${topic}.\n` +
        `- Highlight 2: Often combined with adjacent concepts in multi-step analytical questions.\n` +
        `- Highlight 3: Check PYQs from 2021 and 2023 for practical questions on this topic.`,
      simulated: true
    });
  }

  try {
    const prompt = `You are QuestIQ, an expert academic tutor. Provide a detailed, clear, and comprehensive explanation of the topic "${topic}" in the subject "${subject || 'general context'}" for a student preparing for the "${exam || 'competitive exams'}" exam. Use Markdown formatting. Structure it with clear headings, bullet points, and practical examples.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ explanation: response.text, simulated: false });
  } catch (err) {
    res.status(500).json({ error: 'Gemini API Error: ' + err.message });
  }
});

// Route: Generate notes for a topic
router.post('/notes', async (req, res) => {
  const { topic, subject, exam } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  const ai = getGeminiClient();
  if (!ai) {
    // Return simulated revision notes
    return res.json({
      notes: `# Study Notes: **${topic}**\n\n` +
        `> **Simulated Notes Mode** (Provide your \`GEMINI_API_KEY\` in \`server/.env\` for full AI generation)\n\n` +
        `## 1. Quick Overview\n` +
        `- **Exam Category:** ${exam || 'Standard Syllabus'}\n` +
        `- **Subject:** ${subject || 'General Study'}\n` +
        `- **Est. Study Time:** 45 mins\n\n` +
        `## 2. Core Framework & Diagrams\n` +
        `Here is a summary breakdown of **${topic}**:\n\n` +
        `| Sub-topic / Section | Core Concept | Key Formula / Event | Importance |\n` +
        `| --- | --- | --- | --- |\n` +
        `| Introduction | Basic understanding of ${topic} | Foundation concepts | High |\n` +
        `| Critical Pillars | Key parameters and definitions | Theoretical standard | High |\n` +
        `| Standard Models | Real-world applications & equations | Formulas/Use Cases | Medium |\n\n` +
        `## 3. High-Weightage Takeaways\n` +
        `- **Formula/Concept to memorise:** Make sure to note how ${topic} interacts with surrounding units.\n` +
        `- **Common Exam Trap:** Watch out for negative values or trick exceptions that are frequently asked in MCQs.\n` +
        `- **Historical Trend:** 2-3 questions are consistently asked on this theme every alternate year.`,
      simulated: true
    });
  }

  try {
    const prompt = `You are QuestIQ, a premium AI academic tutor. Generate highly structured, comprehensive Revision Notes for the topic "${topic}" in "${subject || 'General Studies'}" for the "${exam || 'Competitive Exam'}" exam. Use rich Markdown elements (bold text, bullet points, blockquotes, code-blocks, and tables). Make sure the notes are detailed, easy to read, and highlight "High-Weightage Facts" and "Common Trap areas" that students should focus on.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ notes: response.text, simulated: false });
  } catch (err) {
    res.status(500).json({ error: 'Gemini API Error: ' + err.message });
  }
});

// Route: Generate MCQs for a topic
router.post('/mcqs', async (req, res) => {
  const { topic, exam } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  const ai = getGeminiClient();
  if (!ai) {
    // Return simulated MCQs
    return res.json({
      mcqs: [
        {
          question: `Which of the following is most critical when analyzing ${topic} in the context of standard exam patterns?`,
          options: ["Option A: Basic conceptual definitions", "Option B: Detailed secondary applications", "Option C: Historical edge cases only", "Option D: All of the above"],
          correctAnswer: "Option D: All of the above",
          explanation: `All options represent different facets of studying ${topic} comprehensively.`
        },
        {
          question: `Which formula or theoretical model is typically applied to verify issues related to ${topic}?`,
          options: ["First Principle Model", "Secondary Integration Method", "Standard Equilibrium Curve", "None of these"],
          correctAnswer: "First Principle Model",
          explanation: "The First Principle Model forms the mathematical base for computing values in this field."
        },
        {
          question: `True or False: The study of ${topic} is considered a recurring high-weightage component in the ${exam || 'main syllabus'}.`,
          options: ["True", "False", "Partially True", "Depends on specific year's trends"],
          correctAnswer: "True",
          explanation: "Historical trend analysis confirms that this topic is consistently represented in previous papers."
        }
      ],
      simulated: true
    });
  }

  try {
    const prompt = `Generate exactly 5 distinct, high-quality multiple choice questions (MCQs) testing a student's knowledge of the topic "${topic}" within the context of the "${exam || 'standard exam'}" exam. Ensure questions have varying difficulties (easy, medium, hard). 
    
    You MUST return the output as a valid JSON array of objects. Do NOT wrap the JSON in markdown code blocks (e.g. do not write \`\`\`json). Output exactly a raw JSON array.
    Each object in the array must strictly have these fields:
    1. "question" (string) - the MCQ test question
    2. "options" (array of exactly 4 strings) - the four choices
    3. "correctAnswer" (string) - must exactly match one of the choices in the options list
    4. "explanation" (string) - details why the choice is correct and others are not`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    let mcqs;
    try {
      mcqs = JSON.parse(response.text.trim());
    } catch (e) {
      // In case the model wrapped it in markdown or returned invalid JSON
      const cleanJson = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      mcqs = JSON.parse(cleanJson);
    }

    res.json({ mcqs, simulated: false });
  } catch (err) {
    res.status(500).json({ error: 'Gemini API Error: ' + err.message });
  }
});

export default router;
