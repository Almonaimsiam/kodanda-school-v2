// 🟦[TEMPLATE: DYNAMIC_PAYMENT_CHECKOUT]
// A checkout page where the user can input their own payment amount.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const[amount, setAmount] = useState(''); // NEW: State to hold the custom amount

  useEffect(() => {
    const savedStudent = sessionStorage.getItem('student');
    if (!savedStudent) {
      navigate('/login'); 
    } else {
      setStudent(JSON.parse(savedStudent));
    }
  }, [navigate]);

  const handlePayment = async () => {
    // Basic validation: Make sure they entered a valid number greater than 0
    if (!amount || parseInt(amount) <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('api/payment/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.studentId,
          name: student.name,
          amount: parseInt(amount) // Send the typed amount to backend!
        })
      });

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.replace(data.paymentUrl);
      } else {
        alert("Payment Gateway Failed to Load.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error. Make sure backend is running.");
      setLoading(false);
    }
  };

  if (!student) return <div className="text-center mt-20 font-bold text-primary">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-primary text-center">
        <h2 className="text-2xl font-bold text-primary mb-6">Pay School Fees</h2>
        
        {/* Student Details Card */}
        <div className="bg-gray-100 p-4 rounded mb-6 text-left border border-gray-200 shadow-inner">
          <p className="mb-1"><strong className="text-gray-700">Student Name:</strong> {student.name}</p>
          <p className="mb-1"><strong className="text-gray-700">Student ID:</strong> {student.studentId}</p>
          <p><strong className="text-gray-700">Class:</strong> {student.class}</p>
        </div>

        {/* Input for Amount */}
        <div className="mb-6 text-left">
          <label className="block text-gray-800 font-bold mb-2">
            Enter Amount (BDT):
          </label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 500"
            className="w-full border-2 border-gray-300 p-3 rounded focus:outline-none focus:border-primary text-lg"
            required
          />
        </div>

        <button 
          onClick={handlePayment} 
          disabled={loading}
          className="w-full bg-green-500 text-white font-bold py-3 rounded hover:bg-green-600 transition shadow-lg flex justify-center items-center text-lg"
        >
          {loading ? "Connecting Gateway..." : `Pay Now via SSLCommerz`}
        </button>
      </div>
    </div>
  );
}