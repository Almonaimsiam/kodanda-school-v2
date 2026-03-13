// 🟦[TEMPLATE: PAYMENT_SUCCESS_PAGE]
import { useParams, Link } from 'react-router-dom';

export default function PaymentSuccess() {
  const { tranId } = useParams();

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-10 rounded-lg shadow-2xl text-center border-t-8 border-green-500 max-w-lg w-full">
        <div className="text-green-500 text-7xl mb-4">✅</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6 text-lg">Thank you. Your tuition fee has been successfully processed.</p>
        
        {/* Shows the ID if SSLCommerz provides it */}
        {tranId && (
          <div className="bg-gray-100 p-3 rounded mb-8 border border-gray-200">
            <p className="text-sm text-gray-500 font-bold">Transaction ID:</p>
            <p className="text-gray-800 font-mono">{tranId}</p>
          </div>
        )}

        <Link to="/" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg inline-block">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}