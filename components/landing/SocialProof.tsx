"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { useLang } from "@/lib/langContext";

/** Smoothly animates a number changing */
function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);

  useEffect(() => {
    if (displayed === value) return;
    const diff = value - displayed;
    const steps = Math.min(Math.abs(diff), 20);
    const stepSize = diff / steps;
    let current = displayed;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      current += stepSize;
      setDisplayed(Math.round(current));
      if (count >= steps) { setDisplayed(value); clearInterval(timer); }
    }, 40);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className="tabular-nums">{displayed}</span>;
}

export function SocialProof() {
  const { t } = useLang();
  const s = t.socialProof;

  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Pusher
    import("pusher-js").then(({ default: Pusher }) => {
      // Initialize Pusher
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: "/api/pusher/auth",
      });

      // Presence channels must be prefixed with 'presence-'
      const channel = pusher.subscribe("presence-site-visitors");

      // When successfully subscribed, we get the initial member list
      channel.bind("pusher:subscription_succeeded", (members: any) => {
        setActiveUsers(members.count);
        setConnected(true);
      });

      // When a new user connects
      channel.bind("pusher:member_added", () => {
        setActiveUsers((prev) => (prev ? prev + 1 : 1));
      });

      // When a user disconnects
      channel.bind("pusher:member_removed", () => {
        setActiveUsers((prev) => (prev ? Math.max(0, prev - 1) : 0));
      });

      // Cleanup on unmount
      return () => {
        pusher.unsubscribe("presence-site-visitors");
        pusher.disconnect();
      };
    });
  }, []);

  return (
    <section className="relative z-20 mb-16 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(108,124,255,0.08)]"
        >
          {/* Left: Avatars + Trusted By */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[33, 12, 47, 28].map((n) => (
                <div key={n} className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.pravatar.cc/100?img=${n}`} alt="User avatar" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-[#6C7CFF] to-[#C86CFF] flex items-center justify-center text-white text-xs font-bold">
                10k+
              </div>
            </div>
            <p className="text-sm font-semibold text-[#14142B] max-w-[160px] leading-tight">
              {s.trusted}
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-12 bg-[#E8E8F8]" />
          <div className="block md:hidden w-full h-px bg-[#E8E8F8]" />

          {/* Right: Live active users only */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full bg-[#2ECC71]/10 flex items-center justify-center">
              <AnimatePresence>
                {connected && (
                  <motion.span
                    key="ping"
                    className="absolute inset-0 rounded-full bg-[#2ECC71]/30"
                    animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </AnimatePresence>
              <Activity className="w-5 h-5 text-[#2ECC71]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#14142B]">
                  {activeUsers !== null ? (
                    <AnimatedNumber value={activeUsers} />
                  ) : (
                    <span className="inline-block w-8 h-7 bg-[#E8E8F8] rounded animate-pulse align-middle" />
                  )}
                </span>
                {/* Live indicator dot */}
                {connected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71] shadow-[0_0_10px_rgba(46,204,113,0.9)] flex-shrink-0" />
                )}
              </div>
              <span className="text-[11px] font-semibold text-[#7B7B90] uppercase tracking-wider whitespace-nowrap">
                {s.activeNow}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
