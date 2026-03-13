import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, LogOut, User, Menu, X, Globe } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export default function Navbar() {
  const { language, toggleLanguage, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [student, setStudent] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

useEffect(() => {
  // CRITICAL SECURITY: Clear ALL localStorage every time the site loads.
  // This prevents users from being remembered across tabs or reloads.
  localStorage.clear(); 

  const savedStudent = sessionStorage.getItem('student');
  if (savedStudent) {
    setStudent(JSON.parse(savedStudent));
  } else {
    setStudent(null);
    // If we are on the payment page but not logged in, kick them to login
    if (location.pathname === '/payment') {
      navigate('/login');
    }
  }
}, [location, navigate]);


const handleLogout = () => {
    sessionStorage.clear(); // This wipes the session data
    setStudent(null);
    navigate('/'); // Send to home page
};
  return (
    <nav className="bg-primary text-secondary shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.svg" alt="Logo" className="w-10 h-10 bg-white rounded-full p-1" />
          <span className="text-xl font-bold">{t('schoolName')}</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 font-medium">
          <Link to="/" className="hover:text-blue-200 transition">{t('home')}</Link>
          <Link to="/admission" className="hover:text-blue-200 transition">{t('admission')}</Link>
          
          <button onClick={toggleLanguage} className="bg-blue-800 px-3 py-1.5 rounded-md text-white font-bold text-sm">
            <Globe size={16} /> {language === 'bn' ? 'EN' : 'BN'}
          </button>

          {student ? (
            <div className="flex items-center gap-4">
              <span className="text-yellow-300 font-bold flex items-center gap-1"><User size={18} /> {student.name}</span>
              <Link to="/payment" className="bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded-md font-bold transition">{t('payFees')}</Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md font-bold flex items-center gap-1"><LogOut size={16}/> {t('logout')}</button>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-primary px-4 py-1.5 rounded-md font-bold transition">{t('login')}</Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
}