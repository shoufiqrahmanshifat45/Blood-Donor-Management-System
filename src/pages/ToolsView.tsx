import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Calculator,
  HeartPulse,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Check,
  X,
  Droplet,
} from 'lucide-react';
import {
  EMERGENCY_CONTACTS,
  ELIGIBILITY_GUIDELINES,
  EmergencyContact,
} from '../data/mockData';
import { FindDonorsView } from './FindDonorsView';
import { useNotification } from '../context/NotificationContext';

interface ToolsViewProps {
  defaultTab?: 'search' | 'bmi' | 'eligibility' | 'emergency';
  onNavigateTab?: (tab: string) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({
  defaultTab = 'search',
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'search' | 'bmi' | 'eligibility' | 'emergency'>(
    defaultTab
  );

  useEffect(() => {
    setActiveSubTab(defaultTab);
  }, [defaultTab]);

  // --- BMI Calculator State ---
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState<string>('65');
  const [heightCm, setHeightCm] = useState<string>('172');
  const [weightLbs, setWeightLbs] = useState<string>('145');
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('8');

  // --- Eligibility Self-Check State ---
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({
    age: null,
    weight: null,
    interval: null,
    well: null,
    tattoo: null,
    antibiotics: null,
  });

  // --- Emergency Filter ---
  const [selectedEmergencyCategory, setSelectedEmergencyCategory] = useState<string>('ALL');
  const [emergencySearch, setEmergencySearch] = useState('');

  const { success, info } = useNotification();

  // BMI Calculation Logic
  const calculateBMI = () => {
    let w = 0;
    let hMeters = 0;

    if (unitSystem === 'metric') {
      w = parseFloat(weightKg) || 0;
      hMeters = (parseFloat(heightCm) || 0) / 100;
    } else {
      w = (parseFloat(weightLbs) || 0) * 0.453592;
      const totalInches = (parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0);
      hMeters = totalInches * 0.0254;
    }

    if (w <= 0 || hMeters <= 0) return null;
    const bmiVal = w / (hMeters * hMeters);

    let category = '';
    let categoryColor = '';
    let donorAdvisory = '';
    let eligible = true;

    if (bmiVal < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-amber-500';
      donorAdvisory = 'Underweight donors may experience fatigue or faintness. A minimum weight of 45-50 kg is mandatory.';
      eligible = w >= 48;
    } else if (bmiVal < 25) {
      category = 'Normal Weight (Optimal)';
      categoryColor = 'text-emerald-500';
      donorAdvisory = 'Optimal range for regular whole blood donation. Ensure adequate hydration before donating.';
      eligible = true;
    } else if (bmiVal < 30) {
      category = 'Overweight';
      categoryColor = 'text-blue-500';
      donorAdvisory = 'Eligible to donate provided blood pressure and hemoglobin levels are within healthy clinical ranges.';
      eligible = true;
    } else {
      category = 'Obese';
      categoryColor = 'text-purple-500';
      donorAdvisory = 'Safe to donate if standard blood pressure (under 140/90) and pulse checks pass during pre-screening.';
      eligible = true;
    }

    return {
      bmi: bmiVal.toFixed(1),
      category,
      categoryColor,
      donorAdvisory,
      eligible,
      weightKgVal: w.toFixed(1),
    };
  };

  const bmiResult = calculateBMI();

  // Eligibility Evaluation
  const questions = [
    { id: 'age', text: 'Are you between 18 and 65 years old?', positive: true },
    { id: 'weight', text: 'Do you weigh at least 45 kg (99 lbs)?', positive: true },
    { id: 'interval', text: 'Has it been at least 3 months since your last donation (or first time)?', positive: true },
    { id: 'well', text: 'Are you feeling healthy and active today without fever, flu, or cough?', positive: true },
    { id: 'tattoo', text: 'Have you gotten any tattoo, body piercing, or dental surgery in the last 6 months?', positive: false },
    { id: 'antibiotics', text: 'Have you taken oral antibiotics in the last 7 days?', positive: false },
  ];

  const allAnswered = Object.values(answers).every((val) => val !== null);
  const isEligible =
    answers.age === true &&
    answers.weight === true &&
    answers.interval === true &&
    answers.well === true &&
    answers.tattoo === false &&
    answers.antibiotics === false;

  // Filter Emergency Contacts
  const emergencyCategories = ['ALL', 'National Emergency', 'Blood Bank', 'Hospital', 'Ambulance'];
  const filteredEmergencyContacts = EMERGENCY_CONTACTS.filter((c) => {
    if (selectedEmergencyCategory !== 'ALL' && c.category !== selectedEmergencyCategory) return false;
    if (emergencySearch.trim()) {
      const q = emergencySearch.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#ef4444]" />
            Medical & Coordination Tools
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Specialized utilities for blood group searching, donor BMI check, eligibility screening, and emergency dispatch.
          </p>
        </div>

        {/* 4 Tool Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'search'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Search Blood Group
          </button>

          <button
            onClick={() => setActiveSubTab('bmi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'bmi'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            BMI Calculator
          </button>

          <button
            onClick={() => setActiveSubTab('eligibility')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'eligibility'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            Eligibility Guide
          </button>

          <button
            onClick={() => setActiveSubTab('emergency')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'emergency'
                ? 'bg-[#ef4444] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Emergency Contacts
          </button>
        </div>
      </div>

      {/* Sub-View 1: Search Blood Group */}
      {activeSubTab === 'search' && (
        <div className="space-y-4">
          <FindDonorsView />
        </div>
      )}

      {/* Sub-View 2: BMI Calculator */}
      {activeSubTab === 'bmi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Form Side */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#ef4444]" />
                  Body Mass Index (BMI) Calculator
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Informational tool to evaluate donor eligibility and safe donation criteria.
                </p>
              </div>

              {/* Metric vs Imperial Toggle */}
              <div className="flex bg-slate-100 dark:bg-[#131d33] p-0.5 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setUnitSystem('metric')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    unitSystem === 'metric'
                      ? 'bg-white dark:bg-[#0c1527] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Metric (kg/cm)
                </button>
                <button
                  onClick={() => setUnitSystem('imperial')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    unitSystem === 'imperial'
                      ? 'bg-white dark:bg-[#0c1527] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Imperial (lbs/ft)
                </button>
              </div>
            </div>

            {/* Inputs */}
            {unitSystem === 'metric' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Body Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    min="30"
                    max="200"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                  <span className="text-[10.5px] text-slate-400 mt-0.5 block">
                    Minimum required donor weight: 45 kg (females) / 48 kg (males).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Height (centimeters)
                  </label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    min="100"
                    max="250"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Body Weight (pounds)
                  </label>
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    min="70"
                    max="450"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                  <span className="text-[10.5px] text-slate-400 mt-0.5 block">
                    Minimum required donor weight: 99 lbs (females) / 106 lbs (males).
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Feet (ft)
                    </label>
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      min="3"
                      max="7"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Inches (in)
                    </label>
                    <input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      min="0"
                      max="11"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300">
              <p className="font-semibold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> Informational Use Note
              </p>
              <p className="text-[11px] mt-0.5 leading-relaxed">
                This BMI calculator is strictly for guidance and pre-screening. Actual donation clearance is confirmed via on-site clinical vitals checking.
              </p>
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Calculated BMI Assessment
              </h3>

              {bmiResult ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-400 font-medium">Your Body Mass Index</p>
                    <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                      {bmiResult.bmi}
                    </p>
                    <p className={`text-sm font-bold mt-1 ${bmiResult.categoryColor}`}>
                      {bmiResult.category}
                    </p>
                  </div>

                  {/* Donor Eligibility Feedback */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Donation Clearance Feasibility
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          bmiResult.eligible
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        }`}
                      >
                        {bmiResult.eligible ? '✓ Weight Compliant' : '⚠ Weight Borderline'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {bmiResult.donorAdvisory}
                    </p>
                  </div>

                  {/* Reference Scale */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      WHO Standard Reference Categories
                    </p>
                    <div className="grid grid-cols-4 gap-1 text-[10.5px] text-center font-medium">
                      <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                        &lt; 18.5
                        <br />
                        Underweight
                      </div>
                      <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold">
                        18.5 - 24.9
                        <br />
                        Normal
                      </div>
                      <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                        25 - 29.9
                        <br />
                        Overweight
                      </div>
                      <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600">
                        ≥ 30.0
                        <br />
                        Obese
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Enter height and weight to calculate BMI.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveSubTab('eligibility')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ef4444] hover:underline"
              >
                Proceed to full eligibility questionnaire
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-View 3: Blood Donation Eligibility Information */}
      {activeSubTab === 'eligibility' && (
        <div className="space-y-4">
          {/* Interactive Self-Screening Questionnaire */}
          <div className="bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#ef4444]" />
                  Interactive Donor Pre-Screening Questionnaire
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Answer 6 fast clinical questions to check if you are eligible to donate today.
                </p>
              </div>

              {allAnswered && (
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    isEligible
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                  }`}
                >
                  {isEligible ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Pre-Screening Cleared!
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5" /> Temporary Deferral Advised
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800 gap-3"
                >
                  <p className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200">
                    <span className="font-bold text-slate-400 mr-2">{idx + 1}.</span>
                    {q.text}
                  </p>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setAnswers({ ...answers, [q.id]: true })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        answers[q.id] === true
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-[#0c1527] text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setAnswers({ ...answers, [q.id]: false })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        answers[q.id] === false
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white dark:bg-[#0c1527] text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {allAnswered && (
              <div
                className={`p-4 rounded-xl border ${
                  isEligible
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                }`}
              >
                <h4 className="font-bold text-sm flex items-center gap-2">
                  {isEligible ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Congratulations! You appear eligible to donate blood.
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      Temporary Deferral Notice
                    </>
                  )}
                </h4>
                <p className="text-xs mt-1 leading-relaxed">
                  {isEligible
                    ? 'You meet the essential criteria for voluntary blood donation in Bangladesh. Book an appointment or register into our directory to save lives.'
                    : 'Based on your answers, you may need to wait for a temporary deferral period (e.g. antibiotic course completion, 3-month wait interval, or recovering from cold). Feel free to consult our medical hotline at 999 or Quantum.'}
                </p>
              </div>
            )}
          </div>

          {/* Clinical Guidelines List */}
          <div className="bg-white dark:bg-[#0c1527] p-5 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-500" />
              Standard Bangladesh & WHO Donation Eligibility Guidelines
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ELIGIBILITY_GUIDELINES.map((g, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {g.title}
                    </h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {g.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-View 4: Emergency Contacts */}
      {activeSubTab === 'emergency' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0c1527] p-4 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-[#131d33] rounded-xl">
                {emergencyCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedEmergencyCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedEmergencyCategory === cat
                        ? 'bg-[#ef4444] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={emergencySearch}
                  onChange={(e) => setEmergencySearch(e.target.value)}
                  placeholder="Search emergency helplines..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredEmergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white dark:bg-[#0c1527] p-4 rounded-2xl border border-slate-100 dark:border-[#15213b] shadow-xs flex flex-col justify-between space-y-3 hover:border-red-200 dark:hover:border-red-900/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-[#ef4444] dark:bg-red-950/60 dark:text-red-400">
                      {contact.category}
                    </span>
                    {contact.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {contact.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                    {contact.name}
                  </h3>

                  <p className="text-[11.5px] text-slate-400 dark:text-slate-400 mt-1">
                    {contact.location}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {contact.availableHours}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {contact.phone}
                  </span>
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call Hotline
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
