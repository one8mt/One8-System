"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Star, UserCircle, ChevronDown, Upload } from "lucide-react";
import { RequestStatusBadge } from "../shared/RequestStatusBadge";
import { CrmReturnModeBadge, CrmReturnTypeBadge } from "../shared/CrmReturnBadges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DonutChart } from "../shared/DonutChart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const returnsRequestsData = [
  {
    id: "RET-001",
    clientName: "Global Retail Group",
    created: "Sep 20",
    invoiceNumber: "INV-2024-1145",
    returnType: "Refund",
    returnMode: "Full",
    amount: "SAR 12,450",
    rating: 4,
    status: "Pending",
    progress: 45,
  },
  {
    id: "RET-002",
    clientName: "Tech Solutions Inc",
    created: "Sep 19",
    invoiceNumber: "INV-2024-1144",
    returnType: "Missing",
    returnMode: "Partial",
    amount: "SAR 8,920",
    rating: 3,
    status: "Approved",
    progress: 100,
  },
  {
    id: "RET-003",
    clientName: "Manufacturing Co Ltd",
    created: "Sep 18",
    invoiceNumber: "INV-2024-1143",
    returnType: "Damage",
    returnMode: "Partial",
    amount: "SAR 5,670",
    rating: 2,
    status: "Flagged",
    progress: 30,
  },
  {
    id: "RET-004",
    clientName: "Office Supplies Plus",
    created: "Sep 17",
    invoiceNumber: "INV-2024-1142",
    returnType: "Exchange",
    returnMode: "Full",
    amount: "SAR 15,230",
    rating: 5,
    status: "Approved",
    progress: 85,
  },
  {
    id: "RET-005",
    clientName: "Wholesale Distributors",
    created: "Sep 16",
    invoiceNumber: "INV-2024-1141",
    returnType: "Refund",
    returnMode: "Partial",
    amount: "SAR 3,450",
    rating: 4,
    status: "Pending",
    progress: 60,
  },
  {
    id: "RET-006",
    clientName: "ABC Corporation",
    created: "Sep 15",
    invoiceNumber: "INV-2024-1140",
    returnType: "Refund",
    returnMode: "Full",
    amount: "SAR 7,890",
    rating: 3,
    status: "Approved",
    progress: 90,
  },
  {
    id: "RET-007",
    clientName: "TechMart LLC",
    created: "Sep 14",
    invoiceNumber: "INV-2024-1139",
    returnType: "Missing",
    returnMode: "Partial",
    amount: "SAR 4,560",
    rating: 2,
    status: "Flagged",
    progress: 25,
  },
  {
    id: "RET-008",
    clientName: "Global Retail Group",
    created: "Sep 13",
    invoiceNumber: "INV-2024-1138",
    returnType: "Refund",
    returnMode: "Full",
    amount: "SAR 9,320",
    rating: 5,
    status: "Pending",
    progress: 55,
  },
  {
    id: "RET-009",
    clientName: "Supply Chain Inc",
    created: "Sep 12",
    invoiceNumber: "INV-2024-1137",
    returnType: "Damage",
    returnMode: "Partial",
    amount: "SAR 6,780",
    rating: 3,
    status: "Pending",
    progress: 40,
  },
  {
    id: "RET-010",
    clientName: "Eastern Traders",
    created: "Sep 11",
    invoiceNumber: "INV-2024-1136",
    returnType: "Exchange",
    returnMode: "Full",
    amount: "SAR 11,450",
    rating: 4,
    status: "Approved",
    progress: 75,
  },
  {
    id: "RET-011",
    clientName: "Metro Supplies",
    created: "Sep 10",
    invoiceNumber: "INV-2024-1135",
    returnType: "Missing",
    returnMode: "Partial",
    amount: "SAR 5,230",
    rating: 2,
    status: "Pending",
    progress: 35,
  },
  {
    id: "RET-012",
    clientName: "Global Retail Group",
    created: "Sep 9",
    invoiceNumber: "INV-2024-1134",
    returnType: "Refund",
    returnMode: "Partial",
    amount: "SAR 8,120",
    rating: 4,
    status: "Approved",
    progress: 95,
  },
  {
    id: "RET-013",
    clientName: "Pacific Wholesale",
    created: "Sep 8",
    invoiceNumber: "INV-2024-1133",
    returnType: "Exchange",
    returnMode: "Full",
    amount: "SAR 13,670",
    rating: 5,
    status: "Pending",
    progress: 65,
  },
  {
    id: "RET-014",
    clientName: "Northern Distributors",
    created: "Sep 7",
    invoiceNumber: "INV-2024-1132",
    returnType: "Missing",
    returnMode: "Partial",
    amount: "SAR 3,890",
    rating: 3,
    status: "Approved",
    progress: 80,
  },
  {
    id: "RET-015",
    clientName: "Global Retail Group",
    created: "Sep 6",
    invoiceNumber: "INV-2024-1131",
    returnType: "Refund",
    returnMode: "Full",
    amount: "SAR 10,560",
    rating: 4,
    status: "Pending",
    progress: 50,
  },
  {
    id: "RET-016",
    clientName: "Desert Innovations",
    created: "Sep 5",
    invoiceNumber: "INV-2024-1130",
    returnType: "Refund",
    returnMode: "Partial",
    amount: "SAR 6,230",
    rating: 3,
    status: "Approved",
    progress: 88,
  },
];

export function IncidentReturnsRequests() {
  const [selectedReturn, setSelectedReturn] = useState<typeof returnsRequestsData[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedColumns, setExpandedColumns] = useState({
    refund: false,
    missing: false,
    damaged: false,
    exchange: false,
  });

  const returnTypeStyles: Record<
    "Refund" | "Missing" | "Damaged" | "Exchange",
    { badge: string; label: string; card: string }
  > = {
    Refund: {
      badge:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800/70",
      label: "text-green-700 dark:text-green-300",
      card: "border-green-200/70 bg-green-50/30 dark:border-green-800/70 dark:bg-green-950/20",
    },
    Missing: {
      badge:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/70",
      label: "text-blue-700 dark:text-blue-300",
      card: "border-blue-200/70 bg-blue-50/30 dark:border-blue-800/70 dark:bg-blue-950/20",
    },
    Damaged: {
      badge:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/70",
      label: "text-red-700 dark:text-red-300",
      card: "border-red-200/70 bg-red-50/30 dark:border-red-800/70 dark:bg-red-950/20",
    },
    Exchange: {
      badge:
        "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700",
      label: "text-amber-800 dark:text-amber-200",
      card: "border-amber-300/70 bg-amber-50/40 dark:border-amber-700 dark:bg-amber-900/30",
    },
  };
  const returnTypeButtonClasses: Record<"Refund" | "Missing" | "Damaged" | "Exchange", string> = {
    Refund:
      "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900/60",
    Missing:
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900/60",
    Damaged:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900/60",
    Exchange:
      "border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200/70 dark:border-amber-700 dark:bg-amber-900/60 dark:text-amber-200 dark:hover:bg-amber-900/80",
  };

  const refundReturns = returnsRequestsData.filter((r) => r.returnType === "Refund");
  const missingReturns = returnsRequestsData.filter((r) => r.returnType === "Missing");
  const damagedReturns = returnsRequestsData.filter((r) => r.returnType === "Damage");
  const exchangeReturns = returnsRequestsData.filter((r) => r.returnType === "Exchange");
  const maxVisible = 6;
  const returnsByProductData = [
    { name: "Cement 50kg", value: 80, color: "#22c55e" },
    { name: "Steel Rods", value: 30, color: "#ef4444" },
    { name: "Paint Cans", value: 60, color: "#eab308" },
    { name: "Tiles", value: 45, color: "#3b82f6" },
  ];

  const getRequestStatus = (status: string) =>
    (["Approved", "Flagged", "Pending"].includes(status) ? status : "Pending") as
      | "Approved"
      | "Flagged"
      | "Pending";

  const getReturnType = (type: string) =>
    (["Refund", "Missing", "Damage", "Exchange"].includes(type) ? type : "Refund") as
      | "Refund"
      | "Missing"
      | "Damage"
      | "Exchange";

  const getReturnMode = (mode: string) =>
    (["Full", "Partial"].includes(mode) ? mode : "Full") as "Full" | "Partial";

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const getIncidentTypeStyle = (type: string) => {
    switch (type) {
      case "Refund":
        return "bg-green-500";
      case "Missing":
        return "bg-blue-500";
      case "Damage":
      case "Damaged":
        return "bg-red-500";
      case "Exchange":
        return "bg-amber-500";
      default:
        return "bg-gray-300";
    }
  };

  const getDetailFor = (returnRequest: typeof returnsRequestsData[0]) => {
    const emailSlug = returnRequest.clientName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const dateTime = `${returnRequest.created}, 2025 2:35 PM`;
    const itemNameByType: Record<string, string> = {
      Refund: "Laptop Dell XPS 15",
      Missing: "Network Switch 48-Port",
      Damage: "Industrial Drill Set",
      Exchange: "Ergonomic Chair Pro",
    };
    const itemName = itemNameByType[returnRequest.returnType] || "Selected Item";

    return {
      email: `${emailSlug}@client.com`,
      dateTime,
      items: [
        {
          id: `${returnRequest.id}-ITEM-1`,
          name: itemName,
          quantity: 2,
          requestedQuantity: 1,
          unitPrice: "SAR 1,250",
          incidentType: returnRequest.returnType,
          selected: true,
        },
        {
          id: `${returnRequest.id}-ITEM-2`,
          name: "Office Chair Ergonomic",
          quantity: 5,
          requestedQuantity: 0,
          unitPrice: "SAR 1,050",
          incidentType: "None",
          selected: false,
        },
        {
          id: `${returnRequest.id}-ITEM-3`,
          name: "Wireless Mouse Logitech",
          quantity: 10,
          requestedQuantity: 0,
          unitPrice: "SAR 120",
          incidentType: "None",
          selected: false,
        },
        {
          id: `${returnRequest.id}-ITEM-4`,
          name: "USB-C Hub Multiport",
          quantity: 8,
          requestedQuantity: 0,
          unitPrice: "SAR 190",
          incidentType: "None",
          selected: false,
        },
      ],
    };
  };

  const parseSar = (value: string) =>
    Number(value.replace(/[^\d.]/g, "")) || 0;

  const handleSelectReturn = (returnRequest: typeof returnsRequestsData[0]) => {
    setSelectedReturn(returnRequest);
    setIsDetailsOpen(true);
    setTimeout(() => {
      const target = document.getElementById("incident-return-details");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  return (
    <div id="incident-returns-requests" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Returns Requests</CardTitle>
          <p className="text-sm text-muted-foreground">Track all your return requests</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${returnTypeStyles.Refund.label}`}>Refund</h4>
                <Badge variant="outline" className={returnTypeStyles.Refund.badge}>
                  {refundReturns.length}
                </Badge>
              </div>
              {(expandedColumns.refund ? refundReturns : refundReturns.slice(0, maxVisible)).map(
                (returnRequest) => (
                  <div
                    key={returnRequest.id}
                    className={`p-3 border rounded-lg transition-colors space-y-2 cursor-pointer ${returnTypeStyles.Refund.card}`}
                    onClick={() => handleSelectReturn(returnRequest)}
                  >
                    <p className="font-medium">{returnRequest.id}</p>
                    <p className="text-sm text-muted-foreground">{returnRequest.invoiceNumber}</p>
                    <p className="text-sm">From: {returnRequest.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {returnRequest.created}
                    </p>
                  </div>
                )
              )}
              {refundReturns.length > maxVisible && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${returnTypeButtonClasses.Refund}`}
                    onClick={() =>
                      setExpandedColumns((prev) => ({ ...prev, refund: !prev.refund }))
                    }
                  >
                    {expandedColumns.refund
                      ? "Show less"
                      : `Show more (${refundReturns.length - maxVisible})`}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${returnTypeStyles.Missing.label}`}>Missing</h4>
                <Badge variant="outline" className={returnTypeStyles.Missing.badge}>
                  {missingReturns.length}
                </Badge>
              </div>
              {(expandedColumns.missing ? missingReturns : missingReturns.slice(0, maxVisible)).map(
                (returnRequest) => (
                  <div
                    key={returnRequest.id}
                    className={`p-3 border rounded-lg transition-colors space-y-2 cursor-pointer ${returnTypeStyles.Missing.card}`}
                    onClick={() => handleSelectReturn(returnRequest)}
                  >
                    <p className="font-medium">{returnRequest.id}</p>
                    <p className="text-sm text-muted-foreground">{returnRequest.invoiceNumber}</p>
                    <p className="text-sm">From: {returnRequest.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {returnRequest.created}
                    </p>
                  </div>
                )
              )}
              {missingReturns.length > maxVisible && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${returnTypeButtonClasses.Missing}`}
                    onClick={() =>
                      setExpandedColumns((prev) => ({ ...prev, missing: !prev.missing }))
                    }
                  >
                    {expandedColumns.missing
                      ? "Show less"
                      : `Show more (${missingReturns.length - maxVisible})`}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${returnTypeStyles.Damaged.label}`}>Damaged</h4>
                <Badge variant="outline" className={returnTypeStyles.Damaged.badge}>
                  {damagedReturns.length}
                </Badge>
              </div>
              {(expandedColumns.damaged ? damagedReturns : damagedReturns.slice(0, maxVisible)).map(
                (returnRequest) => (
                  <div
                    key={returnRequest.id}
                    className={`p-3 border rounded-lg transition-colors space-y-2 cursor-pointer ${returnTypeStyles.Damaged.card}`}
                    onClick={() => handleSelectReturn(returnRequest)}
                  >
                    <p className="font-medium">{returnRequest.id}</p>
                    <p className="text-sm text-muted-foreground">{returnRequest.invoiceNumber}</p>
                    <p className="text-sm">From: {returnRequest.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {returnRequest.created}
                    </p>
                  </div>
                )
              )}
              {damagedReturns.length > maxVisible && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${returnTypeButtonClasses.Damaged}`}
                    onClick={() =>
                      setExpandedColumns((prev) => ({ ...prev, damaged: !prev.damaged }))
                    }
                  >
                    {expandedColumns.damaged
                      ? "Show less"
                      : `Show more (${damagedReturns.length - maxVisible})`}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${returnTypeStyles.Exchange.label}`}>Exchange</h4>
                <Badge variant="outline" className={returnTypeStyles.Exchange.badge}>
                  {exchangeReturns.length}
                </Badge>
              </div>
              {(expandedColumns.exchange ? exchangeReturns : exchangeReturns.slice(0, maxVisible)).map(
                (returnRequest) => (
                  <div
                    key={returnRequest.id}
                    className={`p-3 border rounded-lg transition-colors space-y-2 cursor-pointer ${returnTypeStyles.Exchange.card}`}
                    onClick={() => handleSelectReturn(returnRequest)}
                  >
                    <p className="font-medium">{returnRequest.id}</p>
                    <p className="text-sm text-muted-foreground">{returnRequest.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {returnRequest.created}
                    </p>
                  </div>
                )
              )}
              {exchangeReturns.length > maxVisible && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${returnTypeButtonClasses.Exchange}`}
                    onClick={() =>
                      setExpandedColumns((prev) => ({ ...prev, exchange: !prev.exchange }))
                    }
                  >
                    {expandedColumns.exchange
                      ? "Show less"
                      : `Show more (${exchangeReturns.length - maxVisible})`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Return Types</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={[
                { name: "Refund", value: refundReturns.length, color: "#22c55e" },
                { name: "Exchange", value: exchangeReturns.length, color: "#eab308" },
                { name: "Damaged", value: damagedReturns.length, color: "#ef4444" },
                { name: "Missing", value: missingReturns.length, color: "#3b82f6" },
              ]}
              className="h-64"
              outerRadius={90}
            />
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-sm" />
                <span>Refund</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
                <span>Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm" />
                <span>Damaged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                <span>Missing</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Returns by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={returnsByProductData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={false} />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-lg">
                            <p className="text-sm font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm text-muted-foreground">{payload[0].value} returns</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {returnsByProductData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Return Requests Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    In Process
                  </span>
                  <span className="text-muted-foreground">12 requisitions</span>
                </div>
                <Progress value={27} className="h-2 [&>div]:bg-yellow-500" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Completed
                  </span>
                  <span className="text-muted-foreground">33 requisitions</span>
                </div>
                <Progress value={73} className="h-2 [&>div]:bg-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-semibold mb-1 text-green-600">73%</p>
                <p className="text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isDetailsOpen && !!selectedReturn}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedReturn(null);
          }
        }}
      >
      <DialogContent className="w-[92vw] max-w-[1200px] h-[88vh] overflow-hidden p-4 rounded-2xl left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-sm">
          {selectedReturn && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedReturn.returnType} Request - {selectedReturn.id}
                </DialogTitle>
              </DialogHeader>
              {(() => {
                const details = getDetailFor(selectedReturn);
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Client Name</label>
                        <Input value={selectedReturn.clientName} disabled={!isEditMode} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Invoice Number</label>
                        <Input value={selectedReturn.invoiceNumber} disabled={!isEditMode} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Email</label>
                        <Input value={details.email} disabled={!isEditMode} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Date &amp; Time</label>
                        <Input value={details.dateTime} disabled={!isEditMode} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Return Type</label>
                        <div className="relative">
                          <select
                            className="w-full h-10 rounded-md border bg-muted/30 pl-3 pr-9 text-sm appearance-none disabled:bg-muted/60 disabled:text-muted-foreground disabled:border-border"
                            value={selectedReturn.returnType}
                            disabled={!isEditMode}
                            onChange={() => {}}
                          >
                            <option value="Refund">Refund</option>
                            <option value="Missing">Missing</option>
                            <option value="Damage">Damaged</option>
                            <option value="Exchange">Exchange</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Return Mode</label>
                        <div className="relative">
                          <select
                            className="w-full h-10 rounded-md border bg-muted/30 pl-3 pr-9 text-sm appearance-none disabled:bg-muted/60 disabled:text-muted-foreground disabled:border-border"
                            value={selectedReturn.returnMode}
                            disabled={!isEditMode}
                            onChange={() => {}}
                          >
                            <option value="Full">Full</option>
                            <option value="Partial">Partial</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-medium mb-1">Items</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">Type</TableHead>
                            <TableHead>Item Name</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="text-xs">
                          {details.items.map((item) => (
                            <TableRow
                              key={item.id}
                              className={item.selected ? "bg-green-50/80 dark:bg-green-950/40" : ""}
                            >
                              <TableCell>
                                <div
                                  className={`w-9 h-9 rounded-md ${
                                    item.selected ? "bg-green-500" : getIncidentTypeStyle(item.incidentType)
                                  }`}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell className="text-center">{item.quantity}</TableCell>
                              <TableCell className="text-center">{item.requestedQuantity}</TableCell>
                              <TableCell className="text-right">{item.unitPrice}</TableCell>
                              <TableCell className="text-right">
                                SAR {(parseSar(item.unitPrice) * item.requestedQuantity).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Upload Attachment</label>
                        <label className="flex items-center justify-center gap-2 w-full h-10 rounded-md border bg-background text-sm cursor-pointer hover:bg-muted/50">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span>Choose File</span>
                          <input type="file" className="hidden" />
                        </label>
                      </div>
                      <div className="flex items-end justify-end gap-3">
                        <button
                          type="button"
                          className="px-4 py-2 rounded-md border"
                          onClick={() => setIsEditMode((prev) => !prev)}
                        >
                          {isEditMode ? "View" : "Edit"}
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-md bg-[#0B3AAE] text-white"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All Returns Requests</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete list of all return requests with detailed information
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-scroll">
              <table className="w-full">
                <thead className="sticky top-0 bg-background z-10">
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Request ID</th>
                    <th className="text-left p-3 font-medium">Client Name</th>
                    <th className="text-left p-3 font-medium">Invoice Number</th>
                    <th className="text-left p-3 font-medium">Return Type</th>
                    <th className="text-left p-3 font-medium">Return Mode</th>
                    <th className="text-left p-3 font-medium">Amount</th>
                    <th className="text-left p-3 font-medium">Client Rating</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {returnsRequestsData.map((returnRequest) => (
                    <tr
                      key={returnRequest.id}
                      className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleSelectReturn(returnRequest)}
                    >
                      <td className="p-3">{returnRequest.id}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-muted-foreground" />
                          {returnRequest.clientName}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{returnRequest.invoiceNumber}</td>
                      <td className="p-3">
                        <CrmReturnTypeBadge type={getReturnType(returnRequest.returnType)} />
                      </td>
                      <td className="p-3">
                        <CrmReturnModeBadge mode={getReturnMode(returnRequest.returnMode)} />
                      </td>
                      <td className="p-3 font-medium">{returnRequest.amount}</td>
                      <td className="p-3">{renderStars(returnRequest.rating)}</td>
                      <td className="p-3">
                        <RequestStatusBadge status={getRequestStatus(returnRequest.status)} force />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={returnRequest.progress} className="w-20" />
                          <span className="text-sm text-muted-foreground">
                            {returnRequest.progress}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
