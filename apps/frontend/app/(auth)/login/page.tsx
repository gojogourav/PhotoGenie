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
        }catch(error){
            
            console.error("Error during registration ",error);
            alert("Unexpected Error Occured")
        }
        console.log(`email : ${formData.username}`);
        console.log(`password : ${formData.password}`);
    }


    return (
        <div className="min-h-screen bg-[url('/bg.jpeg')] bg-no-repeat bg-cover bg-center flex items-center justify-center text-black shadow-2xl px-4 bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'linear' }}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center text-black">Login</h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>

                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}

                        <input
                            onChange={handleChange}
                            value={formData.username}

                            type="username"
                            className="mt-1 w-full px-4 py-2  border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="username"
                            name='username'
                        />
                    </div>
                    <div>

                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}

                        <input
                            onChange={handleChange}
                            value={formData.password}
                            type="password"
                            name='password'
                            className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••••"
                        />

                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-blue-700 cursor-pointer text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                        Sign In
                    </motion.button>
                    <label className='flex justify-center text-gray-700 space-x-1'>
                        <label htmlFor="">


                            New user?
                        </label>
                        <label className='text-blue-700  text-sm hover:underline font-bold cursor-pointer' onClick={() => router.push('/register')}>

                            Register Here
                        </label>
                    </label>
                </form>
            </motion.div>

        </div>
    );
}
