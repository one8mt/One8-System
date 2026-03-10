// Shared types, dummy data, helpers, and InvoiceModal for Finance sub-modules

import { useState } from 'react';
import { FileText, Edit2, Send, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

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
    items: { name: string; qty: number; unitPrice: number }[];
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
    onSubmit: (e: DataEntry) => void;
}) {
    const [editable, setEditable] = useState(false);
    const [items, setItems] = useState(entry.items.map((i) => ({ ...i })));
    const total = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="w-[92vw] max-w-[860px] max-h-[90vh] overflow-y-auto rounded-2xl p-0">
                <div className="p-6 space-y-5">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base">
                            <FileText className="h-5 w-5 text-[#0B3AAE]" />
                            Invoice — {entry.id} · {entry.invoiceNumber}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1"><Label className="text-xs">Client Name</Label><Input value={entry.clientName} readOnly className="h-9 text-xs" /></div>
                        <div className="space-y-1"><Label className="text-xs">Invoice Number</Label><Input value={entry.invoiceNumber} readOnly className="h-9 text-xs" /></div>
                        <div className="space-y-1"><Label className="text-xs">Source</Label><Input value={source} readOnly className="h-9 text-xs" /></div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">Line Items</h3>
                            <button
                                type="button"
                                className={`text-xs px-3 py-1.5 rounded-md border transition-colors flex items-center gap-1 ${editable ? 'bg-muted border-border' : 'bg-[#0B3AAE]/10 border-[#0B3AAE]/20 text-[#0B3AAE]'}`}
                                onClick={() => setEditable(v => !v)}
                            >
                                {editable ? 'Lock' : <><Edit2 className="h-3 w-3" />Edit Items</>}
                            </button>
                        </div>
                        <Table className="text-xs border rounded-lg overflow-hidden">
                            <TableHeader className="bg-muted/60">
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-center w-20">Qty</TableHead>
                                    <TableHead className="text-right w-28">Unit Price (SAR)</TableHead>
                                    <TableHead className="text-right w-28">Total (SAR)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-center">
                                            {editable
                                                ? <Input type="number" min={1} value={item.qty} onChange={e => { const u = [...items]; u[idx] = { ...u[idx], qty: parseInt(e.target.value) || 1 }; setItems(u); }} className="h-7 w-16 text-center mx-auto text-xs" />
                                                : item.qty}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {editable
                                                ? <Input type="number" min={0} value={item.unitPrice} onChange={e => { const u = [...items]; u[idx] = { ...u[idx], unitPrice: parseFloat(e.target.value) || 0 }; setItems(u); }} className="h-7 w-28 text-right ml-auto text-xs" />
                                                : item.unitPrice.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{(item.qty * item.unitPrice).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-muted/30 font-semibold">
                                    <TableCell colSpan={3} className="text-right">Total</TableCell>
                                    <TableCell className="text-right">SAR {total.toLocaleString()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <Button
                            className="bg-[#0B3AAE] hover:bg-blue-700 text-white gap-2"
                            onClick={() => { onSubmit({ ...entry, amount: total, items }); onClose(); }}
                        >
                            <Send className="h-4 w-4" />Submit to Accounting
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
