import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  Sliders,
  FileText,
  Bell,
  MapPin,
  ShieldAlert
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

interface DemoStep {
  title: string;
  subtitle: string;
  tab: string;
  description: string;
  actionText?: string;
  onEnter?: (context: any) => void;
  keyHighlight: string;
}

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({ isOpen, onClose }) => {
  const {
    setActiveTab,
    setSelectedVillage,
    setScenarioInputs,
    simulationSummary,
    scenarioInputs,
  } = useAppState();

  const [currentStep, setCurrentStep] = useState(0);

  const STEPS: DemoStep[] = [
    {
      title: 'Step 1: Situation Overview',
      subtitle: 'Cyclone Varuna T-24h Decision Baseline',
      tab: 'command',
      description:
        'Cyclone Varuna is advancing in the Bay of Bengal with 135 km/h sustained winds and a 1.8m storm surge projected at landfall in 24 hours. 3 coastal wards require immediate action.',
      keyHighlight: 'Storm Status: 135 km/h Wind • 1.8m Surge • 24h Landfall',
      onEnter: (ctx) => {
        ctx.setActiveTab('command');
        ctx.setScenarioInputs({
          windSpeedKmh: 135,
          rainfallMm: 180,
          stormSurgeMeters: 1.8,
          trackShiftKm: 0,
          landfallHours: 24,
        });
      },
    },
    {
      title: 'Step 2: Inspect Coastal Ward 7',
      subtitle: 'Critical Multi-Hazard Risk Attribution',
      tab: 'map',
      description:
        'Coastal Ward 7 is evaluated at Critical Risk (76/100). Low elevation (2.1m) and 1.8m surge create severe flooding. 1,515 vulnerable residents need immediate evacuation.',
      keyHighlight: 'Coastal Ward 7: Critical Risk (76/100) • 4,850 exposed residents',
      onEnter: (ctx) => {
        ctx.setActiveTab('map');
        const ward7 = ctx.simulationSummary.villages.find((v: any) => v.id === 'vil-01');
        if (ward7) ctx.setSelectedVillage(ward7);
      },
    },
    {
      title: 'Step 3: Evacuation Plan & Shelter A Rejection',
      subtitle: 'Flood-Avoidance Shelter Rerouting',
      tab: 'evacuation',
      description:
        'The evacuation engine automatically detects that the nearest shelter (High School Shelter A) has a flooded access road. Shelter A is safely rejected.',
      keyHighlight: 'Shelter A Rejected: Access road flooded under storm surge',
      onEnter: (ctx) => {
        ctx.setActiveTab('evacuation');
      },
    },
    {
      title: 'Step 4: Shelter B & Elevated Route 2 Assigned',
      subtitle: 'Guaranteed Accessible Corridor',
      tab: 'evacuation',
      description:
        'Municipal Cyclone Shelter B is automatically assigned via Elevated Route 2, providing 1,120+ available beds and guaranteed flood-free access.',
      keyHighlight: 'Assigned: Municipal Shelter B via Elevated Route 2',
      onEnter: (ctx) => {
        ctx.setActiveTab('evacuation');
      },
    },
    {
      title: 'Step 5: Scenario Simulator (What-If)',
      subtitle: 'Testing Track Shift Sensitivity',
      tab: 'simulator',
      description:
        'Emergency managers can test sensitivity to forecast shifts. What if the cyclone shifts 30 km North toward the Mahanadi delta?',
      keyHighlight: 'Interactive Controls: Wind, Rainfall, Surge, Track Shift',
      onEnter: (ctx) => {
        ctx.setActiveTab('simulator');
      },
    },
    {
      title: 'Step 6: Shift Track 30 km North',
      subtitle: 'Real-Time Impact Recalculation',
      tab: 'simulator',
      description:
        'Shifting the track +30 km North recalculates the entire district. 7 additional villages move to High/Critical risk, Delta Hospital enters flood risk, and the shelter deficit increases.',
      keyHighlight: 'Delta Impact: +7 Critical Villages • +4,200 Shelter Deficit',
      onEnter: (ctx) => {
        ctx.setActiveTab('simulator');
        ctx.setScenarioInputs((prev: any) => ({ ...prev, trackShiftKm: 30 }));
      },
    },
    {
      title: 'Step 7: AI Situation Brief (SITREP)',
      subtitle: 'Automated Decision Support',
      tab: 'briefing',
      description:
        'Generates a comprehensive 10-section operational briefing with executive summary, top 5 risks, evacuation priorities, and dual English/Hindi public advisories.',
      keyHighlight: 'SITREP: Structured priorities + Dual-language public advisories',
      onEnter: (ctx) => {
        ctx.setActiveTab('briefing');
      },
    },
    {
      title: 'Step 8: Standardized CAP Alert Draft',
      subtitle: 'Simulated Common Alerting Protocol',
      tab: 'alert',
      description:
        'Produces standardized CAP v1.2 XML/JSON alert payloads for multi-channel siren, SMS, and WhatsApp dispatch with strict "Simulation draft — human approval required" guardrails.',
      keyHighlight: 'CAP v1.2 Draft: Validated payload with simulated dispatch safeguard',
      onEnter: (ctx) => {
        ctx.setActiveTab('alert');
      },
    },
  ];

  if (!isOpen) return null;

  const current = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      STEPS[nextIdx].onEnter?.({
        setActiveTab,
        setSelectedVillage,
        setScenarioInputs,
        simulationSummary,
      });
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      STEPS[prevIdx].onEnter?.({
        setActiveTab,
        setSelectedVillage,
        setScenarioInputs,
        simulationSummary,
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-full bg-navy-900 border border-teal-500/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in font-sans">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border-b border-navy-750 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-teal-300 font-bold uppercase tracking-wider">
              Interactive 3-Minute Walkthrough
            </span>
            <h4 className="text-sm font-bold text-white leading-none">
              {current.title}
            </h4>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Close Guided Demo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="px-4 pt-3 flex items-center gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full flex-1 transition-all ${
              i === currentStep
                ? 'bg-teal-400'
                : i < currentStep
                ? 'bg-teal-700'
                : 'bg-navy-750'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="text-xs font-mono text-teal-300 font-semibold">
          {current.subtitle}
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          {current.description}
        </p>

        <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 text-[11px] font-mono text-teal-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <span>{current.keyHighlight}</span>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-3 bg-navy-950 border-t border-navy-750 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">
          Step {currentStep + 1} of {STEPS.length}
        </span>

        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="px-3 py-1.5 bg-navy-850 hover:bg-navy-800 text-slate-300 rounded-lg flex items-center gap-1 border border-navy-700 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-teal-950 transition-colors"
          >
            <span>{currentStep === STEPS.length - 1 ? 'Finish Demo' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
