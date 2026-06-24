import React, { useState } from 'react';
import { Calendar, Target, CheckCircle2, ChevronDown, ChevronUp, Clock, BookOpen } from 'lucide-react';

export default function SmartRevision({ selectedSubject, preloadedTopic, completedTasks = {}, setCompletedTasks }) {
  // Pre-configured 7-Day Plans based on selected subject type
  const defaultPlan = [
    { day: "Day 1", task: "Review Core Concepts & Definitions", detail: "Read through main summaries, highlight edge exceptions, and memorize basic terms." },
    { day: "Day 2", task: "Practice 10 High-Weightage Numericals/Cases", detail: "Focus on standard models and solve step-by-step problem equations." },
    { day: "Day 3", task: "Compile Subject Formula Sheets/Timelines", detail: "Write down critical equations, historic acts, or cycles on a single cheat sheet." },
    { day: "Day 4", task: "Solve Chapter-wise PYQs (2018 - 2020)", detail: "Set a timer and solve 20-30 topic-specific historical questions." },
    { day: "Day 5", task: "Attempt Mock Revision Test Sheet", detail: "Grade your responses, identify weak modules, and read AI explanations for mistakes." },
    { day: "Day 6", task: "Solve Recent PYQs (2021 - 2023)", detail: "Audit structural repetition. Pinpoint questions expected to appear." },
    { day: "Day 7", task: "Light Active Recall & Final Formula Review", detail: "Quickly scan formula sheets, cover notes to test memory retention, and rest well." }
  ];

  const physicsPlan = [
    { day: "Day 1", task: "Rigid Body Dynamics & Mechanics Formulas", detail: "Review moment of inertia, rolling without slipping, and torque equations." },
    { day: "Day 2", task: "Electrostatics & Gauss Law Practice", detail: "Solve electric field boundaries and capacitor charge distributions." },
    { day: "Day 3", task: "Thermodynamics Carnot Cycle Calculations", detail: "Solve 5 problems on cycle efficiency and heat engine processes." },
    { day: "Day 4", task: "Modern Physics Transitions & photoelectric effect", detail: "Revise Bohr atomic transitions, work function, and de Broglie wavelengths." },
    { day: "Day 5", task: "Ray & Wave Optics Diagrams", detail: "Draw lens maker formula applications, double slit interference fringes." },
    { day: "Day 6", task: "Solve full-length physics PYQ set (2022-2023)", detail: "Time yourself for 3 hours, solving mechanics and magnetism segments first." },
    { day: "Day 7", task: "Formulas & Constants Quick Scan", detail: "Memorize permeability, permittivity, and basic unit dimensions." }
  ];

  const polityPlan = [
    { day: "Day 1", task: "Constitutional Amendments (1st to 105th)", detail: "Memorize 42nd, 44th, 86th, and 97th changes along with Article 368 guidelines." },
    { day: "Day 2", task: "Fundamental Rights & Writ Jurisdiction", detail: "Compare Habeas Corpus, Mandamus, Certiorari scope in Article 32 vs 226." },
    { day: "Day 3", task: "Executive Powers & Emergency Provisions", detail: "Review President's veto powers, ordinance routes, and Articles 352, 356, 360." },
    { day: "Day 4", task: "Panchayati Raj & Local Governments", detail: "Study 73rd and 74th amendments, 11th and 12th schedules, and state finance commission." },
    { day: "Day 5", task: "Judiciary Structure & Landmark Cases", detail: "Review Kesavananda, Keshav Singh, and Maneka Gandhi judgements." },
    { day: "Day 6", task: "Parliamentary Committees & Sessions", detail: "Study Public Accounts Committee, Estimates Committee, and legislative procedures." },
    { day: "Day 7", task: "Schedules & Constitutional Bodies Cheat Sheet", detail: "Quick review of CAG, Election Commission, UPSC terms, and schedules 5, 6, 10." }
  ];

  // Pick plan based on subject
  const currentPlan = selectedSubject?.name.toLowerCase() === 'physics' 
    ? physicsPlan 
    : selectedSubject?.name.toLowerCase() === 'polity'
      ? polityPlan
      : defaultPlan;

  // Track active particles for checkmark celebration
  const [activeParticles, setActiveParticles] = useState([]);
  
  // Track open accordions
  const [openQuestion, setOpenQuestion] = useState(null);

  // Model Expected Questions list
  const sampleExpectedQuestions = [
    {
      id: 1,
      subject: "Polity",
      question: "Critically evaluate the 'Basic Structure Doctrine' as a limit on the amending power of the Parliament under Article 368.",
      modelAnswer: "The Basic Structure Doctrine was established in the landmark Kesavananda Bharati case (1973). It posits that while Parliament has wide powers to amend the Constitution under Article 368, it cannot alter or destroy its essential features (like secularism, federalism, judicial review, and democracy). \n\nKey pillars to discuss in your answer:\n1. Origin: Overruled Golaknath case; reconciled judicial review with parliamentary sovereignty.\n2. Scope: High Court/Supreme Court determines what constitutes 'basic structure' on a case-by-case basis.\n3. Impact: Safeguards constitution from majoritarian amendments, maintaining federal balance and fundamental liberties."
    },
    {
      id: 2,
      subject: "Physics",
      question: "Explain the acceleration of a solid sphere of mass M and radius R rolling without slipping down an inclined plane of angle theta.",
      modelAnswer: "When a body rolls down an incline of angle theta without slipping, both translational and rotational motion occur. \n\nMathematical derivation:\n- Force equation: Mg sin(theta) - f = Ma (where f is static friction).\n- Torque equation: f * R = I * alpha = I * (a/R) (since rolling without slipping means alpha = a/R).\n- Substituting f: Mg sin(theta) - I * a/R^2 = Ma => a = g sin(theta) / (1 + I/MR^2).\n- For a solid sphere, I = (2/5)MR^2. Thus, a = g sin(theta) / (1 + 2/5) = (5/7)g sin(theta).\n- Hence, friction does no work, but is necessary to facilitate pure rolling."
    },
    {
      id: 3,
      subject: "History",
      question: "How did the trial of the Indian National Army (INA) officers at the Red Fort influence the nationalist struggle in 1945-46?",
      modelAnswer: "The public trial of INA officers (Shah Nawaz Khan, Prem Sahgal, Gurbaksh Dhillon) at Red Fort in late 1945 was a major turning point.\n\nHistorical implications:\n1. Mass Mobilization: Triggered demonstrations across diverse communities, uniting Hindus, Muslims, and Sikhs.\n2. Legal Defense: Major leaders (Bhulabhai Desai, Tej Bahadur Sapru, Nehru) formed the INA Defence Committee, raising political consciousness.\n3. Military Revolt: Contributed directly to the Royal Indian Navy (RIN) Mutiny in February 1946, making British control over armed forces untenable."
    },
    {
      id: 4,
      subject: "Biology",
      question: "Explain why the pyramid of energy is always upright, while the pyramid of biomass can be inverted in aquatic systems.",
      modelAnswer: "1. Pyramid of Energy: Follows Lindeman's 10% law of energy transfer. Only 10% of energy at a trophic level is transferred to the next level. Energy is lost as heat at each transfer, hence it can NEVER be inverted.\n2. Pyramid of Biomass: Represents the total dry weight of organisms. In aquatic systems (e.g. ocean), phytoplanktons (producers) have small biomass, but reproduce rapidly to support a larger biomass of zooplanktons and fishes (consumers). Thus, the standing crop biomass pyramid is inverted (bell-shaped)."
    }
  ];

  // Filter expected questions by selected subject
  const displayedQuestions = selectedSubject
    ? sampleExpectedQuestions.filter(q => q.subject.toLowerCase() === selectedSubject.name.toLowerCase())
    : sampleExpectedQuestions;

  const toggleTask = (idx, e) => {
    const isNowCompleted = !completedTasks[idx];
    if (setCompletedTasks) {
      setCompletedTasks(prev => ({ ...prev, [idx]: isNowCompleted }));
    }
    
    // Trigger particle explosion if checked
    if (isNowCompleted && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const parentRect = e.currentTarget.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
      const clickX = rect.left - parentRect.left + rect.width / 2;
      const clickY = rect.top - parentRect.top + rect.height / 2;
      
      const newParticles = Array.from({ length: 12 }).map((_, pIdx) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 40;
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;
        const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
        
        return {
          id: `${Date.now()}-${pIdx}-${Math.random()}`,
          x: clickX,
          y: clickY,
          targetX: `${targetX}px`,
          targetY: `${targetY}px`,
          color: colors[Math.floor(Math.random() * colors.length)]
        };
      });
      
      setActiveParticles(prev => [...prev, ...newParticles]);
      
      // Clean up particles
      setTimeout(() => {
        setActiveParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 800);
    }
  };

  const totalTasks = currentPlan.length;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 7-Day Revision Planner */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-violet-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Last 7 Days Revision Plan</h2>
              <p className="text-xs text-slate-400">
                Subject Focus: <span className="text-violet-400 font-semibold">{selectedSubject?.name || 'General Syllabus'}</span>
                {preloadedTopic && (
                  <>
                    {' • Topic Focus: '}
                    <span className="text-indigo-400 font-semibold">{preloadedTopic}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="space-y-1 text-right">
            <span className="text-xs text-slate-400">Progress: <strong className="text-white">{completedCount} of {totalTasks}</strong> completed</span>
            <div className="w-32 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-violet-600 to-cyan-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Timeline List */}
        <div className="space-y-4">
          {currentPlan.map((step, idx) => {
            const isCompleted = !!completedTasks[idx];
            return (
              <div 
                key={idx}
                className={`relative flex items-start space-x-4 p-4 rounded-2xl border transition-all duration-200 ${
                  isCompleted 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400' 
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/60'
                }`}
              >
                {/* Active Particles Explosion */}
                {activeParticles.map(p => (
                  <span
                    key={p.id}
                    className="absolute w-1.5 h-1.5 rounded-full pointer-events-none animate-particle z-50"
                    style={{
                      left: p.x,
                      top: p.y,
                      backgroundColor: p.color,
                      '--x': p.targetX,
                      '--y': p.targetY
                    }}
                  />
                ))}

                {/* Custom Checkbox */}
                <button 
                  onClick={(e) => toggleTask(idx, e)}
                  className={`mt-1 flex items-center justify-center w-5 h-5 rounded border transition-all cursor-pointer ${
                    isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-600 hover:border-violet-500'
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />}
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      isCompleted 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {step.day}
                    </span>
                    <h3 className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {step.task}
                    </h3>
                  </div>
                  <p className={`text-xs leading-relaxed ${isCompleted ? 'text-slate-500' : 'text-slate-400'}`}>
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expected Questions Sidebar Accordion */}
      <div className="lg:col-span-1 glass-panel p-6 rounded-3xl space-y-6 flex flex-col justify-start">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
          <Target className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-lg font-bold text-white">Most Expected Questions</h2>
            <p className="text-xs text-slate-400">High probability model questions.</p>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[400px] pr-1">
          {displayedQuestions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-700" />
              <p className="text-xs">No questions loaded for this subject. Select another subject from the dashboard.</p>
            </div>
          ) : (
            displayedQuestions.map((q) => {
              const isOpen = openQuestion === q.id;
              return (
                <div 
                  key={q.id}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden hover:border-slate-700/60 transition-colors"
                >
                  <button
                    onClick={() => setOpenQuestion(isOpen ? null : q.id)}
                    className="w-full flex items-start justify-between p-4 text-left cursor-pointer"
                  >
                    <div className="space-y-1.5 pr-2">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700/50 rounded text-[9px] uppercase tracking-wider font-semibold">
                        {q.subject}
                      </span>
                      <p className="text-xs font-semibold text-slate-200 leading-relaxed">{q.question}</p>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-300 space-y-2 leading-relaxed">
                      <div className="flex items-center space-x-1 text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Suggested Model Rationale</span>
                      </div>
                      <p className="whitespace-pre-wrap">{q.modelAnswer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
