// 🟦 [TEMPLATE: RESPONSIVE_BILINGUAL_NAVBAR]
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, LogOut, User, Menu, X, Globe } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export default function Navbar() {
  const { language, toggleLanguage, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation(); // THIS IS THE FIX! It tells the navbar to refresh when URL changes.
  const[student, setStudent] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // This will now properly run every time the page changes (like after logging in!)
  useEffect(() => {
    const savedStudent = sessionStorage.getItem('student');
    if (savedStudent) {
      setStudent(JSON.parse(savedStudent));
    } else {
      setStudent(null);
    }
  }, [location]); 

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('student');
    setStudent(null);
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-secondary shadow-lg sticky top-[32px] z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 z-50">
          <img src="/images/logo.svg" alt="Logo" className="w-10 h-10 bg-white rounded-full p-1 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          <span className="text-xl font-bold tracking-wide">{t('schoolName')}</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 font-medium">
          <Link to="/" className="hover:text-blue-200 transition">{t('home')}</Link>
          <Link to="/admission" className="hover:text-blue-200 transition">{t('admission')}</Link>
          <Link to="/teachers" className="hover:text-blue-200 transition">{t('teachers')}</Link>
          <Link to="/notice" className="hover:text-blue-200 transition">{t('notice')}</Link>
          
          <div className="flex items-center bg-white rounded-md px-2 py-1 text-black">
            <input type="text" placeholder={t('search')} className="outline-none px-1 text-sm w-32" />
            <Search size={16} className="text-gray-500 cursor-pointer" />
          </div>

          <button onClick={toggleLanguage} className="flex items-center gap-1 bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded-md text-white font-bold transition text-sm shadow">
            <Globe size={16} /> {language === 'bn' ? 'EN' : 'BN'}
          </button>

          {/* DYNAMIC AUTH SECTION */}
          {student ? (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-yellow-300 font-bold"><User size={18} /> {student.name}</span>
              <Link to="/payment" className="bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded-md text-white font-bold transition shadow">{t('payFees')}</Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md text-white font-bold transition flex items-center gap-1 shadow"><LogOut size={16}/> {t('logout')}</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Payment button is now visible for logged out users! It will redirect them to login. */}
              <Link to="/payment" className="bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded-md text-white font-bold transition shadow">{t('payFees')}</Link>
              <Link to="/login" className="bg-white text-primary hover:bg-gray-100 px-4 py-1.5 rounded-md font-bold transition shadow">{t('login')}</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button className="md:hidden text-white z-50" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary absolute top-full left-0 w-full flex flex-col items-center py-4 space-y-4 shadow-xl border-t border-blue-600">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t('home')}</Link>
          <Link to="/admission" onClick={() => setIsMobileMenuOpen(false)}>{t('admission')}</Link>
          <Link to="/teachers" onClick={() => setIsMobileMenuOpen(false)}>{t('teachers')}</Link>
          <Link to="/notice" onClick={() => setIsMobileMenuOpen(false)}>{t('notice')}</Link>
          
          <button onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} className="flex items-center gap-1 bg-blue-800 text-white px-4 py-2 rounded-md font-bold">
            <Globe size={16} /> Switch to {language === 'bn' ? 'English' : 'Bangla'}
          </button>

          {student ? (
            <>
              <span className="text-yellow-300 font-bold">👤 {student.name}</span>
              <Link to="/payment" onClick={() => setIsMobileMenuOpen(false)} className="bg-green-500 text-white px-6 py-2 rounded-md font-bold">{t('payFees')}</Link>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="bg-red-500 text-white px-6 py-2 rounded-md font-bold flex items-center gap-1"><LogOut size={16}/> {t('logout')}</button>
            </>
          ) : (
            <>
              {/* Payment button on mobile for logged out users too! */}
              <Link to="/payment" onClick={() => setIsMobileMenuOpen(false)} className="bg-green-500 text-white px-6 py-2 rounded-md font-bold">{t('payFees')}</Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-white text-primary px-6 py-2 rounded-md font-bold">{t('login')}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}