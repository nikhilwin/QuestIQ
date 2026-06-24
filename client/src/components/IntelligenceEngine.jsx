import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle2, ChevronRight, BarChart2, Calendar, Target, BrainCircuit, ArrowRight, AlertTriangle } from 'lucide-react';

export default function IntelligenceEngine({ selectedExam, selectedSubject, onSendToAiAssistant }) {
  const [file, setFile] = useState(null);
  const [exam, setExam] = useState(selectedExam ? selectedExam.name : '');
  const [subject, setSubject] = useState(selectedSubject ? selectedSubject.name : '');
  
  // App states
  const [uploading, setUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState(0);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('topics');
  const [error, setError] = useState(null);

  // Load analysis history on mount
  useEffect(() => {
    fetchHistory();
  }, [selectedExam, selectedSubject]);

  const fetchHistory = async () => {
    try {
      const params = {};
      if (selectedExam) params.exam = selectedExam.name;
      if (selectedSubject) params.subject = selectedSubject.name;

      const res = await axios.get('/api/intelligence/history', { params });
      setHistory(res.data);
    } catch (err) {
      console.error("Error loading analysis history:", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const ext = f.name.split('.').pop().toLowerCase();
      if (ext !== 'pdf' && ext !== 'txt') {
        setError('Only .pdf and .txt files are supported.');
        setFile(null);
        return;
      }
      setError(null);
      setFile(f);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file || !exam || !subject) {
      setError('Please provide a file, select an exam, and select a subject.');
      return;
    }

    setUploading(true);
    setReport(null);
    setError(null);

    // Multi-stage animation sequence (simulates parsing states)
    const stages = [
      "Uploading PDF document & setting metadata...",
      "Reading file structure & running PDF extraction...",
      "Spawning Python AI Engine & analyzing text content...",
      "Querying Gemini 2.5 Flash API to map syllabus topics...",
      "Compiling recurrences and structuring final JSON report..."
    ];

    setUploadStage(0);
    const interval = setInterval(() => {
      setUploadStage(prev => {
        if (prev < stages.length - 1) return prev + 1;
        return prev;
      });
    }, 4500); // Progress through stages

    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam', exam);
    formData.append('subject', subject);

    try {
      const res = await axios.post('/api/intelligence/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      clearInterval(interval);
      setReport(res.data.report);
      setUploading(false);
      setFile(null);
      fetchHistory(); // refresh history list
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setError(err.response?.data?.error || 'Analysis service failed. Check API key configuration.');
      setUploading(false);
    }
  };

  const getImportanceBadge = (importance) => {
    if (importance === 'High') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (importance === 'Medium') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    return 'bg-slate-800 text-slate-400 border-slate-700/50';
  };

  return (
    <div className="space-y-8">
      {/* Overview Intro */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">PYQ Intelligence Engine</h1>
          <p className="text-sm text-slate-400">
            Upload past year question papers. Our AI will automatically index questions, compute weights, and create study plans.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form and History */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <UploadCloud className="w-5 h-5 text-violet-400" />
              <span>Upload Question Paper</span>
            </h2>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Exam & Subject */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target Exam</label>
                  <input 
                    type="text"
                    value={exam}
                    onChange={e => setExam(e.target.value)}
                    placeholder="e.g. UPSC Civil Services"
                    className="w-full mt-1 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Subject</label>
                  <input 
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Physics"
                    className="w-full mt-1 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>
              </div>

              {/* Drag/Drop Box */}
              <div className="border border-dashed border-slate-800 hover:border-violet-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-950/20 group">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  accept=".pdf,.txt"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-violet-400 mx-auto mb-3 transition-colors" />
                {file ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-violet-300 max-w-full truncate px-2">{file.name}</p>
                    <p className="text-[10px] text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-medium text-slate-300">Click or drag & drop past paper</p>
                    <p className="text-[10px] text-slate-500 mt-1">Supports PDF, TXT (Max 10MB)</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  uploading || !file
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/30'
                    : 'bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md shadow-violet-950/30'
                }`}
              >
                {uploading ? 'Processing File...' : 'Start AI Analysis'}
              </button>
            </form>
          </div>

          {/* History / Previous Reports */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-100">Analysis History</h2>
            {history.length === 0 ? (
              <p className="text-xs text-slate-500">No previous reports found. Upload a file to generate your first analysis.</p>
            ) : (
              <div className="space-y-3">
                {history.map((rep) => (
                  <div 
                    key={rep._id}
                    onClick={() => setReport(rep)}
                    className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-violet-500/30 cursor-pointer transition-all flex items-center justify-between text-left group"
                  >
                    <div className="space-y-1 overflow-hidden pr-2">
                      <p className="text-xs font-bold text-slate-200 truncate group-hover:text-violet-300 transition-colors">
                        {rep.fileName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {rep.exam} • {rep.subject}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Display Panel (Uploader loading OR Analysis Report Output) */}
        <div className="lg:col-span-2">
          {uploading ? (
            /* Multi-phase loading animation */
            <div className="glass-panel p-12 rounded-3xl min-h-[450px] flex flex-col justify-center space-y-8 items-center text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                <BrainCircuit className="w-8 h-8 text-violet-400 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-soft-glow" />
              </div>
              <div className="space-y-3 max-w-sm">
                <h3 className="text-lg font-bold text-white">PYQ Intelligence Engine Active</h3>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[40px] animate-pulse">
                  {uploadStage === 0 && "Stage 1: Uploading PDF document & setting metadata..."}
                  {uploadStage === 1 && "Stage 2: Reading file structure & running PDF extraction..."}
                  {uploadStage === 2 && "Stage 3: Spawning Python AI Engine & analyzing text content..."}
                  {uploadStage === 3 && "Stage 4: Querying Gemini 2.5 Flash API to map syllabus topics..."}
                  {uploadStage === 4 && "Stage 5: Compiling recurrences and structuring final JSON report..."}
                </p>
                {/* Horizontal Progress bar animation */}
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-violet-600 to-cyan-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(uploadStage + 1) * 20}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : report ? (
            /* Report View */
            <div className="glass-panel p-6 rounded-3xl space-y-6">
              {/* Report Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 bg-violet-600/10 text-violet-400 border border-violet-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    AI Analysis Report
                  </span>
                  <h3 className="text-xl font-bold text-white">{report.fileName}</h3>
                  <p className="text-xs text-slate-400">
                    Exam: <span className="text-slate-200 font-semibold">{report.exam}</span> • Subject: <span className="text-slate-200 font-semibold">{report.subject}</span>
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  Generated: {new Date(report.uploadedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTab('topics')}
                  className={`flex items-center space-x-1.5 py-3 px-4 border-b-2 font-bold cursor-pointer transition-all ${
                    activeTab === 'topics' 
                      ? 'border-violet-500 text-violet-300' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Repeated Topics ({report.repeatedTopics.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('expected')}
                  className={`flex items-center space-x-1.5 py-3 px-4 border-b-2 font-bold cursor-pointer transition-all ${
                    activeTab === 'expected' 
                      ? 'border-violet-500 text-violet-300' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Expected Questions ({report.expectedQuestions.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('revision')}
                  className={`flex items-center space-x-1.5 py-3 px-4 border-b-2 font-bold cursor-pointer transition-all ${
                    activeTab === 'revision' 
                      ? 'border-violet-500 text-violet-300' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>7-Day Study Guide</span>
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className="pt-2 min-h-[300px]">
                {/* 1. Repeated Topics */}
                {activeTab === 'topics' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400">These topics represent recurring concepts in the uploaded papers.</p>
                    <div className="space-y-3">
                      {report.repeatedTopics.map((item, idx) => (
                        <div 
                          key={idx}
                          className="flex flex-wrap items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-slate-700/60 transition-colors gap-3"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-semibold text-slate-200">{item.topic}</span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-slate-400 font-medium">
                              Repeated <span className="text-white font-bold">{item.frequency} times</span>
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${getImportanceBadge(item.importance)}`}>
                              {item.importance} Priority
                            </span>
                            {/* Action to send to AI tutor */}
                            <button
                              onClick={() => onSendToAiAssistant(item.topic)}
                              className="p-1.5 bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white rounded-lg transition-all text-xs flex items-center space-x-1"
                              title="Ask AI to explain or write notes"
                            >
                              <span>AI Study</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Expected Questions */}
                {activeTab === 'expected' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400">Highly expected/predicted exam questions based on recurrence trends.</p>
                    <div className="space-y-3">
                      {report.expectedQuestions.map((eq, idx) => (
                        <div 
                          key={idx}
                          className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2"
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-xs font-bold text-cyan-400 shrink-0 mt-0.5">EQ {idx+1}.</span>
                            <p className="text-sm font-semibold text-slate-200 leading-relaxed">{eq.question}</p>
                          </div>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 pl-8">
                            <span>Syllabus Chapter:</span>
                            <span className="text-violet-400 font-bold">{eq.topic}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Revision Schedule */}
                {activeTab === 'revision' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400">Customized 7-day study flow optimized to cover high-repetition chapters first.</p>
                    <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 mt-4">
                      {report.revisionPath.map((step, idx) => (
                        <div key={idx} className="relative">
                          {/* Dot indicator */}
                          <span className="absolute -left-[31px] top-1 flex items-center justify-center w-4 h-4 rounded-full bg-slate-950 border-2 border-violet-500"></span>
                          
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                              {step.split(':')[0] || `Day ${idx + 1}`}
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {step.includes(':') ? step.substring(step.indexOf(':') + 1).trim() : step}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Idle Empty State */
            <div className="glass-panel p-12 rounded-3xl min-h-[450px] flex flex-col justify-center items-center border-dashed border-slate-800 text-center">
              <FileText className="w-12 h-12 text-slate-700 mb-4 animate-soft-glow" />
              <h3 className="text-lg font-bold text-slate-300">Analysis Console</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">
                Upload a past year paper on the left to activate the PYQ Intelligence Engine and get topics breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
