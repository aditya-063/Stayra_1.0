"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
    return (
        <main className="min-h-screen relative">
            <Navbar />

            <div className="min-h-screen flex items-center justify-center px-4 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md glass-3d rounded-[3rem] overflow-hidden p-8 md:p-12 relative"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a044e] to-yellow-400" />

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-[#4a044e] tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-neutral-500 font-medium">Access your exclusive member rates.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Password</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="text-xs font-bold text-[#4a044e] hover:underline">Forgot password?</a>
                        </div>

                        <button type="button" className="w-full bg-[#4a044e] text-white h-16 rounded-2xl font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-[#4a044e]/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <span>Sign In</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-black/5 text-center">
                        <p className="text-sm font-bold text-neutral-400">
                            Don't have an account? <a href="#" className="text-[#4a044e] hover:underline">Join Stayra</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
