'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod/v4'

const registerSchema = z.object({
    email: z.string().email().nonempty(),
    username: z.string().toLowerCase().max(10).min(4).nonempty(),
    password: z.string().max(20).min(4).nonempty(),
    name: z.string().nonempty(),
})

export default function Register() {
    const router = useRouter();

    const [formData, setFormData] = useState({ email: "", password: "", username: "", name: "" ,password2:""});
    const [errors, setErrors] = useState<{ email: string | undefined, password: string | undefined, username: string | undefined, name: string | undefined }>({ email: "", password: "", username: "", name: "" });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

        setErrors({ email: "", password: "", username: "", name: "" });
    }
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const parse = registerSchema.safeParse(formData);
        if (!parse.success) {
            const fieldErrors = z.treeifyError(parse.error)
            setErrors({
                email: fieldErrors.properties?.email?.errors[0],
                password: fieldErrors.properties?.password?.errors[0],
                username: fieldErrors.properties?.username?.errors[0],
                name: fieldErrors.properties?.name?.errors[0],
            })
        }
        try{
            console.log(JSON.stringify(formData));
            const res = await fetch(`http://localhost:8080/api/user/register`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({
                    username:formData.username,
                    password:formData.password,
                    email:formData.email,
                    name:formData.name
                })
            })
            const data = await res.json();
            if(!res.ok){
                console.log("This is data",JSON.stringify(data));

                alert(data.message||"Registration failed")
                return;
            }

            console.log("This is data",JSON.stringify(data));
            router.push('/')            
        }catch(error){
            
            console.error("Error during registration ",error);
            alert("Unexpected Error Occured")
        }
        console.log(`email : ${formData.email}`);
        console.log(`password : ${formData.password}`);
    }
    return (
        <div className="min-h-screen bg-[url('/bg.jpeg')] bg-no-repeat bg-cover bg-center flex items-center justify-center text-black shadow-2xl px-4 bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'linear' }}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center text-black">Register</h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        <input
                            onChange={handleChange}
                            value={formData.name}
                            type="name"
                            className="mt-1 w-full px-4 py-2  border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Name"
                            name='name'
                        />
                    </div>
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
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                        <input
                            onChange={handleChange}
                            value={formData.email}

                            type="email"
                            className="mt-1 w-full px-4 py-2  border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="you@example.com"
                            name='email'
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                        <input
                            onChange={handleChange}
                            value={formData.password2}
                            type="password"
                            name='password2'
                            className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                                    ${formData.password2.length>0  ?
                                        formData.password===formData.password2?
                                        "focus:ring-green-500 border-green-400":
                                        "focus:ring-red-500 border-red-400"
                                        : "focus:ring-indigo-500"
                                    }`}
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
                            Already a user?
                        </label>
                        <label className='text-blue-700  text-sm hover:underline font-bold cursor-pointer' onClick={() => router.push('/login')}>
                            Login Here
                        </label>
                    </label>
                </form>
            </motion.div>
        </div>
    );
}
