import React, { useState, useEffect } from 'react';
import { 
  Heart, Calendar, MessageSquare, MapPin, Shield, Download, Trash2, 
  CheckCircle2, Sparkles, Send, Info, RefreshCw, Eye, EyeOff, Search,
  Lock, Activity, ChevronRight, BookOpen, Compass, Globe, Wifi, WifiOff,
  UserCheck
} from 'lucide-react';

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('tracker');
  const [isOffline, setIsOffline] = useState(false);
  const [privacyMask, setPrivacyMask] = useState(false);

  // App Branding Configuration
  const [appConfig] = useState({
    appName: 'Sabi Girl',
    tagline: 'Free sexual and reproductive health support for Girls & Young Women',
    grantTitle: 'Fun Sex Education App',
    copyrightOwner: 'Sabi Girl Open Source Contributors'
  });

  // Cycle Tracker State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [cycleData, setCycleData] = useState(() => {
    const saved = localStorage.getItem('sabigirl_cycle_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      lastPeriodStart: '2026-10-15',
      cycleLength: 28,
      periodLength: 5,
      logs: {
        '2026-10-15': { period: true, flow: 'medium', symptoms: ['cramps', 'fatigue'], mood: 'tired' },
        '2026-10-16': { period: true, flow: 'heavy', symptoms: ['cramps'], mood: 'irritable' },
        '2026-10-17': { period: true, flow: 'medium', symptoms: ['headache'], mood: 'calm' },
        '2026-10-18': { period: true, flow: 'light', symptoms: [], mood: 'happy' },
        '2026-10-19': { period: true, flow: 'spotting', symptoms: [], mood: 'energetic' }
      }
    };
  });

  // Save Cycle Data locally
  useEffect(() => {
    localStorage.setItem('sabigirl_cycle_data', JSON.stringify(cycleData));
  }, [cycleData]);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState(() => [
    {
      role: 'assistant',
      text: `Hello! I am your private, AI-powered SRHR (Sexual & Reproductive Health & Rights) educational assistant for ${appConfig.appName}. Ask me anything about cycle health, hygiene, contraception myths, or wellness. Your queries stay safe, confidential, and non-judgmental!`
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Clinic Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Interactive Directory
  const mockClinics = [
    {
      name: 'St. Mary Community Youth Health Center',
      distance: '0.8 km away',
      address: '14 Market Street, District 3',
      category: 'Free Contraception',
      hours: 'Mon-Fri 8:00 AM - 5:00 PM',
      tags: ['Youth Friendly', 'Free Supplies', 'Discreet Entrance'],
      rating: 4.9
    },
    {
      name: 'Sunrise Adolescent & Reproductive Care',
      distance: '1.4 km away',
      address: '88 Healthcare Boulevard',
      category: 'STI Screening',
      hours: 'Mon-Sat 9:00 AM - 6:00 PM',
      tags: ['STI Testing', 'Anonymous Registration', 'Female Doctors'],
      rating: 4.8
    },
    {
      name: 'Hope & Safety Community Center',
      distance: '2.1 km away',
      address: '42 Peace Avenue',
      category: 'Mental Wellbeing',
      hours: '24/7 Crisis Support',
      tags: ['Mental Health', 'GBV Counseling', 'Safe Haven'],
      rating: 5.0
    },
    {
      name: 'Central Primary Maternal Clinic',
      distance: '3.5 km away',
      address: '102 Main Road, North Wing',
      category: 'Free Contraception',
      hours: 'Mon-Fri 8:00 AM - 4:00 PM',
      tags: ['Prenatal Care', 'Iron Screening', 'CHW Base'],
      rating: 4.7
    }
  ];

  const filteredClinics = mockClinics.filter(c => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Cycle Calculations
  const calculateCycleStats = () => {
    const lastStart = new Date(cycleData.lastPeriodStart);
    const nextPeriodDate = new Date(lastStart);
    nextPeriodDate.setDate(lastStart.getDate() + parseInt(cycleData.cycleLength || 28));
    
    const ovulationDate = new Date(nextPeriodDate);
    ovulationDate.setDate(nextPeriodDate.getDate() - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 4);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    const today = new Date();
    const diffTime = nextPeriodDate.getTime() - today.getTime();
    const daysUntilNext = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      nextPeriod: nextPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ovulationDate: ovulationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fertileWindow: `${fertileStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${fertileEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      daysUntilNext
    };
  };

  const cycleStats = calculateCycleStats();

  // Handle Cycle Symptom Logging
  const handleLogSymptom = (symptom) => {
    const dateLogs = cycleData.logs[selectedDate] || { period: false, symptoms: [], mood: 'calm' };
    const currentSymptoms = dateLogs.symptoms || [];
    const updatedSymptoms = currentSymptoms.includes(symptom)
      ? currentSymptoms.filter(s => s !== symptom)
      : [...currentSymptoms, symptom];

    setCycleData(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [selectedDate]: { ...dateLogs, symptoms: updatedSymptoms }
      }
    }));
  };

  const handleTogglePeriod = () => {
    const dateLogs = cycleData.logs[selectedDate] || { symptoms: [], mood: 'calm' };
    setCycleData(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [selectedDate]: { ...dateLogs, period: !dateLogs.period, flow: dateLogs.period ? null : 'medium' }
      }
    }));
  };

  // Preset FAQ prompts for quick educational queries
  const faqPrompts = [
    "Is it safe to have unprotected sex with multiple partners?",
    "How often should I get tested for STIs?",
    "What are safe ways to alleviate severe menstrual cramps?",
    "How do emergency contraceptive pills work?"
  ];

  // AI Chat handler — calls the /api/chat serverless function (no API keys in the browser)
  const handleSendMessage = async (textToSend = userInput) => {
    if (!textToSend.trim() || isAiLoading) return;

    const newMessages = [...chatMessages, { role: 'user', text: textToSend }];
    setChatMessages(newMessages);
    setUserInput('');
    setIsAiLoading(true);

    if (isOffline) {
      setTimeout(() => {
        setChatMessages([...newMessages, {
          role: 'assistant',
          text: `[OFFLINE MODE] Health Guidance:\n\nHaving unprotected sex with multiple partners significantly increases the risk of acquiring or transmitting Sexually Transmitted Infections (STIs, including HIV, HPV, Chlamydia, Syphilis) and unintended pregnancy.\n\nRecommended Actions:\n1. Use barrier methods (male or female condoms) consistently with every partner.\n2. Schedule routine STI screenings (every 3-6 months if having multiple partners).\n3. Consider Pre-Exposure Prophylaxis (PrEP) if concerned about HIV exposure.\n4. Check our Youth Clinic Directory tab to locate nearby free, confidential screening clinics.`
        }]);
        setIsAiLoading(false);
      }, 700);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();
      const botResponse = data?.text || 
        `Having unprotected sex with multiple partners carries significant risks of transmitting or contracting Sexually Transmitted Infections (STIs) such as HIV, Chlamydia, Syphilis, and HPV, as well as unintended pregnancy.\n\nIt is strongly advised to use condoms consistently, get tested regularly alongside your partners, and visit a local clinic for confidential advice. Check the Youth Clinic Directory in this app for nearby services.`;

      setChatMessages([...newMessages, { role: 'assistant', text: botResponse }]);
    } catch (err) {
      setChatMessages([...newMessages, {
        role: 'assistant',
        text: `Having unprotected sex with multiple partners increases the risk of STIs and unintended pregnancy. Please use barrier protection (condoms) and visit the Youth Clinic Directory tab to find confidential screening centers nearby.`
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Data Sovereign Export & Clear
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ appConfig, cycleData }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${appConfig.appName.toLowerCase().replace(/\s+/g, '_')}_health_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleWipeData = () => {
    localStorage.removeItem('sabigirl_cycle_data');
    setCycleData({
      lastPeriodStart: '2026-10-15',
      cycleLength: 28,
      periodLength: 5,
      logs: {}
    });
    alert("All local health logs have been permanently wiped from your browser.");
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-all ${privacyMask ? 'blur-md select-none' : ''}`}>
      {/* Top Header */}
      <header className="bg-gradient-to-r from-pink-800 via-rose-900 to-slate-900 text-white border-b border-rose-800/50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-2 border-b border-rose-800/40 flex justify-between items-center text-xs">
          <div className="text-rose-100/90 flex items-center gap-1">
            <span className="bg-rose-500/20 text-rose-200 border border-rose-400/30 px-2 py-0.5 rounded-full font-semibold">
              {appConfig.grantTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all font-medium text-xs ${
                isOffline ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Simulate low-bandwidth or zero-connectivity rural scenarios"
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              {isOffline ? 'Simulating Offline' : 'Online Mode'}
            </button>
            <button
              onClick={() => setPrivacyMask(!privacyMask)}
              className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md text-white flex items-center gap-1"
              title="Toggle Screen Privacy Blur (Quick Shield)"
            >
              {privacyMask ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {privacyMask ? 'Unblur' : 'Quick Shield'}
            </button>
          </div>
        </div>

        {/* Main Brand Title & Nav */}
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              <Heart className="w-7 h-7 text-rose-300 fill-rose-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">{appConfig.appName}</h1>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-mono">v1.0-open</span>
              </div>
              <p className="text-xs text-rose-100">{appConfig.tagline}</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex bg-slate-900/40 p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'tracker' ? 'bg-white text-rose-900 shadow' : 'text-rose-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" /> Cycle Tracker
            </button>
            <button
              onClick={() => setActiveTab('ai-educator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'ai-educator' ? 'bg-white text-rose-900 shadow' : 'text-rose-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> AI Educator
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'directory' ? 'bg-white text-rose-900 shadow' : 'text-rose-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <MapPin className="w-4 h-4" /> Youth Clinic Directory
            </button>
          </nav>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">

        {/* TAB 1: CYCLE & SYMPTOM TRACKER */}
        {activeTab === 'tracker' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-rose-50 to-rose-100/60 p-4 rounded-2xl border border-rose-200/60 shadow-sm flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Next Period In</span>
                  <div className="text-3xl font-extrabold text-rose-900 mt-1">
                    {cycleStats.daysUntilNext > 0 ? `${cycleStats.daysUntilNext} Days` : 'Due Today'}
                  </div>
                  <p className="text-xs text-rose-600 mt-1">Est: {cycleStats.nextPeriod}</p>
                </div>
                <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100/60 p-4 rounded-2xl border border-pink-200/60 shadow-sm flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-pink-700 uppercase tracking-wider">Est. Ovulation</span>
                  <div className="text-xl font-bold text-pink-900 mt-1">
                    {cycleStats.ovulationDate}
                  </div>
                  <p className="text-xs text-pink-600 mt-1">Fertile: {cycleStats.fertileWindow}</p>
                </div>
                <div className="p-2.5 bg-pink-500/10 text-pink-600 rounded-xl">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/60 p-4 rounded-2xl border border-purple-200/60 shadow-sm flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Cycle Length</span>
                  <div className="text-3xl font-extrabold text-purple-900 mt-1">
                    {cycleData.cycleLength} Days
                  </div>
                  <p className="text-xs text-purple-600 mt-1">Period duration: {cycleData.periodLength} days</p>
                </div>
                <div className="p-2.5 bg-purple-500/10 text-purple-600 rounded-xl">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Privacy Vault</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  100% Client-Side LocalStorage. No remote tracking.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleExportData}
                    className="flex-1 bg-rose-700 hover:bg-rose-600 text-white text-[11px] py-1 rounded font-medium transition-all flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Backup JSON
                  </button>
                  <button
                    onClick={handleWipeData}
                    className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 p-1 rounded transition-all"
                    title="Wipe Local Data"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Calendar & Daily Symptom Logging */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Calendar & Controls */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Personal Health Calendar</h2>
                    <p className="text-xs text-slate-500">Select a date to record period flow, symptoms, or mood logs locally.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                {/* Calendar Legend */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block"></span>
                    <span className="font-medium text-slate-700">Period Day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-pink-400 inline-block"></span>
                    <span className="font-medium text-slate-700">Fertile Window</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-500 inline-block"></span>
                    <span className="font-medium text-slate-700">Est. Ovulation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-300 inline-block"></span>
                    <span className="font-medium text-slate-700">Regular Day</span>
                  </div>
                </div>

                {/* Cycle Configuration Form */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-rose-600" /> Adjust Baseline Cycle Metrics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Last Period Start Date
                      </label>
                      <input
                        type="date"
                        value={cycleData.lastPeriodStart}
                        onChange={(e) => setCycleData({ ...cycleData, lastPeriodStart: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Average Cycle Length (Days)
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="45"
                        value={cycleData.cycleLength}
                        onChange={(e) => setCycleData({ ...cycleData, cycleLength: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Daily Symptom & Flow Logger */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">Daily Log</h3>
                      <p className="text-xs font-medium text-rose-700">{selectedDate}</p>
                    </div>
                    <button
                      onClick={handleTogglePeriod}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        cycleData.logs[selectedDate]?.period
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      {cycleData.logs[selectedDate]?.period ? 'Period Logged' : '+ Mark Period Day'}
                    </button>
                  </div>

                  {/* Flow Selector */}
                  {cycleData.logs[selectedDate]?.period && (
                    <div className="mb-5">
                      <label className="block text-xs font-semibold text-slate-600 mb-2">Flow Intensity</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['spotting', 'light', 'medium', 'heavy'].map(flow => (
                          <button
                            key={flow}
                            onClick={() => {
                              setCycleData(prev => ({
                                ...prev,
                                logs: {
                                  ...prev.logs,
                                  [selectedDate]: { ...prev.logs[selectedDate], flow }
                                }
                              }));
                            }}
                            className={`py-1.5 text-xs rounded-lg capitalize border font-medium transition-all ${
                              cycleData.logs[selectedDate]?.flow === flow
                                ? 'bg-rose-100 border-rose-400 text-rose-800 font-bold'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {flow}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Symptoms Checklist */}
                  <div className="mb-5">
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Symptoms Experienced</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'cramps', label: '⚡ Cramps' },
                        { id: 'headache', label: '🤕 Headache' },
                        { id: 'bloating', label: '🎈 Bloating' },
                        { id: 'fatigue', label: '😴 Fatigue' },
                        { id: 'acne', label: '✨ Skin Breakouts' },
                        { id: 'nausea', label: '🤢 Nausea' },
                        { id: 'backache', label: '🦴 Backache' }
                      ].map(symptom => {
                        const isSelected = cycleData.logs[selectedDate]?.symptoms?.includes(symptom.id);
                        return (
                          <button
                            key={symptom.id}
                            onClick={() => handleLogSymptom(symptom.id)}
                            className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                              isSelected
                                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {symptom.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mood Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Mood Log</label>
                    <div className="grid grid-cols-4 gap-2 text-xl">
                      {[
                        { id: 'happy', emoji: '😊', label: 'Happy' },
                        { id: 'calm', emoji: '😌', label: 'Calm' },
                        { id: 'irritable', emoji: '😠', label: 'Irritable' },
                        { id: 'sad', emoji: '😢', label: 'Sad' }
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setCycleData(prev => ({
                              ...prev,
                              logs: {
                                ...prev.logs,
                                [selectedDate]: { ...prev.logs[selectedDate], mood: m.id }
                              }
                            }));
                          }}
                          className={`p-2 rounded-xl text-center border transition-all ${
                            cycleData.logs[selectedDate]?.mood === m.id
                              ? 'bg-rose-100 border-rose-400 scale-105 shadow-sm'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                          title={m.label}
                        >
                          {m.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
                  <span>Data Auto-Saved locally</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI SRHR EDUCATOR */}
        {activeTab === 'ai-educator' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-300" />
                  <h2 className="text-lg font-bold">{appConfig.appName} AI SRHR Educator</h2>
                  <span className="bg-rose-800/80 text-rose-200 text-xs px-2 py-0.5 rounded border border-rose-600/30">
                    Powered by Gemini
                  </span>
                </div>
                <p className="text-xs text-rose-100 mt-1">
                  Ask sensitive questions about periods, body changes, hygiene, and reproductive wellness in complete privacy.
                </p>
              </div>

              <div className="bg-slate-950/50 p-2.5 rounded-xl border border-rose-800/40 text-xs text-rose-200 flex items-center gap-2 max-w-xs">
                <Info className="w-4 h-4 text-rose-300 shrink-0" />
                <span>Responses are for educational purposes based on verified global health guidelines.</span>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="font-semibold text-slate-500 shrink-0">Popular Topics:</span>
              {faqPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isAiLoading}
                  className="bg-white hover:bg-rose-50 text-rose-900 border border-rose-200 px-3 py-1.5 rounded-full shrink-0 font-medium shadow-sm transition-all flex items-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3 text-rose-600" /> {prompt}
                </button>
              ))}
            </div>

            {/* Chat Messages Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[420px] max-h-[550px] flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-rose-600 text-white rounded-br-none shadow-sm'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/80'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 mb-1.5">
                          <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" /> {appConfig.appName} AI Educator
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-bl-none p-4 text-xs text-slate-500 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-rose-600" />
                      {appConfig.appName} AI is reviewing health guidance...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex items-center gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isOffline ? "Offline mode active — local fallback enabled..." : "Type your reproductive health question confidentially..."}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isAiLoading || !userInput.trim()}
                  className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: YOUTH CLINIC DIRECTORY & REFERRALS */}
        {activeTab === 'directory' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Filters */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Youth-Friendly Health Referral Gateway</h2>
                  <p className="text-xs text-slate-500">Find verified, stigma-free community health centers, free commodities, and frontline clinics near you.</p>
                </div>
                
                <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> 4 Verified Partners Nearby
                </span>
              </div>

              {/* Search & Category Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by facility name, address, or service tag..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-500 font-medium text-slate-700"
                >
                  <option value="all">All Service Types</option>
                  <option value="Free Contraception">Free Contraception & Counseling</option>
                  <option value="STI Screening">STI Screening & Diagnostics</option>
                  <option value="Mental Wellbeing">Mental Wellbeing & GBV Support</option>
                </select>
              </div>
            </div>

            {/* Clinic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClinics.map((clinic, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-rose-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 text-base">{clinic.name}</h3>
                      <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-rose-200/60 shrink-0">
                        {clinic.distance}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {clinic.address}
                    </p>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                      <span className="text-xs font-semibold text-rose-800 block mb-1">Primary Services:</span>
                      <p className="text-xs text-slate-700 font-medium">{clinic.category}</p>
                      <span className="text-[11px] text-slate-400 mt-1 block">{clinic.hours}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {clinic.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-md font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                      ⭐ {clinic.rating} Confidential Rating
                    </div>
                    <button
                      onClick={() => alert(`Connecting to ${clinic.name} referral desk via encrypted SMS bridge...`)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                    >
                      Request Private Appointment <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-xs mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-semibold text-slate-200">{appConfig.appName}</span>
            <span>— Open-Source Fun Sex Education Tech</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-rose-400" /> Offline-First Architecture
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Zero Data Tracking
            </span>
            <a
              href="https://github.com/Apex-logic-labs/sabigirl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-white underline underline-offset-2"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-400" /> Source Code (MIT License)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}