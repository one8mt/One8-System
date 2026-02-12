import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SupplierQuote {
  id: string;
  supplierName: string;
  quotedPrice: string;
  deliveryTime: string;
  paymentTerms: string;
  notes?: string;
  rating?: number;
}

interface RFQDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqId: string;
  rfqTitle: string;
}

// Mock supplier quotes data
const getSupplierQuotes = (rfqId: string): SupplierQuote[] => {
  const quotesMap: { [key: string]: SupplierQuote[] } = {
    'RFQ-2025-001': [
      {
        id: 'Q1',
        supplierName: 'TechCorp Ltd',
        quotedPrice: 'SAR 42,800',
        deliveryTime: '14 days',
        paymentTerms: 'Net 30',
        notes: 'Includes installation and training',
        rating: 4.5
      },
      {
        id: 'Q2',
        supplierName: 'Global Tech Solutions',
        quotedPrice: 'SAR 38,500',
        deliveryTime: '21 days',
        paymentTerms: 'Net 45',
        notes: 'Best price, longer delivery',
        rating: 4.2
      },
      {
        id: 'Q3',
        supplierName: 'IT Supplies Co',
        quotedPrice: 'SAR 45,200',
        deliveryTime: '7 days',
        paymentTerms: 'Net 15',
        notes: 'Fastest delivery, premium price',
        rating: 4.8
      }
    ],
    'RFQ-2025-002': [
      {
        id: 'Q4',
        supplierName: 'Office Plus',
        quotedPrice: 'SAR 15,200',
        deliveryTime: '10 days',
        paymentTerms: 'Net 30',
        rating: 4.3
      },
      {
        id: 'Q5',
        supplierName: 'Furniture World',
        quotedPrice: 'SAR 14,800',
        deliveryTime: '15 days',
        paymentTerms: 'Net 60',
        notes: 'Volume discount applied',
        rating: 4.0
      }
    ],
    'RFQ-2025-003': [
      {
        id: 'Q6',
        supplierName: 'Print Solutions',
        quotedPrice: 'SAR 3,200',
        deliveryTime: '5 days',
        paymentTerms: 'Net 15',
        rating: 4.6
      },
      {
        id: 'Q7',
        supplierName: 'Marketing Print Pro',
        quotedPrice: 'SAR 2,950',
        deliveryTime: '7 days',
        paymentTerms: 'Net 30',
        notes: 'Best price option',
        rating: 4.4
      }
    ]
  };

  return quotesMap[rfqId] || [];
};

export function RFQDetailsModal({ isOpen, onClose, rfqId, rfqTitle }: RFQDetailsModalProps) {
  const [quotes] = useState<SupplierQuote[]>(getSupplierQuotes(rfqId));
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [rejectedQuotes, setRejectedQuotes] = useState<string[]>([]);
  const [revisionQuotes, setRevisionQuotes] = useState<string[]>([]);

  const selectedQuoteData = quotes.find(q => q.id === selectedQuote);

  const handleRejectQuote = (quoteId: string) => {
    setRejectedQuotes(prev => [...prev, quoteId]);
    if (selectedQuote === quoteId) {
      setSelectedQuote(null);
    }
    
    const quote = quotes.find(q => q.id === quoteId);
    toast.success(`Quote from ${quote?.supplierName} rejected`, {
      description: 'Supplier has been notified'
    });
  };

  const handleRequestRevision = (quoteId: string) => {
    setRevisionQuotes(prev => [...prev, quoteId]);
    
    const quote = quotes.find(q => q.id === quoteId);
    toast.success(`Revision requested from ${quote?.supplierName}`, {
      description: 'Follow-up email sent'
    });
  };

  const handleConvertToPO = () => {
    if (!selectedQuoteData) {
      toast.error('Please select a supplier first');
      return;
    }

    // Generate PO ID
    const poId = `PO-2025-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;

    toast.success(`Purchase Order ${poId} created`, {
      description: `Supplier: ${selectedQuoteData.supplierName} • Amount: ${selectedQuoteData.quotedPrice}`
    });

    onClose();
  };

  const activeQuotes = quotes.filter(q => !rejectedQuotes.includes(q.id));

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-500">★</span>
        <span className="text-sm">{rating}</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div>
              <p>{rfqId} - Supplier Quotes</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">{rfqTitle}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Quotes</p>
              <p className="text-xl font-medium">{quotes.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Quotes</p>
              <p className="text-xl font-medium">{activeQuotes.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Best Price</p>
              <p className="text-xl font-medium text-green-600">
                {Math.min(...quotes.map(q => parseFloat(q.quotedPrice.replace(/[SAR,]/g, '')))).toLocaleString('en-US', { style: 'currency', currency: 'SAR' })}
              </p>
            </div>
          </div>

          {/* Supplier Quotes Table */}
          <div>
            <h4 className="font-medium mb-3">Supplier Quotes Comparison</h4>
            
            {activeQuotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                No active quotes available
              </div>
            ) : (
              <RadioGroup value={selectedQuote || ''} onValueChange={setSelectedQuote}>
                <div className="space-y-3">
                  {activeQuotes.map((quote) => {
                    const isRevisionRequested = revisionQuotes.includes(quote.id);
                    
                    return (
                      <div
                        key={quote.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          selectedQuote === quote.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        } ${isRevisionRequested ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          <RadioGroupItem value={quote.id} id={quote.id} className="mt-1" />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <Label htmlFor={quote.id} className="text-base font-medium cursor-pointer">
                                  {quote.supplierName}
                                </Label>
                                {getRatingStars(quote.rating)}
                                {isRevisionRequested && (
                                  <Badge className="mt-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Revision Requested
                                  </Badge>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-semibold">{quote.quotedPrice}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Delivery Time</p>
                                <p className="text-sm font-medium">{quote.deliveryTime}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Payment Terms</p>
                                <p className="text-sm font-medium">{quote.paymentTerms}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Quote ID</p>
                                <p className="text-sm font-medium">{quote.id}</p>
                              </div>
                            </div>

                            {quote.notes && (
                              <div className="mb-3">
                                <p className="text-xs text-muted-foreground">Notes</p>
                                <p className="text-sm">{quote.notes}</p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectQuote(quote.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject Quote
                              </Button>
                              {!isRevisionRequested && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRequestRevision(quote.id)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  Request Revision
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            )}
          </div>

          {/* Selected Supplier Confirmation */}
          {selectedQuoteData && (
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                    Selected Supplier
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <span className="font-medium">{selectedQuoteData.supplierName}</span>
                    {' • '}
                    Price: <span className="font-medium">{selectedQuoteData.quotedPrice}</span>
                    {' • '}
                    ETA: <span className="font-medium">{selectedQuoteData.deliveryTime}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={handleConvertToPO}
            disabled={!selectedQuote}
            className="gap-2"
          >
            <CheckCircle className="bg-black hover:bg-black/90"/>
            Convert to Purchase Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
