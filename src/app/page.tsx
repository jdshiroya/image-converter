
"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { PreviewGrid, FileItem } from "@/components/PreviewGrid";
import { OutputSection } from "@/components/OutputSection";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, Wand2, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { convertImageToSvg } from "@/lib/converter";

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const addFiles = (newFiles: File[]) => {
    const newItems: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      width: 16, // number of colors for imagetracer
      height: 1, // line filter weight or precision
      status: 'idle'
    }));
    setFiles(prev => [...prev, ...newItems]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const item = prev.find(i => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  const updateFile = (id: string, updates: Partial<FileItem>) => {
    setFiles(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const clearAll = () => {
    files.forEach(item => URL.revokeObjectURL(item.preview));
    setFiles([]);
    setProgress(0);
  };

  const convertAll = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    setProgress(0);

    const total = files.length;
    let completed = 0;

    try {
      for (const item of files) {
        if (item.status === 'completed') {
          completed++;
          setProgress(Math.round((completed / total) * 100));
          continue;
        }

        updateFile(item.id, { status: 'converting' });

        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(item.file);
        });

        const svg = await convertImageToSvg(dataUrl, {
          numberofcolors: item.width,
          ltres: item.height,
          qtres: item.height,
        });

        updateFile(item.id, { status: 'completed', svg });
        completed++;
        setProgress(Math.round((completed / total) * 100));
      }
      toast({ title: "Conversion Successful", description: `Successfully converted ${files.length} images.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Conversion Failed", description: "Something went wrong during the process.", variant: "destructive" });
    } finally {
      setIsConverting(false);
    }
  };

  const hasConversionStarted = files.some(f => f.status === 'completed');

  return (
    <main className="flex-grow flex flex-col items-center">
      <Header />
      
      <div className="w-full max-w-4xl px-4 space-y-8 pb-20">
        <UploadZone 
          onFilesAdded={addFiles} 
          disabled={isConverting} 
          currentCount={files.length} 
        />

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-secondary/30 border border-border rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Conversion Controls</h3>
                    <p className="text-xs text-muted-foreground">Adjust settings per image or start batch process</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive gap-2"
                    onClick={clearAll}
                    disabled={isConverting}
                  >
                    <Trash2 size={16} />
                    Clear All
                  </Button>
                  <Button
                    size="lg"
                    className="gap-2 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg shadow-accent/20"
                    onClick={convertAll}
                    disabled={isConverting}
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Wand2 size={20} />
                        Convert to SVG
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isConverting && (
                <div className="space-y-2 px-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Processing Queue</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-secondary" />
                </div>
              )}

              <PreviewGrid 
                items={files} 
                onRemove={removeFile} 
                onUpdate={updateFile} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <OutputSection items={files} />

      <footer className="w-full py-8 mt-auto border-t border-border/50 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} PNG2SVG Studio • Processing is 100% private & client-side
        </p>
      </footer>
    </main>
  );
}
