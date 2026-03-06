
"use client";

import { X, Settings2, Trash2, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export interface FileItem {
  id: string;
  file: File;
  preview: string;
  width: number;
  height: number;
  status: 'idle' | 'converting' | 'completed' | 'error';
  svg?: string;
}

interface PreviewGridProps {
  items: FileItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FileItem>) => void;
}

export function PreviewGrid({ items, onRemove, onUpdate }: PreviewGridProps) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-4 mt-8">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
          >
            <Card className="overflow-hidden border-border bg-secondary/30 backdrop-blur-sm group">
              <div className="relative aspect-video bg-muted/20 flex items-center justify-center overflow-hidden">
                <img 
                  src={item.preview} 
                  alt={item.file.name} 
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 size={14} />
                </Button>
                {item.status === 'completed' && (
                  <div className="absolute inset-0 bg-accent/20 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                      Ready
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="overflow-hidden">
                    <p className="font-medium text-sm truncate">{item.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(item.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <ImageIcon className="text-muted-foreground shrink-0" size={16} />
                </div>

                <div className="space-y-4 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings2 size={14} className="text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">Adjustment</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <Label className="text-[10px] uppercase text-muted-foreground">Colors</Label>
                        <span className="text-[10px] font-mono">{item.width}</span>
                      </div>
                      <Slider
                        value={[item.width]}
                        min={2}
                        max={32}
                        step={1}
                        onValueChange={([val]) => onUpdate(item.id, { width: val })}
                        className="py-1"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <Label className="text-[10px] uppercase text-muted-foreground">Precision</Label>
                        <span className="text-[10px] font-mono">{item.height}%</span>
                      </div>
                      <Slider
                        value={[item.height]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={([val]) => onUpdate(item.id, { height: val })}
                        className="py-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
