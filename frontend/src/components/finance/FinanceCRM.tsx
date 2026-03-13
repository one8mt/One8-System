import { useState, useEffect } from 'react';
import { UserCircle, CheckCircle, Users, Edit2, Search, Calendar, DollarSign, ArrowRight, Eye, LayoutGrid, List, Filter, Download, Plus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { NewCrmStatusBadge } from '../new_crm/NewCrmStatusBadge';
import type { RequestStatus } from '../new_crm/NewCrmStatusBadge';
import { Stars, InvoiceModal, initialCrmData } from './financeShared';
import type { DataEntry } from './financeShared';
import { cn } from '../ui/utils';

const STATUS_MAP: Record<string, RequestStatus> = {
    Pending: 'Pending',
    'In Progress': 'New',
    Completed: 'Approved',
    Approved: 'Approved',
    Flagged: 'Flagged',
    New: 'New',
};

interface FinanceCRMProps {
    submittedIds: Set<string>;
    onSubmit: (entry: DataEntry, source: 'PMS' | 'CRM') => void;
}

export function FinanceCRM({ submittedIds, onSubmit }: FinanceCRMProps) {
    const [selected, setSelected] = useState<DataEntry | null>(null);
    const [invoices, setInvoices] = useState<DataEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/api/invoices/');
                const data = await res.json();
                const mapped: DataEntry[] = data.map((inv: any) => ({
                    id: inv.id,
                    clientName: inv.client_name,
                    invoiceNumber: inv.id, // Using ID as number for consistency
                    amount: parseFloat(inv.net_total),
                    cost: parseFloat(inv.net_total) * 0.8, // Approximation
                    progress: inv.status === 'Paid' ? 100 : 45,
                    status: inv.status,
                    rating: 4,
                    has_incident: inv.has_incident,
                    incident_deduction: inv.incident_deduction,
                    items: inv.items.map((it: any) => ({
                        ...it,
                        incident_type: it.incident_type
                    }))
                }));
                setInvoices(mapped);
            } catch (err) {
                console.error('Failed to fetch invoices:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>CRM Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <div className="max-h-[420px] overflow-y-auto crm-scrollbar">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-background z-10">
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-medium text-sm">ID</th>
                                        <th className="text-left p-3 font-medium text-sm">Client Name</th>
                                        <th className="text-left p-3 font-medium text-sm">Invoice Number</th>
                                        <th className="text-right p-3 font-medium text-sm">Amount (SAR)</th>
                                        <th className="text-left p-3 font-medium text-sm">Client Rating</th>
                                        <th className="text-left p-3 font-medium text-sm">Progress</th>
                                        <th className="text-left p-3 font-medium text-sm">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={7} className="text-center p-8 text-muted-foreground text-sm">Loading invoices...</td></tr>
                                    ) : invoices.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center p-8 text-muted-foreground text-sm">No invoices found.</td></tr>
                                    ) : invoices.map((row: DataEntry, idx: number) => (
                                        <tr
                                            key={row.id}
                                            className="border-b hover:bg-muted/50 transition-colors cursor-pointer group"
                                            onClick={() => setSelected(row)}
                                        >
                                            <td className="p-3 font-mono font-medium text-foreground text-sm flex items-center gap-2">
                                                CRM-{String(idx + 1).padStart(3, '0')}
                                                <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                                            </td>
                                            <td className="p-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <UserCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    {row.clientName}
                                                </div>
                                            </td>
                                            <td className="p-3 text-muted-foreground text-sm">{row.invoiceNumber}</td>
                                            <td className="p-3 text-right text-sm">
                                                <div className="flex flex-col items-end">
                                                    <span className={cn("font-semibold", row.has_incident ? "text-red-600" : "text-foreground")}>
                                                        SAR {row.amount.toLocaleString()}
                                                    </span>
                                                    {row.has_incident && row.incident_deduction && row.incident_deduction > 0 && (
                                                        <span className="text-[10px] text-red-500 font-medium">
                                                            - SAR {row.incident_deduction.toLocaleString()} (Return)
                                                        </span>
                                                    )}
                                                    {row.has_incident && (
                                                        <span className="text-[11px] font-bold text-red-700">
                                                            Net: SAR {(row.amount - (row.incident_deduction || 0)).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3"><Stars rating={row.rating} /></td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <Progress value={row.progress} className="w-20" />
                                                    <span className="text-sm text-muted-foreground">{row.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                {submittedIds.has(row.id) ? (
                                                    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                                        <CheckCircle className="h-3.5 w-3.5" />Sent
                                                    </span>
                                                ) : (
                                                    <NewCrmStatusBadge status={STATUS_MAP[row.status] ?? 'Pending'} force />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selected && (
                <InvoiceModal
                    entry={selected}
                    source="CRM"
                    onClose={() => setSelected(null)}
                    onSubmit={(updated) => { onSubmit(updated, 'CRM'); setSelected(null); }}
                />
            )}
        </>
    );
}
