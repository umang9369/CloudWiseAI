import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';

// Placeholder Pages
import Dashboard from './pages/Dashboard';
const Anomalies = () => <div className="p-10">ANOMALY_DETECTION</div>;
const Recommendations = () => <div className="p-10">AI_RECOMMENDATIONS</div>;
const Simulator = () => <div className="p-10">WHAT_IF_SIMULATOR</div>;
const Query = () => <div className="p-10">NL_QUERY_INTERFACE</div>;
const Reports = () => <div className="p-10">AI_REPORTS</div>;
const Ingestion = () => <div className="p-10">DATA_INGESTION</div>;
const Settings = () => <div className="p-10">SETTINGS_INTEGRATIONS</div>;

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary font-body antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[220px]">
        <TopBar />
        <main className="flex-1 overflow-x-hidden pt-[52px]">
          {children}
        </main>
      </div>
    </div>
  );
}

function LandingHero() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center">
      <h1 className="text-hero font-display font-bold uppercase text-white-glyph text-center">Cloud Costs,<br />Decoded.</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingHero />} />

        {/* Protected Dashboard Routes */}
        <Route path="/app/*" element={
          <AppLayout>
            <Routes>
              <Route path="overview" element={<Dashboard />} />
              <Route path="anomalies" element={<Anomalies />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="simulator" element={<Simulator />} />
              <Route path="query" element={<Query />} />
              <Route path="reports" element={<Reports />} />
              <Route path="ingestion" element={<Ingestion />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Routes>
          </AppLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
