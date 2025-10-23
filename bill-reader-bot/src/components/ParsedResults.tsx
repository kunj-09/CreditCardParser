import { CheckCircle2, XCircle, CreditCard, Calendar, DollarSign, User, Hash, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ParsedData } from '@/utils/pdfParser';

interface ParsedResultsProps {
  data: ParsedData;
}

const DataField = ({ 
  icon: Icon, 
  label, 
  value, 
  found 
}: { 
  icon: any; 
  label: string; 
  value: string | null; 
  found: boolean;
}) => (
  <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-secondary/50">
    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: found ? 'var(--gradient-primary)' : 'hsl(var(--muted))' }}>
      <Icon className={`w-5 h-5 ${found ? 'text-white' : 'text-muted-foreground'}`} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {found ? (
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
        )}
      </div>
      <p className="text-base font-semibold text-foreground break-words">
        {found ? value : 'Not found'}
      </p>
    </div>
  </div>
);

export const ParsedResults = ({ data }: ParsedResultsProps) => {
  const extractedCount = Object.values(data).filter(v => v !== null && v !== 'Unknown Provider').length;
  const totalFields = 9; // Total number of fields we're trying to extract

  return (
    <div className="w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <Card className="p-6 rounded-2xl" style={{ boxShadow: 'var(--shadow-card)', background: 'var(--gradient-card)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Extraction Results</h2>
            <p className="text-sm text-muted-foreground">
              Successfully parsed credit card statement
            </p>
          </div>
          <Badge 
            variant="secondary" 
            className="text-base px-4 py-2 font-semibold"
            style={{ background: 'var(--gradient-primary)', color: 'white' }}
          >
            {extractedCount}/{totalFields} Fields
          </Badge>
        </div>

        {data.provider !== 'Unknown Provider' && (
          <div className="mb-6 p-4 rounded-xl" style={{ background: 'hsl(var(--secondary))' }}>
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6" style={{ color: 'hsl(var(--primary))' }} />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Detected Provider</p>
                <p className="text-lg font-bold text-foreground">{data.provider}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-3">
          <DataField
            icon={User}
            label="Customer Name"
            value={data.customerName}
            found={!!data.customerName}
          />
          <DataField
            icon={Hash}
            label="Card Number"
            value={data.cardNumber}
            found={!!data.cardNumber}
          />
          <DataField
            icon={CreditCard}
            label="Card Type"
            value={data.cardType}
            found={!!data.cardType}
          />
          <DataField
            icon={Calendar}
            label="Statement Date"
            value={data.statementDate}
            found={!!data.statementDate}
          />
          <DataField
            icon={Calendar}
            label="Payment Due Date"
            value={data.paymentDueDate}
            found={!!data.paymentDueDate}
          />
          <DataField
            icon={DollarSign}
            label="Total Amount Due"
            value={data.totalAmountDue}
            found={!!data.totalAmountDue}
          />
          <DataField
            icon={TrendingDown}
            label="Minimum Amount Due"
            value={data.minimumDue}
            found={!!data.minimumDue}
          />
          <DataField
            icon={TrendingUp}
            label="Credit Limit"
            value={data.creditLimit}
            found={!!data.creditLimit}
          />
          <DataField
            icon={TrendingUp}
            label="Available Credit"
            value={data.availableCredit}
            found={!!data.availableCredit}
          />
        </div>
      </Card>
    </div>
  );
};
