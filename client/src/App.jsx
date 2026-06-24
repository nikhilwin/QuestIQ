import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  BarChart2, 
  Brain, 
  UploadCloud, 
  Calendar, 
  MessageSquare,
  Menu,
  X,
  Bell,
  User,
  HelpCircle,
  CheckCircle,
  Info
} from 'lucide-react';

// Import components
import Dashboard from './components/Dashboard';
import PyqRepository from './components/PyqRepository';
import TopicsAnalyzer from './components/TopicsAnalyzer';
import AiAssistant from './components/AiAssistant';
import IntelligenceEngine from './components/IntelligenceEngine';
import SmartRevision from './components/SmartRevision';
import Community from './components/Community';
import LoginModal from './components/LoginModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Shared Exam & Subject states
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Cross-component AI focus passing
  const [aiFocusTopic, setAiFocusTopic] = useState('');

  // Shared revision checklist progress
  const [completedRevisionTasks, setCompletedRevisionTasks] = useState({});

  // Notifications drawer state
  const [showNotifications, setShowNotifications] = useState(false);

  // Student Account Session States
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('questiq_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('questiq_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('questiq_user');
    setSelectedExam(null);
    setSelectedSubject(null);
    setAiFocusTopic('');
    setCompletedRevisionTasks({});
    setActiveTab('dashboard');
  };

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setSelectedSubject(null); // Reset subject on exam change
    setAiFocusTopic('');      // Reset topic
    setCompletedRevisionTasks({}); // Reset checklist progress
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setAiFocusTopic('');      // Reset topic when switching subjects
    setCompletedRevisionTasks({}); // Reset checklist progress
    setActiveTab('dashboard'); // keep on dashboard to view chapters
  };

  const handleSendToAiAssistant = (topic) => {
    setAiFocusTopic(topic);
    setActiveTab('ai-tutor'); // Switch view
  };

  const navItems = [
    { id: 'dashboard', label: 'Exam Dashboard', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'pyq-hub', label: 'PYQ Hub', icon: <Search className="w-5 h-5" /> },
    { id: 'analyzer', label: 'Weightage Analyzer', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'intelligence', label: 'Intelligence Engine', icon: <UploadCloud className="w-5 h-5 text-indigo-400" /> },
    { id: 'ai-tutor', label: 'AI Study Assistant', icon: <Brain className="w-5 h-5 text-violet-400" /> },
    { id: 'revision', label: '7-Day Planner', icon: <Calendar className="w-5 h-5" /> },
    { id: 'community', label: 'Discussion Board', icon: <MessageSquare className="w-5 h-5" /> }
  ];

  if (!currentUser) {
    return (
      <div className="flex h-screen w-screen bg-[#090d16] text-[#f1f5f9] items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient background details */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Brand logo */}
        <div className="absolute top-8 left-8 flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider text-white">Quest<span className="text-violet-400">IQ</span></span>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">PYQ AI Engine</p>
          </div>
        </div>

        <LoginModal 
          isOpen={true}
          onClose={() => {}}
          onAuthSuccess={handleAuthSuccess}
          hideClose={true}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#090d16] text-[#f1f5f9] overflow-hidden">
      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-[#0c111e] shrink-0">
        {/* Brand Logo */}
        <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3 relative overflow-hidden">
          <div className="absolute -left-10 -top-10 w-24 h-24 bg-violet-600/10 rounded-full blur-xl"></div>
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-lg shadow-violet-900/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider text-white">Quest<span className="text-violet-400">IQ</span></span>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">PYQ AI Engine</p>
          </div>
        </div>

        {/* Navigation Deck */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-violet-600/10 text-violet-300 border-l-4 border-violet-500 shadow-md shadow-violet-950/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Daily Prep Target Progress */}
        {selectedSubject && (() => {
          const completedCount = Object.values(completedRevisionTasks).filter(Boolean).length;
          const progressPercent = Math.round((completedCount / 7) * 100);
          return (
            <div className="mx-4 mb-4 p-4 glass-panel rounded-2xl border-slate-800/80 space-y-3 relative overflow-hidden animate-soft-glow">
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-violet-500/10 rounded-full blur-xl"></div>
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                  {/* SVG Progress Ring */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      className="stroke-slate-800 stroke-[3] fill-none"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      className="stroke-violet-500 stroke-[3] fill-none transition-all duration-500"
                      strokeDasharray={`${2 * Math.PI * 16}`}
                      strokeDashoffset={`${2 * Math.PI * 16 * (1 - progressPercent / 100)}`}
                    />
                  </svg>
                  <span className="absolute text-[9px] font-extrabold text-violet-300">{progressPercent}%</span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-extrabold text-slate-200">Daily Study Target</p>
                  <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider truncate">{selectedSubject.name}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0a0e1a]/80">
          {currentUser ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-violet-600/30 flex items-center justify-center border border-violet-500/25 text-xs font-bold text-violet-300">
                  {currentUser.username[0].toUpperCase()}
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-xs font-bold text-slate-200 truncate">{currentUser.username}</p>
                  <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-center py-2 bg-slate-900 border border-slate-850 hover:border-red-500/30 hover:bg-red-500/5 text-slate-400 hover:text-red-400 rounded-xl text-[10px] font-bold uppercase transition-all duration-250 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="w-full text-center py-3 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-950/20 cursor-pointer"
            >
              Log In / Register
            </button>
          )}
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/60 backdrop-blur-sm">
          <aside className="w-64 bg-[#0c111e] h-full flex flex-col border-r border-slate-800 shadow-2xl animate-slide-in">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-violet-400" />
                <span className="font-bold text-white">QuestIQ</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left text-sm font-semibold cursor-pointer ${
                      isActive 
                        ? 'bg-violet-600/10 text-violet-300 border-l-4 border-violet-500' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Toolbar Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0a0e1a]/60 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-40">
          <div className="flex items-center space-x-4">
            {/* Hamburger for mobile */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Global Context Indicators */}
            <div className="hidden md:flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Active Prep:</span>
              {selectedExam ? (
                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded font-semibold">
                    {selectedExam.name}
                  </span>
                  {selectedSubject && (
                    <>
                      <span className="text-slate-600">/</span>
                      <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded font-semibold">
                        {selectedSubject.name}
                      </span>
                    </>
                  )}
                  {aiFocusTopic && (
                    <>
                      <span className="text-slate-600">/</span>
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded font-semibold">
                        {aiFocusTopic}
                      </span>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedExam(null);
                      setSelectedSubject(null);
                      setAiFocusTopic('');
                      setActiveTab('dashboard');
                    }}
                    className="text-[10px] text-slate-500 hover:text-red-400 hover:underline pl-1"
                  >
                    Clear Filter
                  </button>
                </div>
              ) : (
                <span className="text-slate-400 italic">No exam selected (browse Dashboard)</span>
              )}
            </div>

            {/* AI Tip of the Day Ticker */}
            <div className="hidden xl:flex items-center space-x-2 bg-slate-950/40 border border-slate-900 px-3 py-1 rounded-full text-[10px] text-slate-450 max-w-xs md:max-w-md overflow-hidden relative group">
              <span className="font-extrabold text-[9px] text-violet-400 uppercase tracking-widest bg-violet-500/10 px-2 py-0.5 rounded-full shrink-0 border border-violet-500/20">
                AI Prep Tip
              </span>
              <div className="inline-block whitespace-nowrap animate-marquee">
                <span className="font-medium">
                  {selectedSubject?.name === 'Polity' 
                    ? "Study Article 32 & landmark writ cases. History: focus on timelines of Indian National Movement."
                    : selectedSubject?.name === 'Physics'
                      ? "Derive rotation rolling constraints; Mechanics marks yield highest exam returns."
                      : "Consistency beats intensity. Practice 5 PYQs daily to align with actual paper patterns."}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Notifications / User Profile) */}
          <div className="flex items-center space-x-4 relative">
            {!currentUser && (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md shadow-violet-950/20"
              >
                Sign In
              </button>
            )}

            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900/60 rounded-xl transition-all cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full border border-[#0a0e1a]"></span>
            </button>

            {/* Notification Drawer (Simple popup) */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 glass-panel p-4 rounded-2xl shadow-xl space-y-3 z-50 border-slate-700/60">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] text-slate-500 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-200">DB Seeding Complete</p>
                      <p className="text-[10px] text-slate-500">Sample exams & PYQs configured.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-200">AI Tutor Ready</p>
                      <p className="text-[10px] text-slate-500">Gemini 2.5 Flash initialized successfully.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="p-1.5 bg-slate-800/80 rounded-lg border border-slate-700/50">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* View Workspace Portal Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div key={activeTab} className="animate-page-slide-up space-y-6">
            {activeTab === 'dashboard' && (
              <Dashboard 
                onSelectExam={handleSelectExam}
                onSelectSubject={handleSelectSubject}
                selectedExam={selectedExam}
                selectedSubject={selectedSubject}
                onSendToAiAssistant={handleSendToAiAssistant}
                onSelectTopic={setAiFocusTopic}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'pyq-hub' && (
              <PyqRepository 
                selectedExam={selectedExam}
                selectedSubject={selectedSubject}
                currentUser={currentUser}
                onLoginRequired={() => setIsLoginOpen(true)}
                preloadedTopic={aiFocusTopic}
              />
            )}

            {activeTab === 'analyzer' && (
              <TopicsAnalyzer 
                selectedExam={selectedExam}
                selectedSubject={selectedSubject}
                preloadedTopic={aiFocusTopic}
              />
            )}

            {activeTab === 'intelligence' && (
              <IntelligenceEngine 
                selectedExam={selectedExam}
                selectedSubject={selectedSubject}
                onSendToAiAssistant={handleSendToAiAssistant}
              />
            )}

            {activeTab === 'ai-tutor' && (
              <AiAssistant 
                preloadedTopic={aiFocusTopic}
                selectedExam={selectedExam}
                selectedSubject={selectedSubject}
              />
            )}

            {activeTab === 'revision' && (
              <SmartRevision 
                selectedSubject={selectedSubject}
                preloadedTopic={aiFocusTopic}
                completedTasks={completedRevisionTasks}
                setCompletedTasks={setCompletedRevisionTasks}
              />
            )}

            {activeTab === 'community' && (
              <Community />
            )}
          </div>
        </div>
      </main>

      {/* Login overlay modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
