import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Unauthorized = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "401 Unauthorized: User attempted to access restricted route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">401</h1>
        <p className="text-xl text-gray-600 mb-4">Unauthorized access</p>
        <a href="/admin/login" className="text-blue-500 hover:text-blue-700 underline">
          Return to Login
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
