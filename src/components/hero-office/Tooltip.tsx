"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { OfficeObject } from "@/types/office";

type TooltipProps = {
  object: OfficeObject | null;
};

export function Tooltip({ object }: TooltipProps) {
  return (
    <AnimatePresence>
      {object ? (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-none absolute left-1/2 top-[18%] z-20 -translate-x-1/2 rounded-full border border-white/70 bg-white/65 px-4 py-2 text-sm font-medium text-graphite shadow-glass backdrop-blur-xl sm:top-[15%]"
        >
          {object.tooltipLabel ?? `${object.label} · ${object.title}`}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
