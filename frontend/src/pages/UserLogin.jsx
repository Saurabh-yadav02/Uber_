
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password }
      )

      if (response.status === 200) {
        setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        navigate('/home')
      }
    } catch (error) {
      alert('Invalid email or password')
    }

    setEmail('')
    setPassword('')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <section
        className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8"
        aria-labelledby="login-heading"
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
          alt="App Logo"
          className="w-16 mx-auto mb-6"
        />

        <h1
          id="login-heading"
          className="text-2xl font-semibold text-center mb-6"
        >
          User Login
        </h1>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="email@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          New here?
          <Link
            to="/signup"
            className="text-blue-600 ml-1 hover:underline"
          >
            Create an account
          </Link>
        </p>

        <Link
          to="/captain-login"
          className="mt-6 block text-center bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          Sign in as Captain
        </Link>
      </section>
    </main>
  )
}

export default UserLogin
