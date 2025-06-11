'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod/v4'

const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(6, { message: "password must be atleast 6 characters" })
})

export default function Login() {
    const router = useRouter();

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState<{ username: string | undefined, password: string | undefined }>({ username: "", password: "" });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {


        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))


        setErrors({ username: "", password: "" });
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const parse = loginSchema.safeParse(formData);
        if (!parse.success) {
            const fieldErrors = z.treeifyError(parse.error)
            setErrors({
                password: fieldErrors.properties?.password?.errors[0],
                username: fieldErrors.properties?.username?.errors[0],
            })
        }
        try {
            console.log(JSON.stringify(formData));
            const res = await fetch(`http://localhost:8080/api/user/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                })
            })
            const data = await res.json();
            if (!res.ok) {
                console.log("This is data", JSON.stringify(data));

                alert(data.message || "Registration failed")
                return;
            }

            console.log("This is data", JSON.stringify(data));
            router.push('/')
        } catch (error) {

            console.error("Error during registration ", error);
            alert("Unexpected Error Occured")
        }
        console.log(`email : ${formData.username}`);
        console.log(`password : ${formData.password}`);
    }


    return (
            <div className="min-h-screen  flex items-center justify-center text-black shadow-2xl px-4 bg-black">

                <div className='relative justify-center'>
                  <div className="absolute w-72 h-72 bg-pink-400 rounded-full  filter blur-xl opacity-50 animate-blob animation-delay-4000  bottom-10 "></div>
  <div className="absolute w-72 h-72 bg-yellow-400 rounded-full  filter blur-xl opacity-50 animate-blob  top-0  animation-delay-5000"></div>
  <div className="absolute w-72 h-72 bg-purple-400 rounded-full  filter blur-xl opacity-50 animate-blob animation-delay-2000  bottom-0"></div>

                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'linear' }}
                    className="p-8 rounded-2xl  w-full max-w-md z-0 bg-white/10  inset-ring-white inset-shadow-white inset-shadow-md "
                >
                    <h2 className="text-2xl mb-6 text-center text-white font-extrabold font-sans ">Login</h2>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>

                            <label className="block text-sm font-medium text-white">Username</label>
                            {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}

                            <input
                                onChange={handleChange}
                                value={formData.username}

                                type="username"
                                className="mt-1 w-full px-4 py-2 text-white  rounded-lg shadow-lg focus:outline-none border-none inset-ring-white inset-shadow-white inset-shadow-md focus:ring-2 focus:ring-indigo-500"
                                placeholder="username"
                                name='username'
                            />
                        </div>
                        <div>

                            <label className="block text-sm font-medium text-white">Password</label>
                            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}

                            <input
                                onChange={handleChange}
                                value={formData.password}
                                type="password"
                                name='password'
                                className="mt-1 w-full px-4 py-2 rounded-lg text-white shadow-lg focus:outline-none focus:ring-2 border-none inset-ring-white inset-shadow-white inset-shadow-md focus:ring-indigo-500"
                                placeholder="••••••••"
                            />

                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full inset-ring-white bg-blue-700  inset-shadow inset-shadow-white inset-shadow-md  cursor-pointer text-white py-2 rounded-lg font-medium hover:bg-800 transition"
                        >
                            Sign In
                        </motion.button>
                        <label className='flex justify-center  text-white space-x-1'>
                            <label htmlFor="">


                                New user?
                            </label>
                            <label className='text-blue-500  text-sm hover:underline font-bold cursor-pointer' onClick={() => router.push('/register')}>

                                Register Here
                            </label>
                        </label>
                    </form>
                </motion.div>

            </div>

    );
}
