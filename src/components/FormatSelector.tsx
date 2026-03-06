"use client";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, FileDown, FileUp } from "lucide-react";
import { ImageFormat } from "@/lib/converter";

interface FormatSelectorProps {
  fromFormat: ImageFormat;
  toFormat: ImageFormat;
  onFromChange: (val: ImageFormat) => void;
  onToChange: (val: ImageFormat) => void;
  disabled?: boolean;
}

const formats: ImageFormat[] = ["png", "jpg", "jpeg", "webp", "bmp", "gif", "svg"];

export function FormatSelector({ 
  fromFormat, 
  toFormat, 
  onFromChange, 
  onToChange, 
  disabled 
}: FormatSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 bg-secondary/20 border border-border/50 rounded-3xl backdrop-blur-sm">
      <div className="flex flex-col gap-2 w-full sm:w-48">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1">
          <FileUp size={14} className="text-primary" />
          Convert From
        </Label>
        <Select 
          value={fromFormat} 
          onValueChange={(val) => onFromChange(val as ImageFormat)}
          disabled={disabled}
        >
          <SelectTrigger className="bg-background border-border/50 rounded-xl h-11 focus:ring-accent">
            <SelectValue placeholder="Source Format" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50">
            {formats.map((f) => (
              <SelectItem key={f} value={f} className="uppercase font-mono">
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden sm:flex items-center justify-center mt-6">
        <div className="p-2 bg-accent/10 rounded-full text-accent">
          <ArrowRightLeft size={20} />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full sm:w-48">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1">
          <FileDown size={14} className="text-accent" />
          Convert To
        </Label>
        <Select 
          value={toFormat} 
          onValueChange={(val) => onToChange(val as ImageFormat)}
          disabled={disabled}
        >
          <SelectTrigger className="bg-background border-border/50 rounded-xl h-11 focus:ring-accent">
            <SelectValue placeholder="Target Format" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50">
            {formats.map((f) => (
              <SelectItem key={f} value={f} className="uppercase font-mono">
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
