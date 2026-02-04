"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { User, Menu, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    return (
        <motion.nav
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4",
                isScrolled ? "py-3" : "py-6"
            )}
        >
            <motion.div
                layout
                className={cn(
                    "mx-auto max-w-7xl flex items-center justify-between transition-all duration-500",
                    isScrolled
                        ? "bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-full px-6 py-3"
                        : "bg-transparent px-0"
                )}
            >
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4a044e] to-[#2e0231] border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative overflow-hidden">
                        <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-20 transition-opacity" />
                        <span className="text-gold font-black text-xs relative z-10">S</span>
                    </div>
                    <span className={cn(
                        "font-black text-xl tracking-tight transition-colors bg-clip-text text-transparent bg-gradient-to-r from-[#4a044e] to-[#701a75]",
                        isScrolled ? "" : ""
                    )}>
                        STAYRA
                    </span>
                </div>

                {/* Center Links (Desktop) */}
                <div className="hidden md:flex items-center gap-8">
                    {["Stays", "Flights", "Packages", "Deals"].map((item, i) => (
                        <a
                            key={item}
                            href="#"
                            className={cn(
                                "text-sm font-bold transition-all hover:scale-105",
                                i === 0 ? "text-[#4a044e]" : "text-neutral-500 hover:text-[#b45309]"
                            )}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-black/5 transition-colors relative">
                        <Bell className="w-5 h-5 text-neutral-600" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </button>

                    <div className="flex items-center gap-3 pl-2 border-l border-neutral-200">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-xs font-black text-neutral-800">Aditya</span>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Member</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4a044e] to-[#a21caf] flex items-center justify-center text-white shadow-md cursor-pointer hover:shadow-lg transition-all">
                            <User className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.nav>
    );
};
