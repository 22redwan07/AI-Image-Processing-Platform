import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Process from './pages/Process';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
// NEW IMPORTS
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import MetadataView from './pages/MetadataView';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container-fluid py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/process" element={<Process />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* NEW ROUTES */}
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/metadata" element={<MetadataView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;