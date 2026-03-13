// 🟦 [TEMPLATE: PAYMENT_FAIL_PAGE]
import { Link } from 'react-router-dom';

export default function PaymentFail() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-10 rounded-lg shadow-2xl text-center border-t-8 border-red-500 max-w-lg w-full">
        <div className="text-red-500 text-7xl mb-4">❌</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-8 text-lg">Your transaction could not be completed or was canceled by the user.</p>
        
        <Link to="/payment" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg inline-block">
          Try Again
        </Link>
      </div>
    </div>
  );
}