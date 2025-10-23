import { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload = ({ onFileSelect, isProcessing }: FileUploadProps) => {
  const { toast } = useToast();

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (isProcessing) return;

      const files = Array.from(e.dataTransfer.files);
      const pdfFile = files.find(file => file.type === 'application/pdf');

      if (!pdfFile) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file',
          variant: 'destructive',
        });
        return;
      }

      if (pdfFile.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload a PDF file smaller than 10MB',
          variant: 'destructive',
        });
        return;
      }

      onFileSelect(pdfFile);
    },
    [onFileSelect, isProcessing, toast]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: 'Please upload a PDF file smaller than 10MB',
            variant: 'destructive',
          });
          return;
        }
        onFileSelect(file);
      }
    },
    [onFileSelect, toast]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative group"
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileInput}
        disabled={isProcessing}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 border-border hover:border-primary bg-card group-hover:shadow-hover"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
          <div className="w-20 h-20 mb-4 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: 'var(--gradient-primary)' }}>
            {isProcessing ? (
              <FileText className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Upload className="w-10 h-10 text-white" />
            )}
          </div>
          <p className="mb-2 text-lg font-semibold text-foreground">
            {isProcessing ? 'Processing...' : 'Drop your credit card statement here'}
          </p>
          <p className="text-sm text-muted-foreground text-center">
            or click to browse • PDF only • Max 10MB
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Supports ICICI, HDFC, SBI, Axis, Kotak & more
          </p>
        </div>
      </label>
    </div>
  );
};
