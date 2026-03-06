
"use client";

import { Download, Files, CheckCircle2, ChevronRight, FileCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileItem } from "./PreviewGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import JSZip from "jszip";

interface OutputSectionProps {
  items: FileItem[];
}

export function OutputSection({ items }: OutputSectionProps) {
  const completedItems = items.filter(item => item.status === 'completed' && item.svg);
  
  if (completedItems.length === 0) return null;

  const handleDownload = (item: FileItem) => {
    if (!item.svg) return;
    const blob = new Blob([item.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.file.name.replace('.png', '')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    completedItems.forEach((item) => {
      if (item.svg) {
        zip.file(`${item.file.name.replace('.png', '')}.svg`, item.svg);
      }
    });
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = "converted_svgs.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto px-4 mt-16 mb-24 space-y-8"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-lg text-accent">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Conversion Results</h2>
            <p className="text-sm text-muted-foreground">Generated {completedItems.length} vector files</p>
          </div>
        </div>
        <Button onClick={handleDownloadAll} variant="outline" className="gap-2 border-accent/20 hover:bg-accent/10 hover:text-accent">
          <Files size={18} />
          Download All (ZIP)
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {completedItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row items-center gap-6 p-6 bg-secondary/40 border border-border rounded-2xl group hover:bg-secondary/60 transition-colors"
          >
            <div className="w-32 h-32 flex-shrink-0 bg-white/5 rounded-xl p-2 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-accent/30 transition-colors">
              <div 
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: item.svg || '' }} 
              />
            </div>

            <div className="flex-grow space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <FileCode size={16} className="text-accent" />
                <h3 className="font-semibold text-lg">{item.file.name.replace('.png', '')}.svg</h3>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Raster Source: {(item.file.size / 1024).toFixed(1)} KB • Vector Target: {(new Blob([item.svg || '']).size / 1024).toFixed(1)} KB
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={() => handleDownload(item)} 
                variant="secondary" 
                size="lg"
                className="gap-2 rounded-xl"
              >
                <Download size={18} />
                Download SVG
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
