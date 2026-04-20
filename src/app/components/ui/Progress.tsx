import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  color?: "rose" | "green";
}

export function Progress({ value, className, color = "green" }: ProgressProps) {
  const isRose = color === "rose";
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-100", className)}>
      <motion.div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          isRose ? "bg-[#A7738B]" : "bg-[#A3B096]"
        )}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}
