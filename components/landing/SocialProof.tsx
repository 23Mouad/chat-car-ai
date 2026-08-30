"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Activity } from "lucide-react";
import { useLang } from "@/lib/langContext";

/** Animated number that smoothly counts up/down to a target */
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
      if (count >= steps) {
        setDisplayed(value);
        clearInterval(timer);
      }
    }, 40);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className="tabular-nums">{displayed.toLocaleString()}</span>;
}

export function SocialProof() {
  const { t } = useLang();
  const s = t.socialProof;

  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    function connect() {
      es = new EventSource("/api/stats");

      es.onopen = () => setConnected(true);

      es.onmessage = (event) => {
        try {
          const { active, total } = JSON.parse(event.data) as {
            active: number;
            total: number;
          };
          setActiveUsers(active);
          setTotalVisits(total);
        } catch {
          // ignore malformed frames
        }
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        // Auto-reconnect after 5 s
        retryTimeout = setTimeout(connect, 5_000);
      };
    }

    connect();

    return () => {
      clearTimeout(retryTimeout);
      es?.close();
    };
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
                <div
                  key={n}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.pravatar.cc/100?img=${n}`}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
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

          {/* Right: Live Stats */}
          <div className="flex w-full md:w-auto items-center justify-around md:justify-end gap-8">
            {/* Active Right Now */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-[#2ECC71]/10 flex items-center justify-center">
                <AnimatePresence>
                  {connected && (
                    <motion.span
                      key="ping"
                      className="absolute w-full h-full rounded-full bg-[#2ECC71]/30"
                      animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>
                <Activity className="w-4.5 h-4.5 text-[#2ECC71]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#14142B]">
                    {activeUsers !== null ? (
                      <AnimatedNumber value={activeUsers} />
                    ) : (
                      <span className="inline-block w-8 h-5 bg-[#E8E8F8] rounded animate-pulse" />
                    )}
                  </span>
                  {connected && (
                    <span className="w-2 h-2 rounded-full bg-[#2ECC71] shadow-[0_0_8px_rgba(46,204,113,0.8)]" />
                  )}
                </div>
                <span className="text-[11px] font-semibold text-[#7B7B90] uppercase tracking-wider whitespace-nowrap">
                  {s.activeNow}
                </span>
              </div>
            </div>

            {/* Total Visits */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6C7CFF]/10 flex items-center justify-center">
                <Users className="w-4.5 h-4.5 text-[#6C7CFF]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#14142B]">
                  {totalVisits !== null ? (
                    <AnimatedNumber value={totalVisits} />
                  ) : (
                    <span className="inline-block w-16 h-5 bg-[#E8E8F8] rounded animate-pulse" />
                  )}
                </span>
                <span className="text-[11px] font-semibold text-[#7B7B90] uppercase tracking-wider whitespace-nowrap">
                  {s.totalVisits}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
