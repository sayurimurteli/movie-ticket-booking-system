// // import axios from 'axios'
// // import React, { useContext, useState } from 'react'
// // import { useForm } from 'react-hook-form'
// // import { Link, useNavigate } from 'react-router-dom'
// // import { toast } from 'react-toastify'
// // import 'react-toastify/dist/ReactToastify.css'
// // import { AuthContext } from '../context/AuthContext'

// // const Login = () => {
// // 	const navigate = useNavigate()
// // 	const { auth, setAuth } = useContext(AuthContext)
// // 	const [errorsMessage, setErrorsMessage] = useState('')
// // 	const [isLoggingIn, SetLoggingIn] = useState(false)

// // 	const {
// // 		register,
// // 		handleSubmit,
// // 		formState: { errors }
// // 	} = useForm()

// // 	const onSubmit = async (data) => {
// // 		SetLoggingIn(true)
// // 		try {
// // 			const response = await axios.post('/auth/login', data)
// // 			// console.log(response.data)
// // 			toast.success('Login successful!', {
// // 				position: 'top-center',
// // 				autoClose: 2000,
// // 				pauseOnHover: false
// // 			})
// // 			setAuth((prev) => ({ ...prev, token: response.data.token }))
// // 			navigate('/')
// // 		} catch (error) {
// // 			console.error(error.response.data)
// // 			setErrorsMessage(error.response.data)
// // 			toast.error('Error', {
// // 				position: 'top-center',
// // 				autoClose: 2000,
// // 				pauseOnHover: false
// // 			})
// // 		} finally {
// // 			SetLoggingIn(false)
// // 		}
// // 	}

// // 	const inputClasses = () => {
// // 		return 'appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500'
// // 	}

// // 	return (
// // 		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-500 py-12 px-4 sm:px-6 lg:px-8">
// // 			<div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-4 shadow-xl">
// // 				<div>
// // 					<h2 className="mt-4 text-center text-4xl font-extrabold text-gray-900">Login</h2>
// // 				</div>
// // 				<form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
// // 					<input
// // 						name="username"
// // 						type="text"
// // 						autoComplete="username"
// // 						{...register('username', { required: true })}
// // 						className={inputClasses`${errors.username ? 'border-red-500' : ''}`}
// // 						placeholder="Username"
// // 					/>
// // 					{errors.username && <span className="text-sm text-red-500">Username is required</span>}
// // 					<input
// // 						name="password"
// // 						type="password"
// // 						autoComplete="current-password"
// // 						{...register('password', { required: true })}
// // 						className={inputClasses`${errors.password ? 'border-red-500' : ''}`}
// // 						placeholder="Password"
// // 					/>
// // 					{errors.password && <span className="text-sm text-red-500">Password is required</span>}

// // 					<div>
// // 						{errorsMessage && <span className="text-sm text-red-500">{errorsMessage}</span>}
// // 						<button
// // 							type="submit"
// // 							className="mt-4 w-full rounded-md bg-blue-600 bg-gradient-to-br from-indigo-600 to-blue-500 py-2 px-4 font-medium text-white drop-shadow-md hover:bg-blue-700 hover:from-indigo-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-slate-500 disabled:to-slate-400"
// // 							disabled={isLoggingIn}
// // 						>
// // 							{isLoggingIn ? 'Processing...' : 'Login'}
// // 						</button>
// // 					</div>
// // 					<p className="text-right">
// // 						Don’t have an account?{' '}
// // 						<Link to={'/register'} className="font-bold text-blue-600">
// // 							Register here
// // 						</Link>
// // 					</p>
// // 				</form>
// // 			</div>
// // 		</div>
// // 	)
// // }

// // export default Login

// import axios from "axios";
// import React, { useContext, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { AuthContext } from "../context/AuthContext";

// const Login = () => {
//     const navigate = useNavigate();
//     const { auth, setAuth } = useContext(AuthContext);
//     const [errorsMessage, setErrorsMessage] = useState("");
//     const [isLoggingIn, setLoggingIn] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm();

//     const onSubmit = async (data) => {
//         setLoggingIn(true);
//         setErrorsMessage(""); // Clear previous errors

//         try {
//             const response = await axios.post("/auth/login", data, { withCredentials: true });

//             console.log("Login Response:", response.data); // Debugging log

//             toast.success("Login successful!", { position: "top-center", autoClose: 2000 });

//             setAuth((prev) => ({ ...prev, token: response.data.token }));
//             navigate("/");
//         } catch (error) {
//             console.error("Error Response:", error.response?.data);
//             setErrorsMessage(error.response?.data || "Invalid credentials. Please try again.");
//             toast.error(error.response?.data || "Error", { position: "top-center", autoClose: 2000 });
//         } finally {
//             setLoggingIn(false);
//         }
//     };

//     const inputClasses = "appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500";

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-500 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-4 shadow-xl">
//                 <div>
//                     <h2 className="mt-4 text-center text-4xl font-extrabold text-gray-900">Login</h2>
//                 </div>
//                 <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
//                     {/* Username Input */}
//                     <input
//                         name="username"
//                         type="text"
//                         autoComplete="username"
//                         {...register("username", { required: "Username is required" })}
//                         className={`${inputClasses} ${errors.username ? "border-red-500" : ""}`}
//                         placeholder="Username"
//                     />
//                     {errors.username && <span className="text-sm text-red-500">{errors.username.message}</span>}

//                     {/* Password Input */}
//                     <input
//                         name="password"
//                         type="password"
//                         autoComplete="current-password"
//                         {...register("password", { required: "Password is required" })}
//                         className={`${inputClasses} ${errors.password ? "border-red-500" : ""}`}
//                         placeholder="Password"
//                     />
//                     {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}

//                     {/* Error Message */}
//                     {errorsMessage && <span className="text-sm text-red-500">{errorsMessage}</span>}

//                     {/* Submit Button */}
//                     <button
//                         type="submit"
//                         className="mt-4 w-full rounded-md bg-blue-600 bg-gradient-to-br from-indigo-600 to-blue-500 py-2 px-4 font-medium text-white drop-shadow-md hover:bg-blue-700 hover:from-indigo-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-slate-500 disabled:to-slate-400"
//                         disabled={isLoggingIn}
//                     >
//                         {isLoggingIn ? "Processing..." : "Login"}
//                     </button>

//                     {/* Register Link */}
//                     <p className="text-right">
//                         Don’t have an account?{" "}
//                         <Link to={"/register"} className="font-bold text-blue-600">
//                             Register here
//                         </Link>
//                     </p>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Login;

import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [errorsMessage, setErrorsMessage] = useState("");
    const [isLoggingIn, setLoggingIn] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoggingIn(true);
        setErrorsMessage(""); // Clear previous errors

        try {
            const response = await axios.post("/auth/login", data, { withCredentials: true });

            console.log("Login Response:", response.data); // Debugging log

            toast.success("Login successful!", { position: "top-center", autoClose: 2000 });

            setAuth((prev) => ({ ...prev, token: response.data.token }));
            navigate("/");
        } catch (error) {
            console.error("Error Response:", error.response?.data);
            setErrorsMessage(error.response?.data || "Invalid credentials. Please try again.");
            toast.error(error.response?.data || "Error", { position: "top-center", autoClose: 2000 });
        } finally {
            setLoggingIn(false);
        }
    };

    const inputClasses = "appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500";

    return (
        <div className="flex min-h-screen items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/3d-cinema-theatre-seating-with-popcorn_23-2151005464.jpg?t=st=1741198053~exp=1741201653~hmac=d94f0e64ee36636bddcfcfb638ebef13145479371d673a1ab20a8f39f4fda5ac&w=2000')" }}>
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/10 backdrop-blur-lg p-6 shadow-xl border border-white/20">
                <div>
                    <h2 className="mt-4 text-center text-4xl font-extrabold text-white">Login</h2>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Username Input */}
                    <input
                        name="username"
                        type="text"
                        autoComplete="username"
                        {...register("username", { required: "Username is required" })}
                        className={`${inputClasses} bg-white/20 text-white placeholder-gray-300 border-gray-500 focus:border-red-500`}
                        placeholder="Username"
                    />
                    {errors.username && <span className="text-sm text-red-500">{errors.username.message}</span>}

                    {/* Password Input */}
                    <input
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        {...register("password", { required: "Password is required" })}
                        className={`${inputClasses} bg-white/20 text-white placeholder-gray-300 border-gray-500 focus:border-red-500`}
                        placeholder="Password"
                    />
                    {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}

                    {/* Error Message */}
                    {errorsMessage && <span className="text-sm text-red-500">{errorsMessage}</span>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="mt-4 w-full rounded-md bg-gradient-to-r from-red-600 to-blue-600 py-2 px-4 font-medium text-white drop-shadow-md hover:from-red-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-gray-500 disabled:to-gray-400"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? "Processing..." : "Login"}
                    </button>

                    {/* Register Link */}
                    <p className="text-right text-white">
                        Don’t have an account?{" "}
                        <Link to={"/register"} className="font-bold text-red-400 hover:text-red-500">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
