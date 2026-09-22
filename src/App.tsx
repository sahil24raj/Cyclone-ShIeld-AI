import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { PrototypeBanner } from './components/common/PrototypeBanner';
import { TopHeader } from './components/common/TopHeader';
import { Sidebar } from './components/common/Sidebar';
import { CommandCentreView } from './components/command/CommandCentreView';
import { InteractiveMap } from './components/map/InteractiveMap';
import { EvacuationPlannerView } from './components/evacuation/EvacuationPlannerView';
import { InfrastructureView } from './components/infrastructure/InfrastructureView';
import { ScenarioSimulatorView } from './components/simulator/ScenarioSimulatorView';
import { AIBriefingView } from './components/briefing/AIBriefingView';
import { AlertCentreView } from './components/alert/AlertCentreView';
import { MethodologyView } from './components/methodology/MethodologyView';
import { HistoricalAnalysisView } from './components/historical/HistoricalAnalysisView';

const MainContent: React.FC = () => {
  const { activeTab } = useAppState();

  return (
    <main className="flex-1 overflow-y-auto bg-navy-950">
      {activeTab === 'command' && <CommandCentreView />}
      {activeTab === 'map' && (
        <div className="h-[calc(100vh-80px)] w-full">
          <InteractiveMap />
        </div>
      )}
      {activeTab === 'evacuation' && <EvacuationPlannerView />}
      {activeTab === 'infrastructure' && <InfrastructureView />}
      {activeTab === 'simulator' && <ScenarioSimulatorView />}
      {activeTab === 'briefing' && <AIBriefingView />}
      {activeTab === 'alert' && <AlertCentreView />}
      {activeTab === 'historical' && <HistoricalAnalysisView />}
      {activeTab === 'methodology' && <MethodologyView />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppStateProvider>
        <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
          {/* Top Statutory Disclaimer Banner */}
          <PrototypeBanner />

          {/* Emergency Operations Header */}
          <TopHeader />

          {/* Body with Sidebar and Main Tab Content */}
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <MainContent />
          </div>
        </div>
      </AppStateProvider>
    </LanguageProvider>
  );
};

export default App;
