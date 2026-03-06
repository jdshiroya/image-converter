
"use client";

import { useDropzone } from "react-dropzone";
import { Upload, FileImage, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UploadZoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled: boolean;
  currentCount: number;
}

export function UploadZone({ onFilesAdded, disabled, currentCount }: UploadZoneProps) {
  const { toast } = useToast();
  const MAX_FILES = 5;
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === "file-invalid-type") {
        toast({ title: "Invalid File Type", description: "Only PNG images are allowed.", variant: "destructive" });
      } else if (error.code === "file-too-large") {
        toast({ title: "File Too Large", description: "Image must be smaller than 10MB.", variant: "destructive" });
      } else {
        toast({ title: "Upload Error", description: error.message, variant: "destructive" });
      }
      return;
    }

    if (currentCount + acceptedFiles.length > MAX_FILES) {
      toast({ title: "Limit Exceeded", description: `Maximum ${MAX_FILES} images allowed.`, variant: "destructive" });
      return;
    }

    onFilesAdded(acceptedFiles);
  }, [onFilesAdded, currentCount, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'] },
    maxFiles: MAX_FILES - currentCount,
    maxSize: MAX_SIZE,
    disabled: disabled || currentCount >= MAX_FILES,
  });

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer
          flex flex-col items-center justify-center text-center gap-4
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-secondary/50 hover:bg-secondary'}
          ${(disabled || currentCount >= MAX_FILES) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
          <Upload size={32} />
        </div>
        
        <div className="space-y-2">
          <p className="text-xl font-medium">
            {isDragActive ? "Drop the images here" : "Click or drag images to upload"}
          </p>
          <p className="text-sm text-muted-foreground">
            PNG format only • Max 10MB per file
          </p>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/50 px-3 py-1 rounded-full border border-border">
            <FileImage size={14} />
            <span>{currentCount} / {MAX_FILES} images</span>
          </div>
          {currentCount >= MAX_FILES && (
            <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 px-3 py-1 rounded-full">
              <AlertCircle size={14} />
              <span>Limit reached</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
