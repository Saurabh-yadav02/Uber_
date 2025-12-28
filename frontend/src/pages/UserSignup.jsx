// import React, { useState, useContext } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { UserDataContext } from '../context/UserContext'



// const UserSignup = () => {
//   const [ email, setEmail ] = useState('')
//   const [ password, setPassword ] = useState('')
//   const [ firstName, setFirstName ] = useState('')
//   const [ lastName, setLastName ] = useState('')
//   const [ userData, setUserData ] = useState({})

//   const navigate = useNavigate()



//   const { user, setUser } = useContext(UserDataContext)




//   const submitHandler = async (e) => {
//     e.preventDefault()
//     const newUser = {
//       fullname: {
//         firstname: firstName,
//         lastname: lastName
//       },
//       email: email,
//       password: password
//     }

//     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

//     if (response.status === 201) {
//       const data = response.data
//       setUser(data.user)
//       localStorage.setItem('token', data.token)
//       navigate('/home')
//     }


//     setEmail('')
//     setFirstName('')
//     setLastName('')
//     setPassword('')

//   }
//   return (
//     <div>
//       <div className='p-7 h-screen flex flex-col justify-between'>
//         <div>
//           <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

//           <form onSubmit={(e) => {
//             submitHandler(e)
//           }}>

//             <h3 className='text-lg w-1/2  font-medium mb-2'>What's your name</h3>
//             <div className='flex gap-4 mb-7'>
//               <input
//                 required
//                 className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
//                 type="text"
//                 placeholder='First name'
//                 value={firstName}
//                 onChange={(e) => {
//                   setFirstName(e.target.value)
//                 }}
//               />
//               <input
//                 required
//                 className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
//                 type="text"
//                 placeholder='Last name'
//                 value={lastName}
//                 onChange={(e) => {
//                   setLastName(e.target.value)
//                 }}
//               />
//             </div>

//             <h3 className='text-lg font-medium mb-2'>What's your email</h3>
//             <input
//               required
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value)
//               }}
//               className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//               type="email"
//               placeholder='email@example.com'
//             />

//             <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

//             <input
//               className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value)
//               }}
//               required type="password"
//               placeholder='password'
//             />

//             <button
//               className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//             >Create account</button>

//           </form>
//           <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
//         </div>
//         <div>
//           <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
//             Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
//         </div>
//       </div>
//     </div >
//   )
// }

// export default UserSignup


import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { motion } from "framer-motion";

export default function UserSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const newUser = {
      fullname: { firstname: firstName, lastname: lastName },
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8"
      >
        <div className="flex justify-center mb-6">
          <img
            className="w-14"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
            alt="logo"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-1">
          Create your account
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Join us and get started today
        </p>

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input"
            />
            <input
              required
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input"
            />
          </div>

          <input
            required
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />

          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-2.5 font-medium hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

        <p className="text-[11px] text-gray-400 text-center mt-6 leading-snug">
          This site is protected by reCAPTCHA and the Google Privacy Policy and
          Terms of Service apply.
        </p>
      </motion.div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          padding: 0.6rem 0.75rem;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          font-size: 0.95rem;
        }
        .input:focus {
          outline: none;
          border-color: #111827;
          background: #fff;
        }
      `}</style>
    </div>
  );
}
