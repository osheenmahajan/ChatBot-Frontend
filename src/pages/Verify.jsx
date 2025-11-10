import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useUserData } from "../context/UserContext";
import { LoadingSpinner } from '../components/loading';
import { ChatData } from '../context/ChatContext';

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { verifyUser, btnLoading } = useUserData();

  const { fetchChats } = ChatData()

  // getting verifyUser from context
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      return toast.error("Please enter the OTP");
    }

    // ✅ Call the context's verifyUser function (handles axios, state, etc.)
    await verifyUser(otp, navigate, fetchChats);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <form className="bg-white p-6 rounded shadow-md w-full md:w-[500px]" onSubmit={submitHandler}>
        <h2 className='text-2xl mb-4 font-semibold'>Verify</h2>

        <div className='mb-4'>
          <label className='block text-gray-700 mb-2' htmlFor='otp'>
            OTP:
          </label>
          <input
            type='number'
            id='otp'
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className='border p-2 w-full rounded outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        <button
          type="submit"
          disabled={btnLoading}
          className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${
            btnLoading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {btnLoading ? <LoadingSpinner /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Verify;
