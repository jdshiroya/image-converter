
"use client";

import { Box, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="w-full py-8 px-4 flex flex-col items-center justify-center text-center space-y-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex items-center justify-center"
      >
        <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full" />
        <div className="relative flex items-center gap-2 p-3 bg-secondary border border-border rounded-2xl shadow-xl">
          <div className="p-2 bg-primary rounded-lg text-primary-foreground">
            <Box size={24} />
          </div>
          <Zap className="text-accent" size={16} />
          <div className="p-2 bg-accent/20 rounded-lg text-accent">
            <Layers size={24} />
          </div>
        </div>
      </motion.div>
      
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          PNG2SVG Studio
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Convert PNG Images to Scalable SVG Instantly
        </p>
      </div>
    </header>
  );
}
