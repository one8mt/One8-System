// Shared types, dummy data, helpers, and InvoiceModal for Finance sub-modules

import { useState, useEffect } from 'react';
import { FileText, Edit2, Send, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2 } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────

export type DataEntry = {
    id: string;
    clientName: string;
    invoiceNumber: string;
    amount: number;
    cost: number;
    progress: number;
    status: string;
    rating: number;
    has_incident?: boolean;
    incident_deduction?: number;
    date?: string;
    submittedAt?: string;
    items: { 
        id?: string;
        name?: string; 
        product_name?: string; 
        item_code?: string; 
        qty?: number; 
        quantity?: number; 
        unitPrice?: number; 
        unit_price?: number; 
        line_total?: string | number;
        incident_type?: string;
        incident_quantity?: number;
    }[];
};

export type Product = {
    id: string;
    item_code: string;
    name: string;
    created_at: string;
};

export type AccountingEntry = DataEntry & { source: 'PMS' | 'CRM'; submittedAt: string };

// ─── Dummy Data ─────────────────────────────────────────────────────────────

export const initialPmsData: DataEntry[] = [
    { id: 'PO-001', clientName: 'Al-Faisal Construction', invoiceNumber: 'INV-2024-1101', amount: 45000, cost: 38000, progress: 80, status: 'In Progress', rating: 4, items: [{ name: 'Site Survey Equipment', qty: 3, unitPrice: 8000 }, { name: 'Safety Gear', qty: 10, unitPrice: 750 }, { name: 'Scaffolding Materials', qty: 1, unitPrice: 21500 }] },
    { id: 'PO-002', clientName: 'Gulf Tech Solutions', invoiceNumber: 'INV-2024-1102', amount: 29500, cost: 21000, progress: 45, status: 'Pending', rating: 3, items: [{ name: 'Server Hardware', qty: 2, unitPrice: 12000 }, { name: 'Network Switches', qty: 5, unitPrice: 1100 }] },
    { id: 'PO-003', clientName: 'Royal Hospitality Group', invoiceNumber: 'INV-2024-1103', amount: 67000, cost: 52000, progress: 60, status: 'In Progress', rating: 5, items: [{ name: 'Commercial Kitchen Equipment', qty: 1, unitPrice: 47000 }, { name: 'Refrigeration Units', qty: 4, unitPrice: 5000 }] },
    { id: 'PO-004', clientName: 'Aramco Suppliers Ltd', invoiceNumber: 'INV-2024-1104', amount: 18500, cost: 14200, progress: 100, status: 'Approved', rating: 4, items: [{ name: 'Industrial Filters', qty: 20, unitPrice: 750 }, { name: 'Valve Assemblies', qty: 5, unitPrice: 700 }] },
    { id: 'PO-005', clientName: 'Riyadh Education Authority', invoiceNumber: 'INV-2024-1105', amount: 32000, cost: 25000, progress: 20, status: 'Pending', rating: 3, items: [{ name: 'Smart Boards', qty: 8, unitPrice: 3500 }, { name: 'Lab Equipment Sets', qty: 2, unitPrice: 4000 }] },
];

export const initialCrmData: DataEntry[] = [
    { id: 'CRM-001', clientName: 'Global Retail Group', invoiceNumber: 'INV-2024-1145', amount: 12450, cost: 9800, progress: 45, status: 'Pending', rating: 4, items: [{ name: 'Retail Point-of-Sale System', qty: 3, unitPrice: 2500 }, { name: 'Receipt Printers', qty: 6, unitPrice: 575 }] },
    { id: 'CRM-002', clientName: 'Tech Solutions Inc', invoiceNumber: 'INV-2024-1144', amount: 8920, cost: 6800, progress: 100, status: 'Approved', rating: 3, items: [{ name: 'CRM Software License', qty: 5, unitPrice: 1500 }, { name: 'Setup & Configuration', qty: 1, unitPrice: 1420 }] },
    { id: 'CRM-003', clientName: 'Manufacturing Co Ltd', invoiceNumber: 'INV-2024-1143', amount: 5670, cost: 4200, progress: 30, status: 'Flagged', rating: 2, items: [{ name: 'ERP Module', qty: 1, unitPrice: 4500 }, { name: 'Training Sessions', qty: 3, unitPrice: 390 }] },
    { id: 'CRM-004', clientName: 'Office Supplies Plus', invoiceNumber: 'INV-2024-1142', amount: 15230, cost: 11500, progress: 85, status: 'Approved', rating: 5, items: [{ name: 'Stationery Bundle A', qty: 50, unitPrice: 180 }, { name: 'Office Chairs', qty: 20, unitPrice: 361.5 }] },
    { id: 'CRM-005', clientName: 'Wholesale Distributors', invoiceNumber: 'INV-2024-1141', amount: 3450, cost: 2700, progress: 60, status: 'Pending', rating: 4, items: [{ name: 'Barcode Scanners', qty: 6, unitPrice: 575 }] },
];

export const otherCosts = [
    { id: 'SAL-001', category: 'Employee Salaries', description: 'Monthly payroll — all departments', amount: 85000, date: 'Mar 2026' },
    { id: 'PUR-PO-001', category: 'PO from Purchase', description: 'Raw materials procurement batch #1', amount: 32000, date: 'Mar 2026' },
    { id: 'PUR-PO-002', category: 'PO from Purchase', description: 'Office equipment and supplies', amount: 14500, date: 'Mar 2026' },
    { id: 'INV-PO-001', category: 'PO from Inventory', description: 'Warehouse restocking order', amount: 27000, date: 'Mar 2026' },
    { id: 'INV-PO-002', category: 'PO from Inventory', description: 'Safety equipment replenishment', amount: 9800, date: 'Mar 2026' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-3.5 w-3.5 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
            ))}
        </div>
    );
}

// ─── Invoice Modal ────────────────────────────────────────────────────────────

export function InvoiceModal({ entry, source, onClose, onSubmit }: {
    entry: DataEntry;
    source: 'PMS' | 'CRM';
    onClose: () => void;
    onSubmit: (e: DataEntry, source: 'PMS' | 'CRM') => void;
}) {
    const items = entry.items;
    const total = items.reduce((s, i) => s + (i.qty || i.quantity || 0) * (i.unitPrice || i.unit_price || 0), 0);

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="w-[92vw] max-w-[860px] max-h-[90vh] overflow-y-auto rounded-2xl p-0 crm-scrollbar">
                <div className="p-6 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            {entry.has_incident ? 'Mixed Request' : 'Invoice Details'} - {entry.id}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Compact Top Grid from IncidentKanban */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">Client Name</Label>
                                <Input value={entry.clientName} readOnly className="h-9 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Invoice Number</Label>
                                <Input value={entry.invoiceNumber} readOnly className="h-9 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Return Mode</Label>
                                <Input value={entry.has_incident ? "Partial" : "Full"} readOnly className="h-9 text-xs" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">Email</Label>
                                <Input value={`${entry.clientName.toLowerCase().replace(/[^a-z0-9]/g, '')}@client.com`} readOnly className="h-9 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Date & Time</Label>
                                <Input value={entry.submittedAt || entry.date || "Mar 13, 2026 2:35 PM"} readOnly className="h-9 text-xs" />
                            </div>
                        </div>

                        {/* Items Table from IncidentKanban */}
                        <div className="mt-4">
                            <h3 className="text-xs font-semibold mb-2">Items</h3>
                            <Table className="[&_td]:px-2 [&_td]:py-1 [&_th]:px-2 [&_th]:py-1 text-xs border rounded-md overflow-hidden">
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-12">Type</TableHead>
                                        <TableHead className="text-[11px]">Item Name</TableHead>
                                        <TableHead className="text-center text-[10px]">Quantity</TableHead>
                                        <TableHead className="text-center text-[10px]">Qty</TableHead>
                                        <TableHead className="text-right text-[10px]">Unit Price</TableHead>
                                        <TableHead className="text-right text-[10px]">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, idx) => {
                                        const hasIncident = !!item.incident_type;
                                        const incidentQty = item.incident_quantity || 0;
                                        const unitPriceNum = typeof item.unitPrice === 'number' ? item.unitPrice : 0;
                                        
                                        let highlightColor = "";
                                        if (hasIncident) {
                                            if (item.incident_type === 'Refund') highlightColor = "text-green-600 font-bold";
                                            else if (item.incident_type === 'Missing') highlightColor = "text-blue-600 font-bold";
                                            else if (item.incident_type === 'Damaged' || item.incident_type === 'Damage') highlightColor = "text-red-600 font-bold";
                                            else if (item.incident_type === 'Exchange') highlightColor = "text-amber-600 font-bold";
                                            else highlightColor = "text-green-600 font-bold";
                                        }

                                        return (
                                            <TableRow key={idx} className={hasIncident ? "bg-muted/10 border-b" : "border-b"}>
                                                <TableCell>
                                                    <div className={`w-6 h-6 rounded-md ${
                                                        item.incident_type === "Refund" ? "bg-green-500" :
                                                        item.incident_type === "Missing" ? "bg-blue-500" :
                                                        (item.incident_type === "Damage" || item.incident_type === "Damaged") ? "bg-red-500" :
                                                        item.incident_type === "Exchange" ? "bg-amber-500" : "bg-gray-200"
                                                    }`} title={item.incident_type} />
                                                </TableCell>
                                                <TableCell className="font-medium text-[11px]">{item.name || item.product_name}</TableCell>
                                                <TableCell className="text-center text-[11px]">{item.qty || item.quantity || 0}</TableCell>
                                                <TableCell className={`text-center text-[11px] ${highlightColor}`}>{incidentQty || '-'}</TableCell>
                                                <TableCell className="text-right text-[11px]">SAR {unitPriceNum.toLocaleString()}</TableCell>
                                                <TableCell className={`text-right text-[11px] ${highlightColor}`}>
                                                    {hasIncident 
                                                        ? `SAR ${(incidentQty * unitPriceNum).toLocaleString()}` 
                                                        : <span className="text-gray-400">—</span>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    
                                    {/* Totals Section */}
                                    {entry.has_incident && entry.incident_deduction ? (
                                        <>
                                            <TableRow className="bg-red-50 font-semibold text-red-700 h-10">
                                                <TableCell colSpan={5} className="text-right text-[11px]">Original Total</TableCell>
                                                <TableCell className="text-right text-[11px]">SAR {total.toLocaleString()}</TableCell>
                                            </TableRow>
                                            <TableRow className="bg-red-100 font-bold text-red-800 border-t-2 border-red-200 h-10">
                                                <TableCell colSpan={5} className="text-right text-[11px]">
                                                    <span className="bg-red-600 text-white px-1.5 py-0.5 rounded uppercase text-[8px] font-black mr-2">Deduction</span>
                                                    Incident Returns
                                                </TableCell>
                                                <TableCell className="text-right text-[11px]">- SAR {entry.incident_deduction.toLocaleString()}</TableCell>
                                            </TableRow>
                                            <TableRow className="bg-[#0B3AAE] text-white font-bold h-12">
                                                <TableCell colSpan={5} className="text-right text-sm">Net Payable Total</TableCell>
                                                <TableCell className="text-right text-sm font-black">SAR {(total - entry.incident_deduction).toLocaleString()}</TableCell>
                                            </TableRow>
                                        </>
                                    ) : (
                                        <TableRow className="bg-muted/30 font-semibold">
                                            <TableCell colSpan={5} className="text-right">Total</TableCell>
                                            <TableCell className="text-right">SAR {total.toLocaleString()}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                            <Button variant="outline" onClick={onClose} className="h-10 px-6">Close</Button>
                            <Button
                                className="bg-[#0B3AAE] hover:bg-blue-700 text-white gap-2 h-10 px-8 font-semibold"
                                onClick={() => { onSubmit(entry, source); onClose(); }}
                            >
                                <Send className="h-4 w-4" />
                                {source === 'PMS' ? 'Complete Order' : 'Submit to Accounting'}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── New Product Dialog ───────────────────────────────────────────────────

export function NewProductDialog({ onClose, onSuccess }: {
    onClose: () => void;
    onSuccess: (product: Product) => void;
}) {
    const [itemCode, setItemCode] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/products/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item_code: itemCode, name }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.item_code?.[0] || 'Failed to create product');
            }

            const newProduct = await response.json();
            onSuccess(newProduct);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#0B3AAE]" />
                        Create New Product
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="itemCode">Item Code</Label>
                        <Input
                            id="itemCode"
                            placeholder="e.g. PRD-001"
                            value={itemCode}
                            onChange={(e) => setItemCode(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Concrete Mixer"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-[#0B3AAE] hover:bg-blue-700 text-white">
                            {loading ? 'Creating...' : 'Create Product'}
                        </Button>
    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── New Invoice Dialog ───────────────────────────────────────────────────

export function NewInvoiceDialog({ onClose, onSuccess, existingInvoices = [] }: {
    onClose: () => void;
    onSuccess: (invoice: any) => void;
    existingInvoices?: any[];
}) {
    const generateInvoiceId = () => {
        const now = new Date();
        const dateStr = now.getFullYear().toString().slice(-2) +
            (now.getMonth() + 1).toString().padStart(2, '0') +
            now.getDate().toString().padStart(2, '0') +
            now.getHours().toString().padStart(2, '0') +
            now.getMinutes().toString().padStart(2, '0');
        
        return `INV-${dateStr}`;
    };

    const [clients, setClients] = useState<any[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [invoiceId, setInvoiceId] = useState(generateInvoiceId());
    const [items, setItems] = useState<{ productId: string; quantity: number; unitPrice: number }[]>([
        { productId: '', quantity: 1, unitPrice: 0 }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientsRes, productsRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/clients/'),
                    fetch('http://127.0.0.1:8000/api/products/')
                ]);
                const [clientsData, productsData] = await Promise.all([
                    clientsRes.json(),
                    productsRes.json()
                ]);
                setClients(clientsData);
                setProducts(productsData);
            } catch (err) {
                console.error('Failed to fetch data', err);
            }
        };
        fetchData();
    }, []);

    const addItem = () => setItems([...items, { productId: '', quantity: 1, unitPrice: 0 }]);
    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

    const updateItem = (idx: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        
        // Auto-fill price if product changes
        if (field === 'productId') {
            // In a real app, products might have default prices. Here we just set it to 0 or leave as is.
        }
        
        setItems(newItems);
    };

    const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient) {
            setError('Please select a client');
            return;
        }
        if (items.some(i => !i.productId)) {
            setError('Please select a product for all items');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // First create the Invoice
            const invoiceRes = await fetch('http://127.0.0.1:8000/api/invoices/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: invoiceId,
                    client: selectedClient,
                    status: 'Draft',
                }),
            });

            if (!invoiceRes.ok) throw new Error('Failed to create invoice');
            const newInvoice = await invoiceRes.json();

            // Then create InvoiceItems
            await Promise.all(items.map(async (item) => {
                const product = products.find(p => p.id === item.productId);
                return fetch('http://127.0.0.1:8000/api/invoice-items/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        invoice: newInvoice.id,
                        product: item.productId,
                        item_code: product?.item_code || '',
                        product_name: product?.name || '',
                        quantity: item.quantity,
                        unit_price: item.unitPrice,
                    }),
                });
            }));

            // Refresh invoice to get total
            const finalRes = await fetch(`http://127.0.0.1:8000/api/invoices/${newInvoice.id}/`);
            const finalData = await finalRes.json();
            
            onSuccess(finalData);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-[1000px] rounded-2xl overflow-hidden p-0">
                <div className="bg-[#0B3AAE] p-4 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Create New Invoice
                        </DialogTitle>
                    </DialogHeader>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs">Client</Label>
                            <Select value={selectedClient} onValueChange={setSelectedClient}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Select client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map(c => (
                                        <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Invoice ID</Label>
                            <Input value={invoiceId} readOnly className="h-8 text-xs bg-muted/50 font-mono" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Line Items</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-7 text-xs gap-1 px-2">
                                <Plus className="h-3.5 w-3.5" /> Add Item
                            </Button>
                        </div>

                        <Table className="border rounded-md overflow-hidden">
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="text-xs w-28">Item Code</TableHead>
                                    <TableHead className="text-xs">Product</TableHead>
                                    <TableHead className="text-xs w-24 text-center">Qty</TableHead>
                                    <TableHead className="text-xs w-32 text-right">Price (SAR)</TableHead>
                                    <TableHead className="text-xs w-32 text-right">Total</TableHead>
                                    <TableHead className="text-xs w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="p-2">
                                            <div className="font-mono text-[10px] text-muted-foreground bg-muted/30 px-2 py-1 rounded border">
                                                {products.find(p => p.id === item.productId)?.item_code || '---'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <Select 
                                                value={item.productId} 
                                                onValueChange={val => updateItem(idx, 'productId', val)}
                                            >
                                                <SelectTrigger className="h-8 text-xs truncate">
                                                    <SelectValue placeholder="Select product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map(p => (
                                                        <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            <Input 
                                                type="number" 
                                                value={item.quantity} 
                                                onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 0)}
                                                className="h-8 w-16 text-center mx-auto text-xs shrink-0"
                                            />
                                        </TableCell>
                                        <TableCell className="p-2 text-right">
                                            <Input 
                                                type="number" 
                                                value={item.unitPrice} 
                                                onChange={e => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                className="h-8 w-28 text-right ml-auto text-xs shrink-0"
                                            />
                                        </TableCell>
                                        <TableCell className="p-2 text-right font-medium text-xs">
                                            {(item.quantity * item.unitPrice).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => removeItem(idx)}
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                disabled={items.length === 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-muted/30 font-bold">
                                    <TableCell colSpan={3} className="text-right text-xs">Net Total</TableCell>
                                    <TableCell className="text-right text-sm">SAR {total.toLocaleString()}</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <DialogFooter className="pt-2 gap-2 border-t">
                        <Button type="button" variant="outline" onClick={onClose} className="h-8 text-xs">Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-[#0B3AAE] hover:bg-blue-700 text-white min-w-[100px] h-8 text-xs">
                            {loading ? 'Creating...' : 'Create Invoice'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
