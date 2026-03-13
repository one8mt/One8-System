import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ShoppingCart, Calculator, Users } from 'lucide-react';
import { FinancePMS } from './finance/FinancePMS';
import { FinanceCRM } from './finance/FinanceCRM';
import { FinanceAccounting } from './finance/FinanceAccounting';
import type { DataEntry, AccountingEntry } from './finance/financeShared';
import { initialPmsData, initialCrmData, otherCosts } from './finance/financeShared';

interface FinanceDashboardProps {
    userRole?: 'employee' | 'manager' | 'client' | 'supplier';
}

const modules = [
    { id: 'PMS', title: 'PMS', description: 'Project finances, purchase orders, and milestone tracking', icon: ShoppingCart, color: 'purple' as const },
    { id: 'Accounting', title: 'Accounting', description: 'Submitted invoices, ledger, and net profit analysis', icon: Calculator, color: 'green' as const },
    { id: 'CRM', title: 'CRM', description: 'Customer accounts, revenue tracking, and client invoicing', icon: Users, color: 'blue' as const },
];

const colorMap = {
    purple: { card: 'ring-purple-500 border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800', icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' },
    green: { card: 'ring-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800', icon: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' },
    blue: { card: 'ring-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800', icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' },
};

export function FinanceDashboard({ userRole }: FinanceDashboardProps) {
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<AccountingEntry[]>([]);
    const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());

    const handleSubmit = (entry: DataEntry, source: 'PMS' | 'CRM') => {
        const newEntry: AccountingEntry = {
            ...entry,
            source,
            submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        setSubmitted((prev) => {
            const idx = prev.findIndex((e) => e.id === entry.id);
            if (idx >= 0) { const u = [...prev]; u[idx] = newEntry; return u; }
            return [...prev, newEntry];
        });
        setSubmittedIds((prev) => new Set([...prev, entry.id]));
        setActiveModule('Accounting');
    };

    return (
        <div className="container mx-auto px-6 py-6 space-y-8">
            <div>
                <h1 className="mb-2">Finance Dashboard</h1>
                <p className="text-muted-foreground">Manage financial operations across PMS, Accounting, and CRM</p>
            </div>

            {/* Module Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {modules.map((mod) => {
                    const isActive = activeModule === mod.id;
                    const colors = colorMap[mod.color];
                    const IconComponent = mod.icon;
                    const count = mod.id === 'PMS' ? initialPmsData.length : mod.id === 'CRM' ? initialCrmData.length : submitted.length;
                    const secondary = mod.id === 'PMS'
                        ? initialPmsData.filter(d => d.status === 'Pending').length
                        : mod.id === 'CRM'
                            ? initialCrmData.filter(d => d.status === 'Pending').length
                            : submitted.length;

                    return (
                        <Card
                            key={mod.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isActive ? `ring-2 ring-offset-2 ${colors.card}` : 'border-border'}`}
                            onClick={() => setActiveModule(isActive ? null : mod.id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${colors.icon}`}>
                                            <IconComponent className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{mod.title}</h3>
                                            <p className="text-xs text-muted-foreground">{mod.description}</p>
                                        </div>
                                    </div>
                                    {isActive && <Badge className="bg-primary text-primary-foreground shrink-0">Active</Badge>}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-center p-2 bg-muted/50 rounded">
                                        <p className="font-medium text-[11px] truncate">
                                            {mod.id === 'Accounting' 
                                                ? `SAR ${(submitted.reduce((s, e) => s + e.cost, 0) + otherCosts.reduce((s, e) => s + e.amount, 0)).toLocaleString()}` 
                                                : count}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{mod.id === 'Accounting' ? 'Cost' : 'Total'}</p>
                                    </div>
                                    <div className="text-center p-2 bg-muted/50 rounded">
                                        <p className="font-medium">{secondary}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{mod.id === 'Accounting' ? 'Entries' : 'Pending'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Sub-module content — shown directly, no inner card wrappers */}
            {activeModule === 'PMS' && (
                <FinancePMS submittedIds={submittedIds} onSubmit={handleSubmit} />
            )}
            {activeModule === 'CRM' && (
                <FinanceCRM submittedIds={submittedIds} onSubmit={handleSubmit} />
            )}
            {activeModule === 'Accounting' && (
                <FinanceAccounting submitted={submitted} onUpdate={handleSubmit} />
            )}
        </div>
    );
}
