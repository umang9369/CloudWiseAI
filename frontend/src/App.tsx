import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';

// Placeholder Pages
import Dashboard from './pages/Dashboard';
import Anomalies from './pages/Anomalies';
import Recommendations from './pages/Recommendations';
import Simulator from './pages/Simulator';
import Query from './pages/Query';
import Reports from './pages/Reports';
import Ingestion from './pages/Ingestion';
import Settings from './pages/Settings';

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
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center gap-8">
      <h1 className="text-hero font-display font-bold uppercase text-white-glyph text-center">Cloud Costs,<br />Decoded.</h1>
      <Link to="/app/overview" className="border border-border hover:border-text-primary px-8 py-3 text-label font-bold transition-colors">
        ENTER PLATFORM
      </Link>
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
