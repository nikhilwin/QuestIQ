import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Calendar, BookOpen, CheckCircle2, AlertCircle, PlusCircle, HelpCircle, Star } from 'lucide-react';

export default function PyqRepository({ selectedExam, selectedSubject, currentUser, onLoginRequired, preloadedTopic }) {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [filterExam, setFilterExam] = useState(selectedExam ? selectedExam.name : '');
  const [filterSubject, setFilterSubject] = useState(selectedSubject ? selectedSubject.name : '');

  useEffect(() => {
    if (preloadedTopic) {
      setFilterTopic(preloadedTopic);
    }
  }, [preloadedTopic]);

  useEffect(() => {
    setFilterExam(selectedExam ? selectedExam.name : '');
    setFilterSubject(selectedSubject ? selectedSubject.name : '');
  }, [selectedExam, selectedSubject]);
  
  // Bookmark state
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState([]);

  // User interactive answer choice tracking
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { pyqId: optionText }
  const [revealedExplanations, setRevealedExplanations] = useState({}); // { pyqId: bool }

  // Form state for adding custom PYQ
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPyq, setNewPyq] = useState({
    exam: selectedExam ? selectedExam.name : '',
    subject: selectedSubject ? selectedSubject.name : '',
    topic: '',
    year: new Date().getFullYear(),
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: ''
  });
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    fetchPyqs();
  }, [filterExam, filterSubject, showBookmarksOnly, currentUser]);

  useEffect(() => {
    if (currentUser) {
      setUserBookmarks(currentUser.savedPyqs || []);
    } else {
      setUserBookmarks([]);
      setShowBookmarksOnly(false);
    }
  }, [currentUser]);

  const fetchPyqs = async () => {
    try {
      setLoading(true);
      
      if (showBookmarksOnly && currentUser) {
        const res = await axios.get('/api/auth/bookmarks', {
          params: { userId: currentUser._id }
        });
        setPyqs(res.data);
      } else {
        const params = {};
        if (filterExam) params.exam = filterExam;
        if (filterSubject) params.subject = filterSubject;
        
        const res = await axios.get('/api/pyqs', { params });
        setPyqs(res.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching PYQs:", err);
      setLoading(false);
    }
  };

  const handleSelectOption = (pyqId, optionText, correctAnswer) => {
    if (selectedAnswers[pyqId]) return; // Answer locked
    setSelectedAnswers(prev => ({ ...prev, [pyqId]: optionText }));
    setRevealedExplanations(prev => ({ ...prev, [pyqId]: true }));
  };

  const handleToggleBookmark = async (pyqId) => {
    if (!currentUser) {
      onLoginRequired();
      return;
    }

    try {
      const res = await axios.post('/api/auth/save-pyq', {
        userId: currentUser._id,
        pyqId
      });
      setUserBookmarks(res.data.savedPyqs);
      
      // Update local storage
      const updatedUser = { ...currentUser, savedPyqs: res.data.savedPyqs };
      localStorage.setItem('questiq_user', JSON.stringify(updatedUser));
      
      // If filter active, remove item locally
      if (showBookmarksOnly) {
        setPyqs(prev => prev.filter(q => q._id !== pyqId));
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const handleCreatePyq = async (e) => {
    e.preventDefault();
    if (!newPyq.exam || !newPyq.subject || !newPyq.question || !newPyq.correctAnswer) {
      alert("Please fill in all mandatory fields.");
      return;
    }
    try {
      const res = await axios.post('/api/pyqs', newPyq);
      setPyqs(prev => [res.data, ...prev]);
      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setShowAddForm(false);
        setNewPyq({
          exam: selectedExam ? selectedExam.name : '',
          subject: selectedSubject ? selectedSubject.name : '',
          topic: '',
          year: new Date().getFullYear(),
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: ''
        });
      }, 2000);
    } catch (err) {
      console.error("Error creating PYQ:", err);
      alert("Failed to submit question. Check backend connectivity.");
    }
  };

  // Filter local results based on Search Text, Year, and Topic
  const filteredPyqs = pyqs.filter(pyq => {
    const matchesSearch = pyq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pyq.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear ? pyq.year === Number(filterYear) : true;
    const matchesTopic = filterTopic ? pyq.topic.toLowerCase().includes(filterTopic.toLowerCase()) : true;
    return matchesSearch && matchesYear && matchesTopic;
  });

  // Extract unique topics and years for filter dropdowns
  const uniqueYears = [...new Set(pyqs.map(p => p.year))].sort((a, b) => b - a);
  const uniqueTopics = [...new Set(pyqs.map(p => p.topic))].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Previous Year Questions</h1>
          <p className="text-sm text-slate-400">Review, practice, and test your understanding with actual exam questions.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Contribute PYQ</span>
        </button>
      </div>

      {/* Add Custom PYQ Modal/Form */}
      {showAddForm && (
        <div className="glass-panel p-6 rounded-2xl border-violet-500/20 max-w-2xl">
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-violet-400" />
            <span>Add Previous Year Question</span>
          </h2>
          {formSuccess ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-emerald-300">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400 animate-bounce" />
              <span>Thank you! Question added successfully.</span>
            </div>
          ) : (
            <form onSubmit={handleCreatePyq} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Exam *</label>
                  <input 
                    type="text" 
                    value={newPyq.exam} 
                    onChange={e => setNewPyq({...newPyq, exam: e.target.value})}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2 mt-1 text-sm text-white"
                    placeholder="e.g. UPSC Civil Services"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Subject *</label>
                  <input 
                    type="text" 
                    value={newPyq.subject} 
                    onChange={e => setNewPyq({...newPyq, subject: e.target.value})}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2 mt-1 text-sm text-white"
                    placeholder="e.g. History"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Chapter/Topic</label>
                  <input 
                    type="text" 
                    value={newPyq.topic} 
                    onChange={e => setNewPyq({...newPyq, topic: e.target.value})}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2 mt-1 text-sm text-white"
                    placeholder="e.g. Modern India"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Year</label>
                  <input 
                    type="number" 
                    value={newPyq.year} 
                    onChange={e => setNewPyq({...newPyq, year: Number(e.target.value)})}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2 mt-1 text-sm text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Question Statement *</label>
                <textarea 
                  value={newPyq.question} 
                  onChange={e => setNewPyq({...newPyq, question: e.target.value})}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2 mt-1 text-sm text-white h-20"
                  placeholder="Enter the full question text here..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Multiple Choice Options (4 options) *</label>
                {newPyq.options.map((opt, i) => (
                  <input 
                    key={i}
                    type="text" 
                    value={opt} 
                    onChange={e => {
                      const updatedOpts = [...newPyq.options];
                      updatedOpts[i] = e.target.value;
                      setNewPyq({...newPyq, options: updatedOpts});
                    }}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-sm text-white"
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    required
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Correct Answer *</label>
                  <select 
                    value={newPyq.correctAnswer} 
                    onChange={e => setNewPyq({...newPyq, correctAnswer: e.target.value})}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2 mt-1 text-sm text-white"
                    required
                  >
                    <option value="">Select correct option</option>
                    {newPyq.options.map((opt, i) => opt ? (
                      <option key={i} value={opt}>{`Option ${String.fromCharCode(65 + i)}: ${opt.substring(0, 30)}...`}</option>
                    ) : null)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Explanation & References</label>
                  <input 
                    type="text" 
                    value={newPyq.explanation} 
                    onChange={e => setNewPyq({...newPyq, explanation: e.target.value})}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2 mt-1 text-sm text-white"
                    placeholder="e.g. Under Article 21, SC ruled..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold"
                >
                  Save Question
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Filter Controls Panel */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search keywords or topics..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Bookmarks Toggle filter */}
        {currentUser && (
          <label className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={showBookmarksOnly} 
              onChange={e => setShowBookmarksOnly(e.target.checked)}
              className="accent-violet-500 rounded cursor-pointer"
            />
            <span className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>Saved Bookmarks</span>
            </span>
          </label>
        )}

        {/* Year Filter */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
            className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="">All Years</option>
            {uniqueYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Topic Filter */}
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <select
            value={filterTopic}
            onChange={e => setFilterTopic(e.target.value)}
            className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="">All Chapters</option>
            {filterTopic && !uniqueTopics.includes(filterTopic) && (
              <option value={filterTopic}>{filterTopic}</option>
            )}
            {uniqueTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Question Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredPyqs.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border-dashed border-slate-800">
          <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No Questions Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {showBookmarksOnly 
              ? "You haven't saved any questions yet! Star a question card to save it."
              : `No questions found for ${filterExam || 'this exam'} - ${filterSubject || 'this subject'}${filterTopic ? ` (${filterTopic})` : ''}. Try clearing your filters or contribute a question!`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPyqs.map((pyq, qIdx) => {
            const isAnswered = !!selectedAnswers[pyq._id];
            const userAnswer = selectedAnswers[pyq._id];
            const isCorrect = userAnswer === pyq.correctAnswer;
            const explanationRevealed = revealedExplanations[pyq._id];
            const isBookmarked = userBookmarks.includes(pyq._id);

            return (
              <div 
                key={pyq._id}
                className="glass-panel p-6 rounded-2xl border-slate-800/80 hover:border-slate-700/60 transition-all duration-300 relative overflow-hidden"
              >
                {/* Meta details */}
                <div className="flex flex-wrap gap-2 items-center justify-between text-xs text-slate-400 mb-4 pb-2 border-b border-slate-800/50">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-semibold text-slate-300">
                      {pyq.exam}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                      {pyq.subject}
                    </span>
                    <span className="text-violet-400 font-medium">
                      {pyq.topic}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-cyan-400">Year {pyq.year}</span>
                    {/* Star Toggle Bookmark */}
                    <button
                      onClick={() => handleToggleBookmark(pyq._id)}
                      className="p-1 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-yellow-400"
                      title={isBookmarked ? 'Remove Bookmark' : 'Save Question'}
                    >
                      <Star className={`w-4 h-4 ${isBookmarked ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold leading-relaxed text-slate-100">
                    <span className="text-violet-400 mr-2">Q.</span>
                    {pyq.question}
                  </h3>

                  {/* MCQ Options List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {pyq.options.map((opt, oIdx) => {
                      const optLabel = String.fromCharCode(65 + oIdx);
                      const isSelectedOpt = userAnswer === opt;
                      const isCorrectOpt = opt === pyq.correctAnswer;
                      
                      let optStyle = "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 text-slate-300";
                      
                      if (isAnswered) {
                        if (isCorrectOpt) {
                          optStyle = "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-medium";
                        } else if (isSelectedOpt && !isCorrect) {
                          optStyle = "bg-red-500/10 border-red-500/40 text-red-300 font-medium";
                        } else {
                          optStyle = "bg-slate-900/20 border-slate-900 text-slate-500 cursor-not-allowed";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(pyq._id, opt, pyq.correctAnswer)}
                          className={`flex items-start p-4 rounded-xl text-left border text-sm transition-all duration-200 cursor-pointer ${optStyle}`}
                        >
                          <span className="font-bold mr-3 text-violet-400">{optLabel}.</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Status Indicator & Explanation Reveal */}
                  {isAnswered && (
                    <div className="mt-4 p-4 rounded-xl border transition-all duration-300 bg-slate-950/60 border-slate-800">
                      <div className="flex items-center space-x-2 text-sm mb-3">
                        {isCorrect ? (
                          <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Correct Answer!</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1.5 text-red-400 font-semibold">
                            <AlertCircle className="w-4 h-4" />
                            <span>Incorrect Answer</span>
                          </span>
                        )}
                        <span className="text-slate-500">•</span>
                        <button 
                          onClick={() => setRevealedExplanations(prev => ({ ...prev, [pyq._id]: !prev[pyq._id] }))}
                          className="text-violet-400 hover:text-violet-300 hover:underline font-medium"
                        >
                          {explanationRevealed ? 'Hide Explanation' : 'View Explanation'}
                        </button>
                      </div>

                      {explanationRevealed && pyq.explanation && (
                        <div className="mt-2 text-sm text-slate-300 pl-2 border-l-2 border-violet-500/40 space-y-1">
                          <p className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Explanation:</p>
                          <p className="leading-relaxed">{pyq.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
