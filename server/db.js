import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FALLBACK_FILE = path.join(__dirname, 'data_fallback.json');

// --- In-Memory/JSON Fallback Store ---
let fallbackData = {
  users: [],
  exams: [
    {
      name: "UPSC Civil Services",
      subjects: [
        { 
          name: "History", 
          syllabus: ["Ancient India", "Medieval India", "Modern Indian History", "Indian National Movement", "World History"],
          ytLectures: [
            { title: "Modern Indian History Complete", channel: "Harshit Dwivedi Education", url: "https://www.youtube.com/playlist?list=PLwypH_tN26kfC91nN4l_p_l2PZlW5kM-m" },
            { title: "Ancient & Medieval History", channel: "Sudarshan Gurjar", url: "https://www.youtube.com/results?search_query=sudarshan+gurjar+ancient+history+upsc" }
          ]
        },
        { 
          name: "Polity", 
          syllabus: ["Indian Constitution", "Fundamental Rights", "Parliament and State Legislatures", "Judiciary", "Local Government"],
          ytLectures: [
            { title: "Indian Polity by M. Laxmikanth", channel: "Sidharth Arora", url: "https://www.youtube.com/playlist?list=PL3vOUzG_54Ff3K8L5uR5ZuhxM1Zk3nZ9a" },
            { title: "Polity Revision Lectures", channel: "StudyIQ IAS", url: "https://www.youtube.com/results?search_query=polity+laxmikanth+studyiq" }
          ]
        },
        { 
          name: "Geography", 
          syllabus: ["Physical Geography", "Indian Geography", "Economic Geography", "Climatology", "Oceanography"],
          ytLectures: [
            { title: "Indian & Physical Geography Complete", channel: "Amit Sengupta", url: "https://www.youtube.com/playlist?list=PL20E5FDE4987BEA6B" }
          ]
        },
        { 
          name: "Economy", 
          syllabus: ["National Income", "Inflation", "Banking and Monetary Policy", "Fiscal Policy & Budget", "International Trade"],
          ytLectures: [
            { title: "UPSC Economy Core Lectures", channel: "Mrunal Patel", url: "https://www.youtube.com/playlist?list=PL2E8B9FFDA2611A8B" }
          ]
        }
      ]
    },
    {
      name: "JEE Main & Advanced",
      subjects: [
        { 
          name: "Physics", 
          syllabus: ["Mechanics", "Electrodynamics", "Thermodynamics", "Optics", "Modern Physics"],
          ytLectures: [
            { title: "JEE Physics Complete Lectures", channel: "Physics Wallah", url: "https://www.youtube.com/playlist?list=PL2aPrI-C-4t-YjQnK_B_2N8C1a6g8bI2O" }
          ]
        },
        { 
          name: "Chemistry", 
          syllabus: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Chemical Bonding", "Thermodynamics"],
          ytLectures: [
            { title: "JEE Organic Chemistry Full Lectures", channel: "Mohit Tyagi", url: "https://www.youtube.com/playlist?list=PL3aPrI-C-4t8zY_QnK_B_2N8C1a6g8bI2O" }
          ]
        },
        { 
          name: "Mathematics", 
          syllabus: ["Calculus", "Algebra", "Coordinate Geometry", "Trigonometry", "Vectors & 3D Geometry"],
          ytLectures: [
            { title: "JEE Mathematics Playlist", channel: "Sameer Chincholikar", url: "https://www.youtube.com/playlist?list=PL2aPrI-C-4t9zN6y8_C_2N8C1a6g8bI2O" }
          ]
        }
      ]
    },
    {
      name: "NEET",
      subjects: [
        { 
          name: "Biology", 
          syllabus: ["Human Physiology", "Plant Physiology", "Genetics & Evolution", "Cell Structure & Function", "Ecology"],
          ytLectures: [
            { title: "NEET Biology NCERT Line by Line", channel: "Vipin Sharma", url: "https://www.youtube.com/playlist?list=PLwypH_tN26keM2CqNnFp3V99PypzP-8G0" }
          ]
        },
        { 
          name: "Chemistry", 
          syllabus: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Coordination Compounds"],
          ytLectures: [
            { title: "NEET Chemistry Crash Course", channel: "Physics Wallah", url: "https://www.youtube.com/playlist?list=PL2aPrI-C-4t-PzP-8G0" }
          ]
        },
        { 
          name: "Physics", 
          syllabus: ["Mechanics", "Optics", "Electromagnetism", "Modern Physics", "Waves & Sound"],
          ytLectures: [
            { title: "NEET Physics Crash Course Lectures", channel: "Alakh Pandey", url: "https://www.youtube.com/playlist?list=PL2aPrI-C-4t_PypzP-8G0" }
          ]
        }
      ]
    },
    {
      name: "CBSE Class 12 Boards",
      subjects: [
        { 
          name: "Physics", 
          syllabus: ["Electrostatics", "Current Electricity", "Magnetic Effects of Current", "Electromagnetic Induction", "Optics", "Dual Nature of Matter"],
          ytLectures: [
            { title: "Class 12 Boards Physics Playlist", channel: "Radhika Classes", url: "https://www.youtube.com/playlist?list=PLwypH_tN26kfU8Hl73L2P-8G0" }
          ]
        },
        { 
          name: "Chemistry", 
          syllabus: ["Solutions", "Electrochemistry", "Chemical Kinetics", "d and f Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes"],
          ytLectures: [
            { title: "Class 12 Boards Chemistry Full Series", channel: "Bharat Panchal", url: "https://www.youtube.com/playlist?list=PL2aPrI-C-4t9PzP-8G0" }
          ]
        },
        { 
          name: "Mathematics", 
          syllabus: ["Relations and Functions", "Algebra", "Calculus", "Vectors and Three-Dimensional Geometry", "Probability"],
          ytLectures: [
            { title: "Class 12 Board Maths Lectures", channel: "Neha Agrawal Mathematically Inclined", url: "https://www.youtube.com/playlist?list=PL2aPrI-C-4t8PypzP-8G0" }
          ]
        }
      ]
    },
    {
      name: "BCA Semester",
      subjects: [
        { 
          name: "Database Management (DBMS)", 
          syllabus: ["ER Model", "Relational Algebra", "SQL Queries & Joins", "Normalization (1NF-BCNF)", "Transactions & Concurrency"],
          ytLectures: [
            { title: "DBMS Full Playlist for Exams", channel: "Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I81HJCgGPFA6RDy8WY" },
            { title: "DBMS Lectures for Beginners", channel: "Neso Academy", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_Z7c_W1S8D7cshPzF92m5" }
          ]
        },
        { 
          name: "Data Structures", 
          syllabus: ["Arrays & Linked Lists", "Stacks & Queues", "Trees & Binary Search Trees", "Graphs & Traversals (DFS/BFS)", "Sorting & Searching"],
          ytLectures: [
            { title: "Data Structures Full Playlist", channel: "Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEwaAHN1w14upWZ753e_UaH" },
            { title: "Data Structures and Algorithms in C", channel: "Neso Academy", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRj9lld8sWIUNwlKzUu21YZ9" }
          ]
        }
      ]
    },
    {
      name: "SSC CGL",
      subjects: [
        { 
          name: "Quantitative Aptitude", 
          syllabus: ["Ratio & Proportion", "Percentage & Profit-Loss", "Simple & Compound Interest", "Time, Speed & Distance", "Algebra & Geometry"],
          ytLectures: [
            { title: "SSC CGL Maths Complete Lectures", channel: "Abhinay Maths", url: "https://www.youtube.com/playlist?list=PL2aPrI-C-4t8zN6y8_C_2N8" },
            { title: "SSC Math Foundation Course", channel: "Gagan Pratap Maths", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRj9lld8sW" }
          ]
        },
        { 
          name: "General Awareness", 
          syllabus: ["Indian History", "Indian Geography & Economy", "General Science", "Constitution of India"],
          ytLectures: [
            { title: "General Studies Complete Playlist", channel: "Parmar SSC", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I81HJCg" }
          ]
        }
      ]
    },
    {
      name: "CUET Entrance",
      subjects: [
        { 
          name: "General Test", 
          syllabus: ["Numerical Ability", "Logical Reasoning", "Analytical Reasoning", "General Knowledge"],
          ytLectures: [
            { title: "CUET General Test Preparation", channel: "CUET Adda247", url: "https://www.youtube.com/playlist?list=PL2aPrI-C-4t-YjQnK" }
          ]
        },
        { 
          name: "English Language", 
          syllabus: ["Reading Comprehension", "Synonyms & Antonyms", "Idioms and Phrases", "Sentence Correction"],
          ytLectures: [
            { title: "CUET English Language Classes", channel: "Shipra Mishra", url: "https://www.youtube.com/playlist?list=PL3vOUzG_54Ff3K8L5u" }
          ]
        }
      ]
    },
    {
      name: "NDA Exam",
      subjects: [
        { 
          name: "Mathematics", 
          syllabus: ["Algebra & Matrices", "Trigonometry", "Analytical Geometry", "Differential Calculus & Vectors", "Probability & Statistics"],
          ytLectures: [
            { title: "NDA Mathematics Lectures", channel: "SSB Guide (Arpit Choudhary)", url: "https://www.youtube.com/playlist?list=PL2aPrI-C-4t_PypzP-8G0" },
            { title: "NDA Maths Full Course", channel: "Learn With Sumit", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6" }
          ]
        },
        { 
          name: "General Ability Test (GAT)", 
          syllabus: ["English Grammar & Vocabulary", "Physics & Chemistry Basics", "General Science & History", "Geography & Current Events"],
          ytLectures: [
            { title: "NDA GAT Complete Prep Series", channel: "Learn With Sumit", url: "https://www.youtube.com/playlist?list=PL3vOUzG_54Ff3" }
          ]
        }
      ]
    }
  ],
  pyqs: [
    // Prepopulated sample PYQs for demo purposes
    {
      _id: "pyq_1",
      exam: "UPSC Civil Services",
      subject: "Polity",
      topic: "Fundamental Rights",
      year: 2023,
      question: "Which Article of the Constitution of India safeguards one's right to marry the person of one's choice?",
      options: ["Article 19", "Article 21", "Article 25", "Article 29"],
      correctAnswer: "Article 21",
      explanation: "In the Hadiya case (2018), the Supreme Court ruled that the right to marry a person of one's choice is integral to Article 21 (Right to Life and Personal Liberty)."
    },
    {
      _id: "pyq_2",
      exam: "UPSC Civil Services",
      subject: "History",
      topic: "Modern Indian History",
      year: 2022,
      question: "In the context of Colonial India, the Shah Nawaz Khan, Prem Kumar Sahgal and Gurbaksh Singh Dhillon are remembered as:",
      options: [
        "Leaders of Swadeshi and Boycott Movement",
        "Members of the Interim Government",
        "Members of the Drafting Committee of the Constituent Assembly",
        "Officers of the Indian National Army"
      ],
      correctAnswer: "Officers of the Indian National Army",
      explanation: "Shah Nawaz Khan, Prem Kumar Sahgal, and Gurbaksh Singh Dhillon were officers of the Indian National Army (INA) whose trial at the Red Fort in 1945-46 galvanized national support."
    },
    {
      _id: "pyq_3",
      exam: "JEE Main & Advanced",
      subject: "Physics",
      topic: "Mechanics",
      year: 2023,
      question: "A solid sphere of mass M and radius R rolls without slipping down an inclined plane of inclination theta. The acceleration of the sphere is:",
      options: ["g sin(theta)", "5/7 g sin(theta)", "2/3 g sin(theta)", "3/5 g sin(theta)"],
      correctAnswer: "5/7 g sin(theta)",
      explanation: "Using energy conservation or torque equations, a = g sin(theta) / (1 + I/MR^2). For a solid sphere, I = 2/5 MR^2. So a = g sin(theta) / (1 + 2/5) = 5/7 g sin(theta)."
    },
    {
      _id: "pyq_4",
      exam: "NEET",
      subject: "Biology",
      topic: "Genetics & Evolution",
      year: 2023,
      question: "Which of the following Mendelian ratios represents dihybrid cross test cross ratio?",
      options: ["9 : 3 : 3 : 1", "1 : 1 : 1 : 1", "3 : 1", "1 : 2 : 1"],
      correctAnswer: "1 : 1 : 1 : 1",
      explanation: "A dihybrid test cross involves crossing a double heterozygous individual (RrYy) with a double recessive parent (rryy). The phenotypic and genotypic ratio obtained is 1:1:1:1."
    },
    {
      _id: "pyq_bca_1",
      exam: "BCA Semester",
      subject: "Database Management (DBMS)",
      topic: "Normalization (1NF-BCNF)",
      year: 2022,
      question: "A relation R is in 3NF if and only if every non-trivial functional dependency X -> A satisfies which condition?",
      options: [
        "X is a super key",
        "A is a prime attribute",
        "Either X is a super key or A is a prime attribute",
        "X is a candidate key and A is a primary key"
      ],
      correctAnswer: "Either X is a super key or A is a prime attribute",
      explanation: "By definition, a relation R is in Third Normal Form (3NF) if for every functional dependency X -> A, either X is a superkey, or A is a prime attribute (part of some candidate key)."
    },
    {
      _id: "pyq_bca_2",
      exam: "BCA Semester",
      subject: "Data Structures",
      topic: "Trees & Binary Search Trees",
      year: 2023,
      question: "What is the worst-case time complexity of searching for an element in a skewed Binary Search Tree (BST) of size N?",
      options: ["O(log N)", "O(N)", "O(N log N)", "O(1)"],
      correctAnswer: "O(N)",
      explanation: "In a skewed BST (where elements are inserted in sorted order), the tree behaves like a singly linked list. Hence, the worst-case search complexity degrades to O(N)."
    },
    {
      _id: "pyq_ssc_1",
      exam: "SSC CGL",
      subject: "Quantitative Aptitude",
      topic: "Percentage & Profit-Loss",
      year: 2023,
      question: "If the cost price of 12 articles is equal to the selling price of 9 articles, what is the profit percentage?",
      options: ["25%", "33.33%", "20%", "40%"],
      correctAnswer: "33.33%",
      explanation: "Let CP of 1 article = Re 1. CP of 12 articles = Rs 12. SP of 9 articles = Rs 12 => SP of 1 article = 12/9 = 4/3. Profit = 4/3 - 1 = 1/3. Profit % = (1/3)/1 * 100 = 33.33%."
    },
    {
      _id: "pyq_ssc_2",
      exam: "SSC CGL",
      subject: "General Awareness",
      topic: "Constitution of India",
      year: 2022,
      question: "Which Constitutional Amendment Act added the Tenth Schedule (Anti-Defection Law) to the Constitution of India?",
      options: ["42nd Amendment Act", "44th Amendment Act", "52nd Amendment Act", "61st Amendment Act"],
      correctAnswer: "52nd Amendment Act",
      explanation: "The 52nd Amendment Act of 1985 introduced the Tenth Schedule, outlining defection disqualifications for members of parliament and state legislatures."
    },
    {
      _id: "pyq_cuet_1",
      exam: "CUET Entrance",
      subject: "General Test",
      topic: "Logical Reasoning",
      year: 2023,
      question: "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?",
      options: ["7", "10", "12", "13"],
      correctAnswer: "10",
      explanation: "This is an alternating subtraction and addition series. In the first pattern, 3 is added (7+3=10); in the second pattern, 2 is subtracted (10-2=8); then 3 is added (8+3=11), then 2 subtracted (11-2=9), and so on. Next step: 12-2 = 10."
    },
    {
      _id: "pyq_nda_1",
      exam: "NDA Exam",
      subject: "Mathematics",
      topic: "Trigonometry",
      year: 2023,
      question: "What is the exact value of sin 15°?",
      options: [
        "(sqrt(3) - 1) / (2 * sqrt(2))",
        "(sqrt(3) + 1) / (2 * sqrt(2))",
        "(sqrt(6) + sqrt(2)) / 4",
        "(sqrt(6) - sqrt(3)) / 2"
      ],
      correctAnswer: "(sqrt(3) - 1) / (2 * sqrt(2))",
      explanation: "Using the formula sin(A-B) = sinA cosB - cosA sinB, we compute sin(45°-30°) = sin45°cos30° - cos45°sin30° = (1/sqrt(2))*(sqrt(3)/2) - (1/sqrt(2))*(1/2) = (sqrt(3)-1)/(2*sqrt(2))."
    }
  ],
  analysisReports: [],
  communityPosts: [
    {
      _id: "post_1",
      author: "Rohan Sharma",
      title: "How to master Modern Indian History for UPSC Prelims?",
      content: "Personally, I found that reading Spectrum Book chronologically and then solving topic-wise PYQs from 2011 onwards helps a lot. Focus heavily on the 1857-1947 timeline, especially Congress sessions, tribal revolts, and constitutional developments (Acts of 1909, 1919, 1935). Let's discuss!",
      category: "Discussion",
      likes: 18,
      comments: [
        { author: "Priya Patel", content: "Totally agree! Bipin Chandra is also good for mains, but Spectrum is excellent for prelims facts.", createdAt: new Date() }
      ],
      createdAt: new Date(Date.now() - 3600000 * 5)
    },
    {
      _id: "post_2",
      author: "Amit Verma",
      title: "NEET Biology Quick Revision Sheet - Ecology.pdf",
      content: "Hey guys! I have created a consolidated 3-page formula/concept sheet for the entire Ecology unit (NEET syllabus). It covers Organisms and Populations, Ecosystem, and Biodiversity conservation with all key stats and graphs. Hope it helps!",
      category: "Notes",
      likes: 34,
      comments: [],
      fileUrl: "sample_notes_ecology.pdf",
      createdAt: new Date(Date.now() - 3600000 * 24)
    }
  ]
};

// Initialize fallback JSON file if it doesn't exist
const initFallbackDB = () => {
  if (!fs.existsSync(FALLBACK_FILE)) {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(fallbackData, null, 2));
  } else {
    try {
      const data = fs.readFileSync(FALLBACK_FILE, 'utf8');
      const parsed = JSON.parse(data);
      // Merge keys to ensure 'users' exists in reading older fallbacks
      fallbackData = { ...fallbackData, ...parsed };
    } catch (e) {
      console.error("Error reading fallback DB, resetting to defaults...", e);
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(fallbackData, null, 2));
    }
  }
};

const saveFallbackDB = () => {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(fallbackData, null, 2));
  } catch (e) {
    console.error("Failed to save fallback DB", e);
  }
};

// --- Fallback CRUD Operations ---
const fallbackModels = {
  User: {
    findOne: async (query = {}) => {
      if (query.email) {
        return fallbackData.users.find(u => u.email === query.email) || null;
      }
      if (query.username) {
        return fallbackData.users.find(u => u.username === query.username) || null;
      }
      return null;
    },
    findById: async (id) => {
      const user = fallbackData.users.find(u => u._id === id);
      if (!user) return null;
      return {
        ...user,
        save: async function() {
          const idx = fallbackData.users.findIndex(u => u._id === id);
          if (idx !== -1) {
            fallbackData.users[idx] = {
              _id: this._id,
              username: this.username,
              email: this.email,
              password: this.password,
              targetExam: this.targetExam,
              savedPyqs: this.savedPyqs
            };
            saveFallbackDB();
          }
          return this;
        }
      };
    },
    create: async (userData) => {
      const newUser = {
        _id: 'user_' + Date.now(),
        savedPyqs: [],
        targetExam: '',
        ...userData
      };
      fallbackData.users.push(newUser);
      saveFallbackDB();
      return newUser;
    }
  },
  Exam: {
    find: async (query = {}) => {
      return fallbackData.exams;
    },
    findOne: async (query = {}) => {
      if (query.name) {
        return fallbackData.exams.find(e => e.name.toLowerCase() === query.name.toLowerCase()) || null;
      }
      return fallbackData.exams[0] || null;
    }
  },
  Pyq: {
    find: async (query = {}) => {
      let results = [...fallbackData.pyqs];
      if (query.exam) results = results.filter(q => q.exam === query.exam);
      if (query.subject) results = results.filter(q => q.subject === query.subject);
      if (query.topic) results = results.filter(q => q.topic.toLowerCase().includes(query.topic.toLowerCase()));
      if (query.year) results = results.filter(q => q.year === Number(query.year));
      return results;
    },
    create: async (pyqData) => {
      const newPyq = { _id: 'pyq_' + Date.now() + Math.random().toString(36).substr(2, 5), ...pyqData };
      fallbackData.pyqs.push(newPyq);
      saveFallbackDB();
      return newPyq;
    }
  },
  AnalysisReport: {
    find: async (query = {}) => {
      let results = [...fallbackData.analysisReports];
      if (query.exam) results = results.filter(r => r.exam === query.exam);
      if (query.subject) results = results.filter(r => r.subject === query.subject);
      return results.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    },
    create: async (reportData) => {
      const newReport = { _id: 'report_' + Date.now(), uploadedAt: new Date(), ...reportData };
      fallbackData.analysisReports.push(newReport);
      saveFallbackDB();
      return newReport;
    }
  },
  CommunityPost: {
    find: async (query = {}) => {
      let results = [...fallbackData.communityPosts];
      if (query.category) results = results.filter(p => p.category === query.category);
      return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    findById: async (id) => {
      const post = fallbackData.communityPosts.find(p => p._id === id);
      if (!post) return null;
      return {
        ...post,
        save: async function() {
          const idx = fallbackData.communityPosts.findIndex(p => p._id === id);
          if (idx !== -1) {
            fallbackData.communityPosts[idx] = this;
            saveFallbackDB();
          }
          return this;
        }
      };
    },
    create: async (postData) => {
      const newPost = {
        _id: 'post_' + Date.now(),
        likes: 0,
        comments: [],
        createdAt: new Date(),
        ...postData
      };
      fallbackData.communityPosts.push(newPost);
      saveFallbackDB();
      return newPost;
    }
  }
};

// --- Mongoose Setup ---
let useFallback = false;
let db = fallbackModels;

// Mongoose Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  targetExam: String,
  savedPyqs: [String] // Array of PYQ IDs
});

const examSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subjects: [{
    name: { type: String, required: true },
    syllabus: [String],
    ytLectures: [{
      title: String,
      channel: String,
      url: String
    }]
  }]
});

const pyqSchema = new mongoose.Schema({
  exam: String,
  subject: String,
  topic: String,
  year: Number,
  question: String,
  options: [String],
  correctAnswer: String,
  explanation: String
});

const analysisReportSchema = new mongoose.Schema({
  exam: String,
  subject: String,
  fileName: String,
  uploadedAt: { type: Date, default: Date.now },
  repeatedTopics: [{
    topic: String,
    frequency: Number,
    importance: { type: String, enum: ['High', 'Medium', 'Low'] }
  }],
  expectedQuestions: [{
    question: String,
    topic: String
  }],
  revisionPath: [String]
});

const commentSchema = new mongoose.Schema({
  author: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const communityPostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Discussion', 'Notes', 'Q&A'], default: 'Discussion' },
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
  fileUrl: String,
  createdAt: { type: Date, default: Date.now }
});

let UserModel, ExamModel, PyqModel, AnalysisReportModel, CommunityPostModel;

export async function connectDB(mongoUri) {
  initFallbackDB();
  
  if (!mongoUri) {
    console.log("⚠️ No MONGODB_URI provided. Fallback to Local JSON Database active.");
    useFallback = true;
    db = fallbackModels;
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log("Connected to MongoDB successfully!");
    
    UserModel = mongoose.model('User', userSchema);
    ExamModel = mongoose.model('Exam', examSchema);
    PyqModel = mongoose.model('Pyq', pyqSchema);
    AnalysisReportModel = mongoose.model('AnalysisReport', analysisReportSchema);
    CommunityPostModel = mongoose.model('CommunityPost', communityPostSchema);

    // Seed database if empty
    const count = await ExamModel.countDocuments();
    if (count === 0) {
      console.log("Seeding MongoDB with default exams and PYQs...");
      await ExamModel.insertMany(fallbackData.exams);
      await PyqModel.insertMany(fallbackData.pyqs);
      await CommunityPostModel.insertMany(fallbackData.communityPosts);
    }

    db = {
      User: UserModel,
      Exam: ExamModel,
      Pyq: PyqModel,
      AnalysisReport: AnalysisReportModel,
      CommunityPost: CommunityPostModel
    };
    useFallback = false;
  } catch (err) {
    console.error("❌ MongoDB connection failed. Falling back to Local JSON Database.");
    useFallback = true;
    db = fallbackModels;
  }
}

export function getModels() {
  return db;
}

export function isFallbackActive() {
  return useFallback;
}
