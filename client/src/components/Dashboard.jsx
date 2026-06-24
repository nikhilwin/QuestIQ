import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, GraduationCap, ChevronRight, Award, Compass, ArrowRight, Video, Brain, Search, BarChart2, Calendar, X, Sparkles } from 'lucide-react';

export default function Dashboard({ onSelectExam, onSelectSubject, selectedExam, selectedSubject, onSendToAiAssistant, onNavigate }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/exams');
      setExams(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure the backend is running.');
      setLoading(false);
    }
  };

  const getExamIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('upsc') || n.includes('civil')) return <Compass className="w-6 h-6 text-yellow-400" />;
    if (n.includes('jee') || n.includes('engineering')) return <Award className="w-6 h-6 text-cyan-400" />;
    if (n.includes('neet') || n.includes('medical')) return <GraduationCap className="w-6 h-6 text-red-400" />;
    return <BookOpen className="w-6 h-6 text-violet-400" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 animate-pulse">Loading exams and databases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-6 rounded-2xl max-w-xl mx-auto border-red-500/20 text-center my-10">
        <p className="text-red-400 font-medium mb-3">{error}</p>
        <button 
          onClick={fetchExams}
          className="px-4 py-2 bg-red-600/30 border border-red-500/30 hover:bg-red-600/50 rounded-lg text-sm text-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative glass-panel p-8 rounded-3xl overflow-hidden gradient-bg-violet gradient-glow-violet">
        <div className="absolute right-0 top-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="px-3 py-1 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            QuestIQ Portal
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Accelerate Your Prep with <span className="gradient-text">PYQ Intelligence</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg">
            Choose your target exam, browse subjects, and let AI analyze historical patterns to pinpoint exactly what you need to study.
          </p>
        </div>
      </div>

      {/* Step 1: Exam Selection */}
      {!selectedExam ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-violet-400" />
            <h2 className="text-xl font-bold text-slate-100">Step 1: Select Your Exam</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div 
                key={exam._id || exam.name}
                onClick={() => onSelectExam(exam)}
                className="group glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/30 group-hover:border-violet-500/30 transition-colors">
                    {getExamIcon(exam.name)}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-6 space-y-2">
                  <h3 className="text-lg font-bold group-hover:text-violet-300 transition-colors">{exam.name}</h3>
                  <p className="text-xs text-slate-400">
                    {exam.subjects.length} Major Subjects • Available Syllabus & PYQ Analytics
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Step 2: Subject & Syllabus Selection */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-violet-600/20 text-violet-400 rounded-lg text-xs font-bold uppercase">
                {selectedExam.name}
              </span>
              <h2 className="text-xl font-bold text-slate-100">
                {selectedSubject ? `${selectedSubject.name} Syllabus` : 'Select Subject'}
              </h2>
            </div>
            <button 
              onClick={() => {
                onSelectExam(null);
                onSelectSubject(null);
              }}
              className="text-sm text-violet-400 hover:text-violet-300 hover:underline cursor-pointer"
            >
              ← Change Exam
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Subject Sidebar Selector */}
            <div className="lg:col-span-1 space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
                Subjects
              </span>
              {selectedExam.subjects.map((sub) => {
                const isSelected = selectedSubject && selectedSubject.name === sub.name;
                return (
                  <button
                    key={sub.name}
                    onClick={() => onSelectSubject(sub)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl text-left border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600/10 border-violet-500/40 text-violet-200 font-semibold shadow-md shadow-violet-950/20'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    <span>{sub.name}</span>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'opacity-100 text-violet-400' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </div>

            {/* Syllabus View Area */}
            <div className="lg:col-span-3">
              {selectedSubject ? (
                <div className="glass-panel p-6 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold">{selectedSubject.name}</h3>
                      <p className="text-xs text-slate-400">Chapters and sub-topics included in the official syllabus.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedSubject.syllabus.map((topic, idx) => (
                      <button 
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className="w-full flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl hover:border-violet-500/40 hover:bg-violet-950/5 transition-all text-left cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs font-semibold text-slate-400 group-hover:bg-violet-600/20 group-hover:text-violet-300 transition-colors">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium text-slate-200 group-hover:text-violet-200 transition-colors">{topic}</span>
                        </div>
                        <span className="px-2 py-1 bg-violet-600/10 text-violet-400 rounded-md text-[10px] uppercase font-bold border border-violet-500/10 group-hover:bg-violet-600 group-hover:text-white transition-all">
                          Explore Topic
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* YouTube Lectures Recommendations */}
                  {selectedSubject.ytLectures && selectedSubject.ytLectures.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-4">
                      <div className="flex items-center space-x-2 text-red-400">
                        <Video className="w-5 h-5" />
                        <h4 className="font-bold text-sm uppercase tracking-wider text-slate-200">Recommended YouTube Playlists</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSubject.ytLectures.map((lecture, lIdx) => (
                          <a 
                            key={lIdx}
                            href={lecture.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col justify-between p-4 bg-slate-900/50 border border-slate-800 hover:border-red-500/30 rounded-xl transition-all duration-300 hover:bg-slate-900/85 group cursor-pointer"
                          >
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-200 group-hover:text-red-400 transition-colors leading-snug">
                                {lecture.title}
                              </p>
                              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
                                Channel: {lecture.channel}
                              </p>
                            </div>
                            <div className="text-[10px] font-bold text-red-400 mt-4 flex items-center space-x-1 group-hover:underline">
                              <span>Watch Lectures</span>
                              <span>→</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-panel p-12 rounded-2xl text-center border-dashed border-slate-800">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-300">Choose a Subject</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                    Click a subject from the left panel to browse chapters and start target studies.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Topic Action Explorer Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl shadow-violet-950/10 transform scale-100 transition-all duration-300">
            {/* Background ambient glow */}
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-violet-600/15 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest block">
                  {selectedSubject?.name} • Topic Explorer
                </span>
                <h3 className="text-xl font-extrabold text-white leading-tight">
                  {selectedTopic}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedTopic(null)}
                className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed relative z-10">
              Select an action below to analyze weightage, practice historical questions, or consult the AI Study Tutor for revision notes.
            </p>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {/* Option 1: AI Explanation */}
              <button
                onClick={() => {
                  onSendToAiAssistant(selectedTopic);
                  setSelectedTopic(null);
                }}
                className="flex flex-col p-4 bg-violet-950/10 border border-violet-500/25 hover:border-violet-500 hover:bg-violet-950/20 text-left rounded-2xl group transition-all duration-300 cursor-pointer shadow-md shadow-violet-950/10"
              >
                <Brain className="w-6 h-6 text-violet-400 group-hover:scale-110 transition-transform mb-3" />
                <span className="text-sm font-bold text-violet-200">AI Study Tutor</span>
                <span className="text-[10px] text-slate-500 mt-1">Get notes & summaries</span>
              </button>

              {/* Option 2: Solve PYQs */}
              <button
                onClick={() => {
                  onSendToAiAssistant(selectedTopic); // Pre-sets the topic
                  onNavigate('pyq-hub');
                  setSelectedTopic(null);
                }}
                className="flex flex-col p-4 bg-slate-900/40 border border-slate-800 hover:border-violet-500/40 hover:bg-violet-950/10 text-left rounded-2xl group transition-all duration-300 cursor-pointer"
              >
                <Search className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform mb-3" />
                <span className="text-sm font-bold text-slate-200 group-hover:text-violet-300">Practice PYQs</span>
                <span className="text-[10px] text-slate-500 mt-1">Solve exam questions</span>
              </button>

              {/* Option 3: Weightage Analysis */}
              <button
                onClick={() => {
                  onNavigate('analyzer');
                  setSelectedTopic(null);
                }}
                className="flex flex-col p-4 bg-slate-900/40 border border-slate-800 hover:border-violet-500/40 hover:bg-violet-950/10 text-left rounded-2xl group transition-all duration-300 cursor-pointer"
              >
                <BarChart2 className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform mb-3" />
                <span className="text-sm font-bold text-slate-200 group-hover:text-violet-300">Weightage Chart</span>
                <span className="text-[10px] text-slate-500 mt-1">Check repeat frequency</span>
              </button>

              {/* Option 4: Smart Planner */}
              <button
                onClick={() => {
                  onNavigate('revision');
                  setSelectedTopic(null);
                }}
                className="flex flex-col p-4 bg-slate-900/40 border border-slate-800 hover:border-violet-500/40 hover:bg-violet-950/10 text-left rounded-2xl group transition-all duration-300 cursor-pointer"
              >
                <Calendar className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform mb-3" />
                <span className="text-sm font-bold text-slate-200 group-hover:text-violet-300">7-Day Planner</span>
                <span className="text-[10px] text-slate-500 mt-1">Add to revision task</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
