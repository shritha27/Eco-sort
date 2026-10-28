import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WasteGuidePage } from './pages/WasteGuidePage';
import { IdentificationPage } from './pages/IdentificationPage';
import { RecyclingInfoPage } from './pages/RecyclingInfoPage';
import { CollectionRequestPage } from './pages/CollectionRequestPage';
import { RequestTrackingPage } from './pages/RequestTrackingPage';
import { QRCodeGeneratorPage } from './pages/QRCodeGeneratorPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PartnerDashboardPage } from './pages/PartnerDashboardPage';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-warmwhite selection:bg-forest-100 selection:text-forest-900 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/guide" element={<WasteGuidePage />} />
            <Route path="/identify" element={<IdentificationPage />} />
            <Route path="/recycling" element={<RecyclingInfoPage />} />
            <Route path="/request" element={<CollectionRequestPage />} />
            <Route path="/track" element={<RequestTrackingPage />} />
            <Route path="/qr-bins" element={<QRCodeGeneratorPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/partner" element={<PartnerDashboardPage />} />
            {/* Catch-all route redirects to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
