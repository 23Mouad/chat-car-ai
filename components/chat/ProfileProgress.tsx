"use client";

import { motion } from "framer-motion";
import type { UserProfile } from "@/types/chat";

interface ProfileProgressProps {
  profile: Partial<UserProfile>;
}

const FIELDS: (keyof UserProfile)[] = ["name", "age", "country", "gender"];

export function ProfileProgress({ profile }: ProfileProgressProps) {
  const filled = FIELDS.filter((f) => !!profile[f]).length;

  if (filled === FIELDS.length) return null;

  return (
    <div className="flex items-center gap-1" title={`Profile: ${filled}/4 collected`} aria-label={`${filled} of 4 profile fields collected`}>
      {FIELDS.map((field, i) => (
        <motion.div
          key={field}
          className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
            profile[field]
              ? "bg-gradient-to-r from-[#6C7CFF] to-[#C86CFF]"
              : "bg-[#D0D0E8]"
          }`}
          animate={profile[field] ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        />
      ))}
    </div>
  );
}
