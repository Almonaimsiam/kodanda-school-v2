import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import TopNoticeBar from './components/TopNoticeBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <TopNoticeBar />
        <Navbar />
        
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Payment Routes */}
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success/:tranId" element={<PaymentSuccess />} />
            <Route path="/payment-success" element={<PaymentSuccess />} /> 
            <Route path="/payment-fail" element={<PaymentFail />} />
            
            {/* Placeholders */}
            <Route path="/admission" element={<div className="text-center mt-20 text-2xl font-bold text-primary">Admission Page Coming Soon</div>} />
            <Route path="/teachers" element={<div className="text-center mt-20 text-2xl font-bold text-primary">Teachers Page Coming Soon</div>} />
            <Route path="/notice" element={<div className="text-center mt-20 text-2xl font-bold text-primary">Notice Board Coming Soon</div>} />
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;