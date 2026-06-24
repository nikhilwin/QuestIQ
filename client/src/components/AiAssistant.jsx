import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Sparkles, BookOpen, FileText, CheckSquare, Brain, Trash2, ArrowRight } from 'lucide-react';

export default function AiAssistant({ preloadedTopic, selectedExam, selectedSubject }) {
  const [topic, setTopic] = useState(preloadedTopic || '');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'tutor', text: 'Hello! I am your QuestIQ AI Study Assistant. Select a chapter/topic, then click one of the quick actions below to generate revision notes, explanations, or interactive mock questions.' }
  ]);
  
  // Right workspace panels: 'notes' | 'mcqs' | 'none'
  const [workspaceType, setWorkspaceType] = useState('none');
  const [notesContent, setNotesContent] = useState('');
  const [mcqList, setMcqList] = useState([]);
  
  // MCQ student practice states
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealedExplanations, setRevealedExplanations] = useState({});

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (preloadedTopic) {
      setTopic(preloadedTopic);
      // Proactively prompt user action in chat
      setChatHistory(prev => [
        ...prev,
        { sender: 'tutor', text: `I see you selected **"${preloadedTopic}"** from the Intelligence Engine. Select one of the quick actions below to begin studying this topic.` }
      ]);
    }
  }, [preloadedTopic]);

  useEffect(() => {
    // Scroll chat feed to bottom
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleAction = async (actionType) => {
    if (!topic.trim()) {
      alert("Please enter or select a topic/chapter first.");
      return;
    }

    setLoading(true);
    let apiEndpoint = '';
    let userMsgText = '';

    if (actionType === 'explain') {
      apiEndpoint = '/api/ai/explain';
      userMsgText = `Can you explain the topic: "${topic}"?`;
    } else if (actionType === 'notes') {
      apiEndpoint = '/api/ai/notes';
      userMsgText = `Generate structured revision notes for: "${topic}"`;
    } else if (actionType === 'mcqs') {
      apiEndpoint = '/api/ai/mcqs';
      userMsgText = `Generate practice MCQs for the topic: "${topic}"`;
    }

    // Append student message to feed
    setChatHistory(prev => [...prev, { sender: 'student', text: userMsgText }]);

    try {
      const res = await axios.post(apiEndpoint, {
        topic,
        subject: selectedSubject ? selectedSubject.name : '',
        exam: selectedExam ? selectedExam.name : ''
      });

      if (actionType === 'explain') {
        setChatHistory(prev => [
          ...prev, 
          { sender: 'tutor', text: res.data.explanation, isMarkdown: true }
        ]);
        setWorkspaceType('none');
      } else if (actionType === 'notes') {
        setNotesContent(res.data.notes);
        setWorkspaceType('notes');
        setChatHistory(prev => [
          ...prev,
          { sender: 'tutor', text: `I have compiled comprehensive study notes for **"${topic}"**. You can view and study them in the document viewer on the right side pane.` }
        ]);
      } else if (actionType === 'mcqs') {
        setMcqList(res.data.mcqs);
        setSelectedAnswers({});
        setRevealedExplanations({});
        setWorkspaceType('mcqs');
        setChatHistory(prev => [
          ...prev,
          { sender: 'tutor', text: `I have generated practice MCQs for **"${topic}"**. Solve them in the interactive practice sheet on the right to test your knowledge!` }
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [
        ...prev, 
        { sender: 'tutor', text: 'Sorry, I encountered an error running that request. Please verify that your Gemini API key is configured.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMcqOption = (mcqIdx, option) => {
    if (selectedAnswers[mcqIdx]) return; // lock selection
    setSelectedAnswers(prev => ({ ...prev, [mcqIdx]: option }));
    setRevealedExplanations(prev => ({ ...prev, [mcqIdx]: true }));
  };

  const clearChat = () => {
    setChatHistory([
      { sender: 'tutor', text: 'Hello! Ask me any study question or generate worksheets by choosing a topic.' }
    ]);
    setWorkspaceType('none');
    setNotesContent('');
    setMcqList([]);
  };

  return (
    <div className="space-y-6">
      {/* Search Focus Header */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[280px]">
          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Study Focus Topic</label>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Select or enter topic name (e.g. Fundamental Rights, Optics...)"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>
        
        {/* Preset Prompt Actions */}
        <div className="flex flex-wrap gap-2 pt-4 sm:pt-0">
          <button
            onClick={() => handleAction('explain')}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-violet-500 hover:bg-violet-950/20 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Explain Topic</span>
          </button>
          <button
            onClick={() => handleAction('notes')}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-violet-500 hover:bg-violet-950/20 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generate Notes</span>
          </button>
          <button
            onClick={() => handleAction('mcqs')}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-violet-500 hover:bg-violet-950/20 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Create MCQs</span>
          </button>
        </div>
      </div>

      {/* Main Dual Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Pane 1: Chat Feed */}
        <div className="glass-panel rounded-2xl flex flex-col h-[520px] overflow-hidden border-slate-800/80">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-violet-400" />
              <div>
                <h3 className="text-sm font-bold">AI Study Companion</h3>
                <p className="text-[10px] text-slate-500">
                  {selectedSubject ? `${selectedExam.name} • ${selectedSubject.name}` : 'General Tutor Mode'}
                </p>
              </div>
            </div>
            <button 
              onClick={clearChat} 
              className="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm scrollbar-thin">
            {chatHistory.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'student' 
                      ? 'bg-violet-600/25 border border-violet-500/25 text-violet-100 rounded-tr-none' 
                      : 'bg-slate-900/60 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.isMarkdown ? (
                    <div className="markdown-body space-y-2 whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Pane 2: Study Document Workspace */}
        <div className="glass-panel rounded-2xl h-[520px] overflow-hidden border-slate-800/80 flex flex-col">
          {workspaceType === 'none' ? (
            /* Idle workspace view */
            <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-slate-500">
              <BookOpen className="w-12 h-12 text-slate-800 mb-4" />
              <h3 className="text-base font-bold text-slate-400">Document Workspace</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                Click "Generate Notes" or "Create MCQs" above. The generated materials will load in this dashboard for structured reading.
              </p>
            </div>
          ) : workspaceType === 'notes' ? (
            /* Notes Reader View */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-900/20 flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>Interactive Study Notes</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">{topic}</span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto text-sm leading-relaxed text-slate-300 space-y-4 scrollbar-thin select-text">
                {/* Notes Markdown Display */}
                <div className="whitespace-pre-wrap whitespace-pre-line prose prose-invert">
                  {notesContent}
                </div>
              </div>
            </div>
          ) : (
            /* Interactive MCQs Practice Sheet */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-900/20 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                  <CheckSquare className="w-4 h-4" />
                  <span>AI Practice Sheet</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">{topic}</span>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-6 scrollbar-thin">
                {mcqList.map((mcq, mIdx) => {
                  const userAnswer = selectedAnswers[mIdx];
                  const isLocked = !!userAnswer;
                  const isAnswerCorrect = userAnswer === mcq.correctAnswer;
                  const explanationRevealed = revealedExplanations[mIdx];

                  return (
                    <div 
                      key={mIdx}
                      className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3"
                    >
                      <h4 className="text-sm font-semibold text-slate-200 leading-relaxed">
                        <span className="text-emerald-400 mr-1.5">{mIdx + 1}.</span>
                        {mcq.question}
                      </h4>

                      <div className="grid grid-cols-1 gap-2">
                        {mcq.options.map((opt, oIdx) => {
                          const isOptSelected = userAnswer === opt;
                          const isCorrectChoice = opt === mcq.correctAnswer;
                          
                          let btnStyle = "bg-slate-950/60 border-slate-900 hover:border-slate-800 text-slate-300";
                          
                          if (isLocked) {
                            if (isCorrectChoice) {
                              btnStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold";
                            } else if (isOptSelected && !isAnswerCorrect) {
                              btnStyle = "bg-red-500/10 border-red-500/30 text-red-400 font-semibold";
                            } else {
                              btnStyle = "bg-slate-950/20 border-slate-950 text-slate-600 cursor-not-allowed";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={isLocked}
                              onClick={() => handleSelectMcqOption(mIdx, opt)}
                              className={`w-full flex items-center p-3 rounded-lg text-left border text-xs transition-colors cursor-pointer ${btnStyle}`}
                            >
                              <span className="font-bold mr-2 text-violet-400">{String.fromCharCode(65 + oIdx)}.</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {isLocked && mcq.explanation && (
                        <div className="p-3 bg-slate-950/50 rounded-lg text-xs border border-slate-900 leading-relaxed text-slate-400 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className={isAnswerCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                              {isAnswerCorrect ? 'Correct!' : 'Incorrect'}
                            </span>
                            <button 
                              onClick={() => setRevealedExplanations(prev => ({ ...prev, [mIdx]: !prev[mIdx] }))}
                              className="text-violet-400 hover:underline"
                            >
                              {explanationRevealed ? 'Hide rationale' : 'View rationale'}
                            </button>
                          </div>
                          {explanationRevealed && (
                            <p className="mt-1 border-t border-slate-900/60 pt-1 font-medium">{mcq.explanation}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
