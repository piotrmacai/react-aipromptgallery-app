import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Gallery } from './pages/Gallery';
import { Assistant } from './pages/Assistant';
import { Footer } from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white antialiased selection:bg-primary/30 selection:text-primary-foreground relative overflow-x-hidden flex flex-col">
         {/* Global Background Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Base Color */}
            <div className="absolute inset-0 bg-background" />
            {/* Subtle Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 blur-[100px] rounded-full opacity-50" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex-1">
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/assistant" element={<Assistant />} />
          </Routes>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;