import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { server } from '../main'
import { LoadingSpinner } from '../components/loading'

const Login = () => {
  const [email, setEmail] = useState("")
  const [btnLoading, setBtnLoading] = useState(false)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true)
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });
      if (data.verifyToken) {
        localStorage.setItem("verifyToken", data.verifyToken);
        navigate("/verify");
      } else {
        alert("No verifyToken returned from backend");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <form className="bg-white p-6 rounded shadow-md w-full md:w-[500px]" onSubmit={submitHandler}>
        <h2 className='text-2xl mb-4'>LOGIN</h2>
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2' htmlFor='email'>
            Email:
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='border p-2 w-full rounded outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>
        <button className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700' disabled={btnLoading}>
          {btnLoading ? <LoadingSpinner /> : "Submit"}
        </button>
      </form>
    </div>
  )
}

export default Login