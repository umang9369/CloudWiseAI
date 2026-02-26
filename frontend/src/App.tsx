import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

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
