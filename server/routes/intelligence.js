import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { getModels } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.txt') {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf and .txt files are supported.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Route: Get analysis history
router.get('/history', async (req, res) => {
  try {
    const { exam, subject } = req.query;
    const query = {};
    if (exam) query.exam = exam;
    if (subject) query.subject = subject;

    const models = getModels();
    const reports = await models.AnalysisReport.find(query);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving history: ' + err.message });
  }
});

// Route: Upload and Analyze PYQs
router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { exam, subject } = req.body;
    if (!exam || !subject) {
      return res.status(400).json({ error: 'Exam and Subject parameters are required' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Check if GEMINI_API_KEY is present
    const hasApiKey = !!process.env.GEMINI_API_KEY;

    console.log(`Starting analysis for file: ${fileName} (${exam} -> ${subject}). Key configured: ${hasApiKey}`);

    // We will run the Python script to analyze the PYQs
    const aiScriptPath = path.join(__dirname, '..', '..', 'ai', 'analyze_pyqs.py');

    let scriptOutput = "";
    let scriptError = "";

    // Spawn python process
    const pythonProcess = spawn('python', [
      aiScriptPath,
      '--file', filePath,
      '--exam', exam,
      '--subject', subject
    ], {
      env: { ...process.env } // Pass environment variables (including GEMINI_API_KEY)
    });

    pythonProcess.stdout.on('data', (data) => {
      scriptOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      scriptError += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      console.log(`Python process finished with exit code ${code}`);
      
      // Clean up uploaded file
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete temp file:", err);
      }

      let analysisReport;

      if (code === 0 && scriptOutput.trim()) {
        try {
          const parsedResult = JSON.parse(scriptOutput.trim());
          const models = getModels();
          analysisReport = await models.AnalysisReport.create({
            exam,
            subject,
            fileName,
            repeatedTopics: parsedResult.repeatedTopics,
            expectedQuestions: parsedResult.expectedQuestions,
            revisionPath: parsedResult.revisionPath
          });

          return res.json({
            message: 'Analysis completed successfully using Python AI Engine.',
            report: analysisReport,
            simulated: false
          });
        } catch (parseErr) {
          console.error("Failed to parse Python script output. Raw output was:", scriptOutput);
          console.error("Parse error details:", parseErr);
          // Fallback on JSON parse error
        }
      }

      // FALLBACK: If python failed (code !== 0), or wasn't configured, or output was unparseable
      console.log("⚠️ Spawning Python process failed or returned bad format. Falling back to backend analyzer.");
      console.log("Stderr details:", scriptError);
      
      // Generate highly realistic exam-specific analysis reports as fallback
      const mockReports = getMockAnalysis(exam, subject, fileName);
      const models = getModels();
      analysisReport = await models.AnalysisReport.create(mockReports);

      return res.json({
        message: 'Analysis completed (Mock Fallback Active - Configure python environments and GEMINI_API_KEY for actual OCR/parsing).',
        report: analysisReport,
        simulated: true,
        debugError: scriptError || 'No stdout received'
      });
    });

  } catch (err) {
    console.error("File upload/analysis handler error:", err);
    res.status(500).json({ error: 'Server error processing file: ' + err.message });
  }
});

// Helper for Mock report generation
function getMockAnalysis(exam, subject, fileName) {
  // Tailored reports based on the subject and exam
  let repeatedTopics = [
    { topic: "Core Principles & Overview", frequency: 8, importance: "High" },
    { topic: "Functional Implementations", frequency: 5, importance: "High" },
    { topic: "Historical Paradigms", frequency: 3, importance: "Medium" },
    { topic: "Edge Cases & Anomalies", frequency: 2, importance: "Low" }
  ];

  let expectedQuestions = [
    { question: "Explain the fundamental structural mechanics governing this subject, highlighting exceptions.", topic: "Core Principles & Overview" },
    { question: "Identify the critical bottlenecks when scaling implementations under high constraints.", topic: "Functional Implementations" },
    { question: "Compare the modern framework of this topic with its historical predecessors.", topic: "Historical Paradigms" }
  ];

  let revisionPath = [
    "Day 1-2: Master the foundational definitions and formulas under Core Principles.",
    "Day 3-4: Build practical solutions and practice 10 numerical problems on Functional Implementations.",
    "Day 5: Revise key historical timelines and critical anomalies.",
    "Day 6: Solve 3 mock sample question papers under exam conditions.",
    "Day 7: Quick review of summary formula sheets and sleep early."
  ];

  // Specific content updates based on selected topics
  if (subject.toLowerCase() === 'physics') {
    repeatedTopics = [
      { topic: "Mechanics & Rigid Body Dynamics", frequency: 12, importance: "High" },
      { topic: "Electrostatics & Capacitance", frequency: 9, importance: "High" },
      { topic: "Thermodynamics & Heat Transfer", frequency: 6, importance: "Medium" },
      { topic: "Modern Physics & Bohr Model", frequency: 4, importance: "Medium" },
      { topic: "Geometrical Optics", frequency: 2, importance: "Low" }
    ];
    expectedQuestions = [
      { question: "Determine the moment of inertia of a composite hollow cone rolling without slipping on a horizontal surface.", topic: "Mechanics & Rigid Body Dynamics" },
      { question: "Derive the electric field intensity inside a uniformly charged non-conducting sphere with a spherical cavity.", topic: "Electrostatics & Capacitance" },
      { question: "Analyze the thermodynamic cycle efficiency of a system operating between three distinct isothermal reservoirs.", topic: "Thermodynamics & Heat Transfer" }
    ];
    revisionPath = [
      "Day 1-2: Rigorous practice of torque, rotation, and rolling constraints (Mechanics).",
      "Day 3-4: Solve Gauss law applications and capacitor energy calculations (Electrostatics).",
      "Day 5: Revise Carnot cycles and first law efficiency formulas (Thermodynamics).",
      "Day 6: Practice photoelectric effect equations and transition lines (Modern Physics).",
      "Day 7: Formula sheet review, focusing on constants and units."
    ];
  } else if (subject.toLowerCase() === 'biology') {
    repeatedTopics = [
      { topic: "Genetics & Mendelian Inheritance", frequency: 15, importance: "High" },
      { topic: "Human Physiology & Cardiac Cycle", frequency: 11, importance: "High" },
      { topic: "Ecology & Pyramids of Biomass", frequency: 8, importance: "Medium" },
      { topic: "Cell Division & Meiosis Stages", frequency: 5, importance: "Medium" },
      { topic: "Plant Water Relations", frequency: 3, importance: "Low" }
    ];
    expectedQuestions = [
      { question: "Describe the chromosomal mutations leading to Down syndrome vs Turner syndrome, noting cross-ratio chances.", topic: "Genetics & Mendelian Inheritance" },
      { question: "Trace the flow of blood through the double-circulation system and detail the bundle of His conduction delays.", topic: "Human Physiology & Cardiac Cycle" },
      { question: "Explain why the pyramid of energy is always upright, while the pyramid of biomass can be inverted in aquatic systems.", topic: "Ecology & Pyramids of Biomass" }
    ];
    revisionPath = [
      "Day 1-2: Draw out pedigree charts and solve cross-breeding ratios (Genetics).",
      "Day 3-4: Draw diagrams of the nephron and heart pathways (Human Physiology).",
      "Day 5: Memorise ecological parks, endangered lists, and carbon cycles (Ecology).",
      "Day 6: Revise mitotic prophase stages and chromosome alignment (Cell Division).",
      "Day 7: Labeling practice on major NCERT/textbook diagrams."
    ];
  } else if (subject.toLowerCase() === 'polity') {
    repeatedTopics = [
      { topic: "Constitutional Amendments (Article 368)", frequency: 10, importance: "High" },
      { topic: "Fundamental Rights & Writ Jurisdiction", frequency: 8, importance: "High" },
      { topic: "Presidential Powers & Emergency Provisions", frequency: 6, importance: "Medium" },
      { topic: "Panchayati Raj Institution (73rd Amendment)", frequency: 4, importance: "Medium" },
      { topic: "Parliamentary Committees", frequency: 3, importance: "Low" }
    ];
    expectedQuestions = [
      { question: "Critically evaluate the Basic Structure Doctrine as a limit on the Parliament's power to amend under Article 368.", topic: "Constitutional Amendments (Article 368)" },
      { question: "Compare the writ jurisdiction of the Supreme Court under Article 32 with that of High Courts under Article 226.", topic: "Fundamental Rights & Writ Jurisdiction" },
      { question: "Discuss the financial emergency provisions and how they impact the federal character of center-state fiscal relations.", topic: "Presidential Powers & Emergency Provisions" }
    ];
    revisionPath = [
      "Day 1-2: Re-read key landmark judgments (Kesavananda, Minerva Mills) and amendments (42nd, 44th).",
      "Day 3-4: Chart out the five writs (Habeas Corpus, Mandamus, etc.) and scope of Articles 14, 19, 21.",
      "Day 5: Revise terms, appointment, and impeachment mechanisms for President and Governors.",
      "Day 6: Study devolution of subjects, municipal list, and rural funding (73rd & 74th amendments).",
      "Day 7: Revise Laxmikanth summaries and tables on schedules and constitutional bodies."
    ];
  }

  return {
    exam,
    subject,
    fileName,
    uploadedAt: new Date(),
    repeatedTopics,
    expectedQuestions,
    revisionPath
  };
}

export default router;
