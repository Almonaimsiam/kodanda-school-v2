// 🟦 [TEMPLATE: LOGIN_FORM_FETCH]
// A standard Login form that verifies credentials and saves the JWT token.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ studentId: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://kodanda-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Login Successful!');
        
        // Save the token and student data to LocalStorage so the browser remembers them!
        localStorage.setItem('token', data.token);
        localStorage.setItem('student', JSON.stringify(data.student));
        
        // Send them to the Home page (or dashboard) after login
        setTimeout(() => navigate('/'), 1000); 
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Server error. Is the backend running?');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-secondary p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-primary">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Student Login</h2>
        
        {message && <p className="text-center font-bold mb-4 text-gray-700">{message}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" name="studentId" placeholder="Student ID" required
            onChange={handleChange}
            className="border-2 border-gray-200 p-2 rounded focus:outline-none focus:border-primary"
          />
          <input 
            type="password" name="password" placeholder="Password" required
            onChange={handleChange}
            className="border-2 border-gray-200 p-2 rounded focus:outline-none focus:border-primary"
          />
          
          <button type="submit" className="bg-primary text-secondary font-bold py-2 rounded hover:bg-blue-700 transition mt-2">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Need an account? <Link to="/register" className="text-primary font-bold">Register here</Link>
        </p>
      </div>
    </div>
  );
}