import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg('📬 Password reset email sent!');
    } catch (err) {
      setMsg('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-xl mb-4">Reset Password</h2>
      <input
        className="mb-2 p-2 rounded bg-gray-800 w-64"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleReset}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Send Reset Link
      </button>
      <p className="mt-4 text-sm">{msg}</p>
    </div>
  );
};

export default ForgotPassword;
