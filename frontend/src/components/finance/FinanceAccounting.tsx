import { useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Calculator, DollarSign, Edit2, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { DonutChart } from '../shared/DonutChart';
import { KpiCards } from '../shared/KpiCards';
import { getTooltipStyle, getAxisStyle } from '../ChartColors';
import { otherCosts, InvoiceModal } from './financeShared';
import type { AccountingEntry, DataEntry } from './financeShared';

interface FinanceAccountingProps {
    submitted: AccountingEntry[];
    onUpdate?: (entry: DataEntry, source: 'PMS' | 'CRM') => void;
}

const monthlyTrend = [
    { month: 'Oct', revenue: 42000, cost: 31000 },
    { month: 'Nov', revenue: 58000, cost: 43000 },
    { month: 'Dec', revenue: 37000, cost: 28000 },
    { month: 'Jan', revenue: 65000, cost: 47000 },
    { month: 'Feb', revenue: 72000, cost: 52000 },
    { month: 'Mar', revenue: 0, cost: 0 },
];

export function FinanceAccounting({ submitted, onUpdate }: FinanceAccountingProps) {
    const [selectedInvoice, setSelectedInvoice] = useState<AccountingEntry | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleRowClick = (entry: AccountingEntry) => {
        setSelectedInvoice(entry);
        setIsEditModalOpen(true);
    };

    const totalRevenue = submitted.reduce((s, e) => s + e.amount, 0);
    const totalSubmittedCost = submitted.reduce((s, e) => s + e.cost, 0);
    const totalOtherCosts = otherCosts.reduce((s, e) => s + e.amount, 0);
    const totalCost = totalSubmittedCost + totalOtherCosts;
    const netProfit = totalRevenue - totalCost;
    const margin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0';

    const trendData = monthlyTrend.map((m) =>
        m.month === 'Mar' ? { ...m, revenue: totalRevenue, cost: totalCost } : m
    );

    const barData = submitted.map((e) => ({
        name: e.id,
        Revenue: e.amount,
        Cost: e.cost,
    }));

    const salaries = otherCosts.filter(c => c.category === 'Employee Salaries').reduce((s, c) => s + c.amount, 0);
    const purchasePo = otherCosts.filter(c => c.category === 'PO from Purchase').reduce((s, c) => s + c.amount, 0);
    const inventPo = otherCosts.filter(c => c.category === 'PO from Inventory').reduce((s, c) => s + c.amount, 0);

    const donutData = [
        { name: 'Salaries', value: salaries, color: '#f59e0b' },
        { name: 'PO Purchase', value: purchasePo, color: '#3b82f6' },
        { name: 'PO Inventory', value: inventPo, color: '#8b5cf6' },
        { name: 'Invoice Costs', value: totalSubmittedCost, color: '#ef4444' },
    ];

    const kpis = [
        { title: 'Total Revenue', value: `SAR ${totalRevenue.toLocaleString()}`, change: submitted.length > 0 ? `+${submitted.length} invoices` : '—', icon: DollarSign, changeTone: 'positive' as const },
        { title: 'Total Costs', value: `SAR ${totalCost.toLocaleString()}`, change: `${totalOtherCosts.toLocaleString()} other`, icon: TrendingDown, changeTone: 'negative' as const },
        { title: 'Net Profit', value: `SAR ${netProfit.toLocaleString()}`, change: `${margin}% margin`, icon: TrendingUp, changeTone: netProfit >= 0 ? 'positive' as const : 'negative' as const },
        { title: 'Submitted', value: String(submitted.length), change: 'PMS + CRM', icon: Calculator, changeTone: 'primary' as const },
    ];

    return (
        <div className="space-y-6">
            {/* KPI Row */}
            <KpiCards items={kpis} />

            {/* Submitted Invoices Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Submitted Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    {submitted.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                            <Calculator className="h-10 w-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No submitted invoices yet</p>
                            <p className="text-sm mt-1">Submit invoices from PMS or CRM to log them here</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-medium text-sm">ID</th>
                                        <th className="text-left p-3 font-medium text-sm">Source</th>
                                        <th className="text-left p-3 font-medium text-sm">Client Name</th>
                                        <th className="text-left p-3 font-medium text-sm">Invoice Number</th>
                                        <th className="text-right p-3 font-medium text-sm">Revenue (SAR)</th>
                                        <th className="text-right p-3 font-medium text-sm">Cost (SAR)</th>
                                        <th className="text-left p-3 font-medium text-sm">Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submitted.map((e) => (
                                        <tr
                                            key={e.id + e.submittedAt}
                                            className="border-b hover:bg-muted/50 transition-colors cursor-pointer group"
                                            onClick={() => handleRowClick(e)}
                                        >
                                            <td className="p-3 font-mono font-medium text-foreground text-sm flex items-center gap-2">
                                                {e.id}
                                                <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                                            </td>
                                            <td className="p-3">
                                                <Badge className={`text-xs ${e.source === 'PMS' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {e.source}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-sm">{e.clientName}</td>
                                            <td className="p-3 text-muted-foreground text-sm">{e.invoiceNumber}</td>
                                            <td className="p-3 text-right font-medium text-green-700 text-sm">{e.amount.toLocaleString()}</td>
                                            <td className="p-3 text-right text-red-700 text-sm">{e.cost.toLocaleString()}</td>
                                            <td className="p-3 text-xs text-muted-foreground">{e.submittedAt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-muted/40 border-t-2 font-semibold">
                                        <td colSpan={4} className="p-3 text-right text-sm">Totals</td>
                                        <td className="p-3 text-right text-sm text-green-700">SAR {totalRevenue.toLocaleString()}</td>
                                        <td className="p-3 text-right text-sm text-red-700">SAR {totalSubmittedCost.toLocaleString()}</td>
                                        <td className="p-3 text-right text-sm">—</td>
                                    </tr>
                                    <tr className="bg-blue-50 dark:bg-blue-950 border-t font-bold">
                                        <td colSpan={4} className="p-3 text-right text-sm">Net Profit (Revenue − Invoice Costs − Other Costs)</td>
                                        <td colSpan={3} className={`p-3 text-right text-base ${netProfit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                                            SAR {netProfit.toLocaleString()} ({margin}% margin)
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Other Costs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Other Costs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-medium text-sm">ID</th>
                                    <th className="text-left p-3 font-medium text-sm">Category</th>
                                    <th className="text-left p-3 font-medium text-sm">Description</th>
                                    <th className="text-right p-3 font-medium text-sm">Amount (SAR)</th>
                                    <th className="text-left p-3 font-medium text-sm">Period</th>
                                </tr>
                            </thead>
                            <tbody>
                                {otherCosts.map((c) => (
                                    <tr key={c.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-3 font-mono font-medium text-foreground text-sm">{c.id}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.category === 'Employee Salaries' ? 'bg-amber-100 text-amber-700' :
                                                c.category === 'PO from Purchase' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-purple-100 text-purple-700'
                                                }`}>
                                                {c.category}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-muted-foreground">{c.description}</td>
                                        <td className="p-3 text-right font-semibold text-sm text-red-700">{c.amount.toLocaleString()}</td>
                                        <td className="p-3 text-xs text-muted-foreground">{c.date}</td>
                                    </tr>
                                ))}
                                <tr className="bg-muted/30">
                                    <td colSpan={3} className="p-3 text-right font-semibold text-sm">Total Other Costs</td>
                                    <td className="p-3 text-right font-bold text-sm text-red-700">SAR {totalOtherCosts.toLocaleString()}</td>
                                    <td />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Revenue vs Cost — Area Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue vs Cost — Monthly Trend</CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Mar figures reflect submitted invoices in this session
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" {...getAxisStyle()} />
                                <YAxis {...getAxisStyle()} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                                <Tooltip
                                    contentStyle={getTooltipStyle()}
                                    formatter={(value: number) => [`SAR ${value.toLocaleString()}`, undefined]}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={2} />
                                <Area type="monotone" dataKey="cost" name="Cost" stroke="#ef4444" fill="url(#costGrad)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Two-column: Bar chart + Donut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Breakdown</CardTitle>
                        <p className="text-xs text-muted-foreground">Revenue vs Cost per submitted invoice</p>
                    </CardHeader>
                    <CardContent>
                        {barData.length === 0 ? (
                            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                                Submit invoices from PMS or CRM to see the breakdown
                            </div>
                        ) : (
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} barCategoryGap="30%">
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                        <XAxis dataKey="name" {...getAxisStyle()} />
                                        <YAxis {...getAxisStyle()} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                                        <Tooltip
                                            contentStyle={getTooltipStyle()}
                                            formatter={(value: number) => [`SAR ${value.toLocaleString()}`, undefined]}
                                        />
                                        <Legend />
                                        <Bar dataKey="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cost Breakdown</CardTitle>
                        <p className="text-xs text-muted-foreground">Salaries, PO costs, and invoice costs</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <DonutChart
                                data={donutData}
                                className="h-48 w-full max-w-[200px] shrink-0"
                                innerRadius={50}
                                outerRadius={85}
                                showTooltip
                            />
                            <div className="space-y-2 text-sm flex-1">
                                {donutData.map((d) => (
                                    <div key={d.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-block h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                                            <span className="text-muted-foreground">{d.name}</span>
                                        </div>
                                        <span className="font-medium">SAR {d.value.toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="border-t pt-2 flex items-center justify-between font-semibold">
                                    <span>Total</span>
                                    <span>SAR {donutData.reduce((s, d) => s + d.value, 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {isEditModalOpen && selectedInvoice && (
                <InvoiceModal
                    entry={selectedInvoice}
                    source={selectedInvoice.source}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={(data) => {
                        onUpdate?.(data, selectedInvoice.source);
                        setIsEditModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}
