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
    setSelectedAsset,
    setScenarioInputs,
    simulationSummary,
    scenarioInputs,
  } = useAppState();

  const [currentStep, setCurrentStep] = useState(0);

  const STEPS: DemoStep[] = [
    {
      title: 'Step 1: Situation Overview',
      subtitle: 'T–24h Cyclone Threat & Response Priority',
      tab: 'command',
      description:
        'Cyclone Varuna is expected to make landfall in 24 hours. CycloneShield AI identifies where the impact will be highest and what action should be taken first.',
      keyHighlight: 'Storm Threat: 135 km/h Winds • 1.8m Surge • 24h to Landfall',
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
      title: 'Step 2: Inspect Coastal Ward 7 on Map',
      subtitle: 'Multi-Hazard Risk Attribution & Why At Risk',
      tab: 'map',
      description:
        'Coastal Ward 7 is at Critical Risk (Score 78/100, 78% flood probability, 1.6m estimated depth). 1,515 vulnerable residents (elderly & children) face severe inundation due to 2.1m low elevation and surge.',
      keyHighlight: 'Coastal Ward 7: Critical Risk (78/100) • 4,850 exposed • 1.6m water depth',
      onEnter: (ctx) => {
        ctx.setActiveTab('map');
        const ward7 = ctx.simulationSummary.villages.find((v: any) => v.id === 'vil-01');
        if (ward7) {
          ctx.setSelectedVillage(ward7);
          ctx.setSelectedAsset(null);
        }
      },
    },
    {
      title: 'Step 3: Evacuation Plan & Safe Corridor Allocation',
      subtitle: 'Shelter A Rejection & Elevated Route 2 Assignment',
      tab: 'evacuation',
      description:
        'High School Cyclone Shelter A is closer, but rejected because its access road is projected to flood. Municipal Cyclone Shelter B is recommended through Elevated Route 2 (P0 Priority, 1,120+ beds available).',
      keyHighlight: 'Shelter A Rejected (Road Flooded) ➔ Municipal Shelter B via Elevated Route 2',
      onEnter: (ctx) => {
        ctx.setActiveTab('evacuation');
        const ward7 = ctx.simulationSummary.villages.find((v: any) => v.id === 'vil-01');
        if (ward7) ctx.setSelectedVillage(ward7);
      },
    },
    {
      title: 'Step 4: Infrastructure Defense Matrix',
      subtitle: 'Criticality vs Risk & Preventative Actions',
      tab: 'infrastructure',
      description:
        'Coastal Power Substation (Criticality 90/100, Risk 85/100) faces severe surge inundation. Potential impact: Total power outage across 3 wards. Recommended Action: De-energize 33kV Feeders 3 & 4 before surge crest to prevent transformer explosion.',
      keyHighlight: 'Coastal Power Substation: Risk 85/100 ➔ De-energize 33kV Feeders before surge crest',
      onEnter: (ctx) => {
        ctx.setActiveTab('infrastructure');
        const powerSub = ctx.simulationSummary.assets.find((a: any) => a.id === 'infra-power-1');
        if (powerSub) ctx.setSelectedAsset(powerSub);
      },
    },
    {
      title: 'Step 5: Scenario Simulator (What-If Sensitivity)',
      subtitle: 'Shift Track +30 km North & Surge Increase',
      tab: 'simulator',
      description:
        'Simulating a +30 km North track shift toward the delta immediately recalculates all 8 villages, 42 assets, and routes. Observe changed risk zones, 7 additional high/critical villages, and an expanded shelter capacity gap.',
      keyHighlight: '+30 km Track Shift ➔ Dynamic recalculation across all villages, assets & routes',
      onEnter: (ctx) => {
        ctx.setActiveTab('simulator');
        ctx.setScenarioInputs({
          windSpeedKmh: 145,
          rainfallMm: 225,
          stormSurgeMeters: 2.4,
          trackShiftKm: 30,
          landfallHours: 20,
        });
      },
    },
    {
      title: 'Step 6: AI Situation Brief (SITREP)',
      subtitle: 'Structured Operational Advisory with English & Hindi',
      tab: 'briefing',
      description:
        'Generates a structured, transparent SITREP advisory with executive summary, immediate action checklist, P0 evacuation queue, critical infrastructure defenses, and bilingual English/Hindi public broadcasts.',
      keyHighlight: 'SITREP Advisory: Structured priorities + Dual-language public advisories',
      onEnter: (ctx) => {
        ctx.setActiveTab('briefing');
      },
    },
    {
      title: 'Step 7: CAP-Compliant Alert Drafts',
      subtitle: 'Standardized Public Warnings (Human Approval Required)',
      tab: 'alert',
      description:
        'Inspect structured OASIS CAP v1.2 XML/JSON emergency alert payloads with simulated multi-channel mobile dispatch and strict "Human approval required before dispatch" governance.',
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
        setSelectedAsset,
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
        setSelectedAsset,
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
