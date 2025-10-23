import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ParsedResults } from '@/components/ParsedResults';
import { parsePDF, type ParsedData } from '@/utils/pdfParser';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Sparkles, Shield } from 'lucide-react';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setParsedData(null);

    try {
      toast({
        title: 'Processing document...',
        description: 'Extracting data from your credit card statement',
      });

      const data = await parsePDF(file);
      setParsedData(data);

      toast({
        title: 'Success!',
        description: 'Data extracted successfully from your statement',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to parse PDF',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: 'var(--gradient-primary)' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
              <span className="text-sm font-medium text-foreground">AI-Powered Statement Analysis</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Credit Card Statement
              <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Parser
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Extract key financial data from credit card statements with precision. 
              Supports major Indian banks including ICICI, HDFC, SBI, Axis, and Kotak.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>100% Client-side Processing</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>No Data Stored</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-8">
          <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
          
          {parsedData && <ParsedResults data={parsedData} />}

          {/* Features */}
          {!parsedData && (
            <div className="grid sm:grid-cols-3 gap-4 mt-12">
              <Card className="p-6 rounded-xl" style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Smart Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically detects card provider and extracts relevant data points
                </p>
              </Card>

              <Card className="p-6 rounded-xl" style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  All processing happens in your browser. Your data never leaves your device
                </p>
              </Card>

              <Card className="p-6 rounded-xl" style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Multi-Bank Support</h3>
                <p className="text-sm text-muted-foreground">
                  Works with statements from ICICI, HDFC, SBI, Axis, Kotak & more
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
