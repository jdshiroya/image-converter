"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { PreviewGrid, FileItem } from "@/components/PreviewGrid";
import { OutputSection } from "@/components/OutputSection";
import { FormatSelector } from "@/components/FormatSelector";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, Wand2, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { convertImage, ImageFormat } from "@/lib/converter";

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fromFormat, setFromFormat] = useState<ImageFormat>("png");
  const [toFormat, setToFormat] = useState<ImageFormat>("svg");
  
  const { toast } = useToast();

  const addFiles = (newFiles: File[]) => {
    const newItems: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      width: 16,
      height: 1,
      status: 'idle',
      fromFormat,
      toFormat
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
    
    if (fromFormat === toFormat) {
      toast({ 
        title: "Format Conflict", 
        description: "Source and target formats cannot be the same.", 
        variant: "destructive" 
      });
      return;
    }

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

        const result = await convertImage(dataUrl, toFormat, {
          numberofcolors: item.width,
          ltres: item.height,
          qtres: item.height,
        });

        updateFile(item.id, { status: 'completed', result });
        completed++;
        setProgress(Math.round((completed / total) * 100));
      }
      toast({ title: "Conversion Successful", description: `Successfully processed ${files.length} images.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Conversion Failed", description: "Something went wrong during the conversion.", variant: "destructive" });
    } finally {
      setIsConverting(false);
    }
  };

  const handleFromFormatChange = (val: ImageFormat) => {
    if (files.length > 0) {
      toast({ 
        title: "Queue Cleared", 
        description: "Changing source format requires re-uploading compatible files.",
        variant: "destructive"
      });
      clearAll();
    }
    setFromFormat(val);
  };

  const handleToFormatChange = (val: ImageFormat) => {
    setToFormat(val);
    setFiles(prev => prev.map(item => ({ ...item, toFormat: val, status: 'idle' })));
  };

  const isSameFormat = fromFormat === toFormat;

  return (
    <main className="flex-grow flex flex-col items-center">
      <Header />
      
      <div className="w-full max-w-4xl px-4 space-y-10 pb-20">
        <FormatSelector 
          fromFormat={fromFormat}
          toFormat={toFormat}
          onFromChange={handleFromFormatChange}
          onToChange={handleToFormatChange}
          disabled={isConverting}
        />

        <UploadZone 
          onFilesAdded={addFiles} 
          disabled={isConverting} 
          currentCount={files.length}
          fromFormat={fromFormat}
        />

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-secondary/20 border border-border/50 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Batch Processing Queue</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-bold">
                      {fromFormat} <span className="text-primary mx-1">→</span> {toFormat}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive gap-2 text-xs"
                    onClick={clearAll}
                    disabled={isConverting}
                  >
                    <Trash2 size={14} />
                    Clear Queue
                  </Button>
                  <Button
                    size="lg"
                    className="gap-2 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg shadow-accent/20"
                    onClick={convertAll}
                    disabled={isConverting || isSameFormat}
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 size={20} />
                        Convert All
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isSameFormat && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs">
                  <AlertTriangle size={16} />
                  <span>Source and target formats cannot be the same. Please adjust the settings.</span>
                </div>
              )}

              {isConverting && (
                <div className="space-y-2 px-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Overall Progress</span>
                    <span className="text-primary font-mono">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-secondary" />
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
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
          &copy; {new Date().getFullYear()} PNG2SVG Studio • Client-Side Processing • No Server Uploads
        </p>
      </footer>
    </main>
  );
}
