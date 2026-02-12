import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Clock, Search, Mail, Calendar, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface DelayedPO {
  poNumber: string;
  supplier: string;
  items: string;
  originalEta: string;
  newEta: string;
  delayDays: number;
  status: 'pending' | 'contacted' | 'rescheduled';
}

interface SupplierDelayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for delayed POs
const delayedPOsData: DelayedPO[] = [
  {
    poNumber: 'PO-2025-001',
    supplier: 'TechCorp Ltd',
    items: 'IT Equipment Package',
    originalEta: '2025-10-01',
    newEta: '2025-10-08',
    delayDays: 7,
    status: 'pending'
  },
  {
    poNumber: 'PO-2025-015',
    supplier: 'Office Plus',
    items: 'Office Furniture Set',
    originalEta: '2025-09-28',
    newEta: '2025-10-04',
    delayDays: 6,
    status: 'contacted'
  }
];

const employees = [
  { id: '1', name: 'Ahmed Hassan' },
  { id: '2', name: 'Sara Mohammed' },
  { id: '3', name: 'Khaled Ali' },
  { id: '4', name: 'Fatima Ibrahim' }
];

export function SupplierDelayModal({ isOpen, onClose }: SupplierDelayModalProps) {
  const [delayedPOs, setDelayedPOs] = useState<DelayedPO[]>(delayedPOsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'delay' | 'supplier' | 'eta'>('delay');
  const [filterSupplier, setFilterSupplier] = useState<string>('all');
  const [editingPO, setEditingPO] = useState<string | null>(null);
  const [newEta, setNewEta] = useState<string>('');
  const [assigningPO, setAssigningPO] = useState<string | null>(null);

  // Get unique suppliers
  const suppliers = Array.from(new Set(delayedPOs.map(po => po.supplier)));

  // Filter and sort
  const filteredPOs = delayedPOs
    .filter(po => {
      const matchesSearch = 
        po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.items.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSupplier = filterSupplier === 'all' || po.supplier === filterSupplier;
      
      return matchesSearch && matchesSupplier;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'delay':
          return b.delayDays - a.delayDays;
        case 'supplier':
          return a.supplier.localeCompare(b.supplier);
        case 'eta':
          return new Date(a.newEta).getTime() - new Date(b.newEta).getTime();
        default:
          return 0;
      }
    });

  const handleContactSupplier = (po: DelayedPO) => {
    toast.success(`Email template opened for ${po.supplier}`, {
      description: `Regarding ${po.poNumber} delay`
    });
  };

  const handleReschedule = (poNumber: string) => {
    if (!newEta) {
      toast.error('Please select a new delivery date');
      return;
    }

    setDelayedPOs(prev => prev.map(po => 
      po.poNumber === poNumber 
        ? { ...po, newEta, status: 'rescheduled' as const }
        : po
    ));

    toast.success(`${poNumber} rescheduled successfully`, {
      description: `New ETA: ${new Date(newEta).toLocaleDateString()}`
    });

    setEditingPO(null);
    setNewEta('');
  };

  const handleAssign = (poNumber: string, employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    
    if (employee) {
      toast.success(`Assigned to ${employee.name}`, {
        description: `${poNumber} follow-up assigned`
      });
    }

    setAssigningPO(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'rescheduled':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Rescheduled</Badge>;
      case 'contacted':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Contacted</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Supplier Delays - Purchase Orders
          </DialogTitle>
        </DialogHeader>

        {/* Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PO, supplier, items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delay">Sort by Delay (Days)</SelectItem>
                <SelectItem value="supplier">Sort by Supplier</SelectItem>
                <SelectItem value="eta">Sort by New ETA</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter */}
            <Select value={filterSupplier} onValueChange={setFilterSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map(supplier => (
                  <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <span className="font-medium">{filteredPOs.length}</span> delayed orders
            </p>
            <p className="text-sm text-muted-foreground">•</p>
            <p className="text-sm">
              Average delay: <span className="font-medium">
                {Math.round(filteredPOs.reduce((sum, po) => sum + po.delayDays, 0) / filteredPOs.length || 0)} days
              </span>
            </p>
          </div>
        </div>

        {/* Delayed POs Table */}
        <div className="border rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">PO Number</th>
                  <th className="text-left p-3 font-medium">Supplier</th>
                  <th className="text-left p-3 font-medium">Items</th>
                  <th className="text-left p-3 font-medium">Original ETA</th>
                  <th className="text-left p-3 font-medium">New ETA</th>
                  <th className="text-left p-3 font-medium">Delay</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPOs.map((po) => (
                  <tr key={po.poNumber} className="border-t hover:bg-muted/50">
                    <td className="p-3 font-medium">{po.poNumber}</td>
                    <td className="p-3">{po.supplier}</td>
                    <td className="p-3 text-sm text-muted-foreground">{po.items}</td>
                    <td className="p-3 text-sm">{new Date(po.originalEta).toLocaleDateString()}</td>
                    <td className="p-3">
                      {editingPO === po.poNumber ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="date"
                            value={newEta}
                            onChange={(e) => setNewEta(e.target.value)}
                            className="w-40"
                            min={new Date().toISOString().split('T')[0]}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleReschedule(po.poNumber)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingPO(null);
                              setNewEta('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm">{new Date(po.newEta).toLocaleDateString()}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge variant="destructive">{po.delayDays} days</Badge>
                    </td>
                    <td className="p-3">{getStatusBadge(po.status)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleContactSupplier(po)}
                          title="Contact Supplier"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        {editingPO !== po.poNumber && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingPO(po.poNumber);
                              setNewEta(po.newEta);
                            }}
                            title="Reschedule Delivery"
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                        )}
                        <Select
                          value={assigningPO === po.poNumber ? '' : undefined}
                          onValueChange={(value) => handleAssign(po.poNumber, value)}
                        >
                          <SelectTrigger className="w-9 h-9 p-0 border-0">
                            <UserPlus className="h-4 w-4" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map(emp => (
                              <SelectItem key={emp.id} value={emp.id}>
                                {emp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPOs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No delayed orders found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
