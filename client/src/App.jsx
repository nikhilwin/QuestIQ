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
    setActiveTab('dashboard');
  };

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setSelectedSubject(null); // Reset subject on exam change
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
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
                  <button 
                    onClick={() => {
                      setSelectedExam(null);
                      setSelectedSubject(null);
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
          {activeTab === 'dashboard' && (
            <Dashboard 
              onSelectExam={handleSelectExam}
              onSelectSubject={handleSelectSubject}
              selectedExam={selectedExam}
              selectedSubject={selectedSubject}
            />
          )}

          {activeTab === 'pyq-hub' && (
            <PyqRepository 
              selectedExam={selectedExam}
              selectedSubject={selectedSubject}
              currentUser={currentUser}
              onLoginRequired={() => setIsLoginOpen(true)}
            />
          )}

          {activeTab === 'analyzer' && (
            <TopicsAnalyzer 
              selectedExam={selectedExam}
              selectedSubject={selectedSubject}
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
            />
          )}

          {activeTab === 'community' && (
            <Community />
          )}
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
