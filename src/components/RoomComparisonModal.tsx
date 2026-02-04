"use client";

import React from "react";
import { X, Info, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface RoomComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotel: {
        canonicalName: string;
        primaryImageUrl: string;
        roomOptions: {
            type: string;
            prices: {
                ota: string;
                totalPrice: number;
                currency: string;
                deepLink: string;
            }[];
        }[];
    } | null;
}

export const RoomComparisonModal = ({ isOpen, onClose, hotel }: RoomComparisonModalProps) => {
    if (!hotel) return null;

    // Get unique OTAs for columns
    const otas: string[] = Array.from(new Set(hotel.roomOptions.flatMap((r: any) => r.prices.map((p: any) => p.ota))));

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 30, stiffness: 350 }}
                        className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl rounded-[2.5rem] bg-white/80 border border-white/40"
                    >
                        {/* Header with Image */}
                        <div className="relative h-64 md:h-80 shrink-0 group">
                            <img
                                src={hotel.primaryImageUrl}
                                className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-1000"
                                alt={hotel.canonicalName}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#4a044e]/90 via-transparent to-transparent" />

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-yellow-400 text-[#4a044e] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-yellow-400/20">
                                        <Sparkles className="w-3 h-3 fill-current" />
                                        Exclusive Rates
                                    </div>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-lg">{hotel.canonicalName}</h2>
                            </div>
                        </div>

                        {/* Comparison Table Section */}
                        <div className="flex-1 overflow-auto p-8 relative bg-white/50 backdrop-blur-3xl">
                            <div className="flex items-center gap-3 mb-6 opacity-60">
                                <Info className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Compare & Save</span>
                            </div>

                            <div className="overflow-x-auto rounded-[2rem] border border-white/50 shadow-sm bg-white/40">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/50 border-b border-black/5">
                                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-[#4a044e]/60">Room Type</th>
                                            {otas.map(ota => (
                                                <th key={ota} className="px-6 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-center text-[#4a044e]/60 border-l border-black/5">
                                                    {ota}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5">
                                        {hotel.roomOptions.map((room, idx) => (
                                            <tr key={idx} className="hover:bg-white/60 transition-colors">
                                                <td className="px-8 py-8">
                                                    <span className="text-[#4a044e] font-black text-lg block">{room.type}</span>
                                                    <span className="text-neutral-500 text-xs font-bold mt-1 block">Includes Taxes & Fees</span>
                                                </td>
                                                {otas.map(ota => {
                                                    const priceData = room.prices.find(p => p.ota === ota);
                                                    const allPrices = room.prices.map(p => p.totalPrice);
                                                    const minPrice = Math.min(...allPrices);
                                                    const isCheapest = priceData?.totalPrice === minPrice;

                                                    return (
                                                        <td key={ota} className="px-4 py-6 border-l border-black/5 align-middle">
                                                            {priceData ? (
                                                                <div className="flex flex-col items-center">
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        onClick={() => window.open(priceData.deepLink, '_blank')}
                                                                        className={cn(
                                                                            "relative w-full max-w-[140px] py-4 rounded-2xl flex flex-col items-center justify-center transition-all border",
                                                                            isCheapest
                                                                                ? "bg-[#4a044e] border-[#4a044e] text-white shadow-xl shadow-[#4a044e]/30"
                                                                                : "bg-white border-neutral-200 text-neutral-600 hover:border-[#4a044e]/30"
                                                                        )}
                                                                    >
                                                                        <span className="text-lg font-black tracking-tight">
                                                                            ₹{priceData.totalPrice.toLocaleString()}
                                                                        </span>
                                                                        {isCheapest && (
                                                                            <div className="absolute -top-3 bg-green-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm tracking-wide">
                                                                                Best Deal
                                                                            </div>
                                                                        )}
                                                                    </motion.button>
                                                                </div>
                                                            ) : (
                                                                <div className="text-center opacity-30 font-bold text-xs uppercase">Sold Out</div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-white/60 border-t border-white/50 backdrop-blur-xl flex justify-between items-center shrink-0">
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2 text-[#4a044e]/70">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Secure</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#4a044e]/70">
                                    <Zap className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Instant</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
