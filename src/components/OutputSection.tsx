"use client";

import { Download, Files, CheckCircle2, FileCode, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileItem } from "./PreviewGrid";
import JSZip from "jszip";

interface OutputSectionProps {
  items: FileItem[];
}

export function OutputSection({ items }: OutputSectionProps) {
  const completedItems = items.filter(item => item.status === 'completed' && item.result);
  
  if (completedItems.length === 0) return null;

  const getExtension = (format: string) => `.${format}`;

  const handleDownload = (item: FileItem) => {
    if (!item.result) return;
    
    let url = item.result;
    if (item.toFormat === 'svg') {
      const blob = new Blob([item.result], { type: 'image/svg+xml' });
      url = URL.createObjectURL(blob);
    }
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.file.name.split('.').slice(0, -1).join('.')}${getExtension(item.toFormat)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    if (item.toFormat === 'svg') URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    
    for (const item of completedItems) {
      if (item.result) {
        const fileName = `${item.file.name.split('.').slice(0, -1).join('.')}${getExtension(item.toFormat)}`;
        
        if (item.toFormat === 'svg') {
          zip.file(fileName, item.result);
        } else {
          // Convert dataURL to Blob for ZIP
          const res = await fetch(item.result);
          const blob = await res.blob();
          zip.file(fileName, blob);
        }
      }
    }
    
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = "converted_images.zip";
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
            <p className="text-sm text-muted-foreground">Generated {completedItems.length} converted files</p>
          </div>
        </div>
        <Button onClick={handleDownloadAll} variant="outline" className="gap-2 border-accent/20 hover:bg-accent/10 hover:text-accent">
          <Files size={18} />
          Download All (ZIP)
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {completedItems.map((item) => {
          const isSvg = item.toFormat === 'svg';
          const fileName = `${item.file.name.split('.').slice(0, -1).join('.')}${getExtension(item.toFormat)}`;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col md:flex-row items-center gap-6 p-6 bg-secondary/30 border border-border rounded-2xl group hover:bg-secondary/50 transition-colors"
            >
              <div className="w-24 h-24 flex-shrink-0 bg-white/5 rounded-xl p-2 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-accent/30 transition-colors">
                {isSvg ? (
                  <div 
                    className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
                    dangerouslySetInnerHTML={{ __html: item.result || '' }} 
                  />
                ) : (
                  <img src={item.result} alt={fileName} className="max-w-full max-h-full object-contain" />
                )}
              </div>

              <div className="flex-grow space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  {isSvg ? <FileCode size={16} className="text-accent" /> : <ImageIcon size={16} className="text-accent" />}
                  <h3 className="font-semibold text-lg">{fileName}</h3>
                </div>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                  {item.fromFormat} <span className="text-primary mx-1">→</span> {item.toFormat}
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
                  Download
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
