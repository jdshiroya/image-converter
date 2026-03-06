"use client";

import { X, Settings2, Trash2, ImageIcon, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageFormat } from "@/lib/converter";

export interface FileItem {
  id: string;
  file: File;
  preview: string;
  width: number;
  height: number;
  status: 'idle' | 'converting' | 'completed' | 'error';
  result?: string;
  fromFormat: ImageFormat;
  toFormat: ImageFormat;
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
            <Card className="overflow-hidden border-border bg-secondary/30 backdrop-blur-sm group h-full flex flex-col">
              <div className="relative aspect-video bg-muted/10 flex items-center justify-center overflow-hidden border-b border-border/50">
                <img 
                  src={item.preview} 
                  alt={item.file.name} 
                  className="max-h-[90%] max-w-[90%] object-contain transition-transform group-hover:scale-105"
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
                  <div className="absolute inset-0 bg-accent/10 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Converted
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-4 flex-grow flex flex-col space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-semibold text-sm truncate flex-grow" title={item.file.name}>
                      {item.file.name}
                    </p>
                    <ImageIcon className="text-muted-foreground shrink-0" size={14} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono uppercase">
                    <span>{item.fromFormat}</span>
                    <ArrowRight size={10} className="text-primary" />
                    <span className="text-accent font-bold">{item.toFormat}</span>
                    <span className="ml-auto">{(item.file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                {item.toFormat === 'svg' && (
                  <div className="space-y-4 pt-4 border-t border-border/50 mt-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings2 size={12} className="text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Vector Settings</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label className="text-[9px] uppercase font-bold text-muted-foreground">Colors</Label>
                          <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 rounded">{item.width}</span>
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
                        <div className="flex justify-between items-center">
                          <Label className="text-[9px] uppercase font-bold text-muted-foreground">Precision</Label>
                          <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 rounded">{item.height}%</span>
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
                )}

                {item.toFormat !== 'svg' && (
                  <div className="pt-4 border-t border-border/50 mt-auto">
                    <p className="text-[10px] text-muted-foreground text-center italic">
                      Standard raster conversion applied.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
