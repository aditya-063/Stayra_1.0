"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, CheckCircle, ExternalLink } from 'lucide-react';

function RedirectContent() {
    const searchParams = useSearchParams();
    const ota = searchParams.get('ota') || 'Partner';
    const url = searchParams.get('url');

    // Decoding nested URL if needed, usually simple param get is enough
    const targetUrl = url ? decodeURIComponent(url) : '#';

    const [processStep, setProcessStep] = useState(0);

    useEffect(() => {
        // Step 1: Validating (0-1.5s)
        const t1 = setTimeout(() => setProcessStep(1), 1500);
        // Step 2: Confirming (1.5s-2.5s)
        const t2 = setTimeout(() => setProcessStep(2), 2500);
        // Step 3: Redirecting (3.5s)
        const t3 = setTimeout(() => {
            if (targetUrl && targetUrl !== '#') {
                window.location.href = targetUrl;
            }
        }, 3500);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [targetUrl]);

    const steps = [
        { label: "Verifying Availability", icon: ShieldCheck },
        { label: "Securing Rate", icon: Lock },
        { label: `Connecting to ${ota}`, icon: ExternalLink }
    ];

    return (
        <div className="min-h-screen bg-[#f8f6f2] flex items-center justify-center p-4">
            {/* Background Mesh (Same as Global) */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#4a044e]/10 to-transparent" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-3d glass-3d-main rounded-[2.5rem] p-10 relative overflow-hidden text-center"
            >
                <div className="mb-8 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center relative">
                        {processStep < 2 ? (
                            <div className="absolute inset-0 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-green-500 rounded-full p-2">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </motion.div>
                        )}
                        <span className="text-2xl font-black text-white">S</span>
                    </div>
                </div>

                <h2 className="text-2xl font-black text-white mb-2">Redirecting you to {ota}</h2>
                <p className="text-white/60 text-sm font-medium mb-10">Please do not close this window.</p>

                <div className="space-y-4 text-left">
                    {steps.map((step, idx) => {
                        const isComplete = processStep > idx;
                        const isCurrent = processStep === idx;
                        const isCommon = idx <= processStep;

                        return (
                            <div key={idx} className={`flex items-center gap-4 transition-all duration-500 ${isCommon ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isComplete ? 'bg-green-500' : isCurrent ? 'bg-white text-[#4a044e]' : 'bg-white/10 text-white'}`}>
                                    {isComplete ? <CheckCircle className="w-4 h-4 text-white" /> : <step.icon className="w-4 h-4" />}
                                </div>
                                <span className="font-bold text-white tracking-wide text-sm">{step.label}</span>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-center gap-2 opacity-50">
                    <Lock className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-black tracking-widest">256-Bit SSL Secured Handshake</span>
                </div>
            </motion.div>
        </div>
    );
}

export default function RedirectPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RedirectContent />
        </Suspense>
    )
}
