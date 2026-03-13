// 🟦[TEMPLATE: REGISTER_FORM_FETCH]
// A standard Registration form that sends data to our Node.js Backend.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  
  // State to hold user input
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    studentClass: '',
    password: ''
  });
  
  const [message, setMessage] = useState(''); // For success/error messages

  // Handle typing in the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload
    
    try {
      const response = await fetch('https://kodanda-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Registration Successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000); // Send to login page after 2 seconds
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
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Student Registration</h2>
        
        {message && <p className="text-center font-bold mb-4 text-gray-700">{message}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" name="name" placeholder="Full Name" required
            onChange={handleChange}
            className="border-2 border-gray-200 p-2 rounded focus:outline-none focus:border-primary"
          />
          <input 
            type="text" name="studentId" placeholder="Unique Student ID (e.g. 1001)" required
            onChange={handleChange}
            className="border-2 border-gray-200 p-2 rounded focus:outline-none focus:border-primary"
          />
          <input 
            type="text" name="studentClass" placeholder="Class (e.g. Class 10)" required
            onChange={handleChange}
            className="border-2 border-gray-200 p-2 rounded focus:outline-none focus:border-primary"
          />
          <input 
            type="password" name="password" placeholder="Password" required
            onChange={handleChange}
            className="border-2 border-gray-200 p-2 rounded focus:outline-none focus:border-primary"
          />
          
          <button type="submit" className="bg-primary text-secondary font-bold py-2 rounded hover:bg-blue-700 transition mt-2">
            Register Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-primary font-bold">Login here</Link>
        </p>
      </div>
    </div>
  );
}