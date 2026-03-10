import { useState } from 'react';
import { UserCircle, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { NewCrmStatusBadge } from '../new_crm/NewCrmStatusBadge';
import type { RequestStatus } from '../new_crm/NewCrmStatusBadge';
import { Stars, InvoiceModal, initialCrmData } from './financeShared';
import type { DataEntry } from './financeShared';

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
                                    {initialCrmData.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => setSelected(row)}
                                        >
                                            <td className="p-3 font-mono font-medium text-foreground text-sm">{row.id}</td>
                                            <td className="p-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <UserCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    {row.clientName}
                                                </div>
                                            </td>
                                            <td className="p-3 text-muted-foreground text-sm">{row.invoiceNumber}</td>
                                            <td className="p-3 text-right font-semibold text-sm">SAR {row.amount.toLocaleString()}</td>
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
