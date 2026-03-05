"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Star, UserCircle, ChevronDown, Upload, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { NewCrmStatusBadge } from "./NewCrmStatusBadge";
import { CrmReturnModeBadge, CrmReturnTypeBadge } from "../shared/CrmReturnBadges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
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
    status: "New",
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
    status: "New",
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
    status: "New",
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
    status: "New",
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

export type ReturnRequestOptions = typeof returnsRequestsData[0];
const SwipeableListCard = ({
  returnRequest,
  isSwipeable,
  onClick,
  onSwipe,
}: {
  returnRequest: ReturnRequestOptions;
  isSwipeable: boolean;
  onClick: () => void;
  onSwipe: (path: "employee" | "client") => void;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const dragThreshold = 100;

  const handleDragEnd = (event: any, info: any) => {
    const offsetX = info.offset.x;
    if (offsetX > dragThreshold) {
      onSwipe("employee");
    } else if (offsetX < -dragThreshold) {
      onSwipe("client");
    } else {
      x.set(0); // Snap back
    }
  };

  const status = returnRequest.status;
  let statusColor = "border-blue-300 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20";
  let badgeColor = "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50";
  let displayStatus = "New Request";

  if (status === "Approved") {
    displayStatus = "Done";
    statusColor = "border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20";
    badgeColor = "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50";
  } else if (status === "Pending") {
    displayStatus = "Pending";
    statusColor = "border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20";
    badgeColor = "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/50";
  } else if (status === "Flagged") {
    displayStatus = "Overdue";
    statusColor = "border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20";
    badgeColor = "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50";
  } else if (status === "New") {
    displayStatus = "New Request";
    statusColor = "border-blue-300 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20";
    badgeColor = "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50";
  }

  return (
    <motion.div
      drag={isSwipeable ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
      className={`p-3 border rounded-lg transition-all space-y-2 cursor-pointer relative ${statusColor} ${isSwipeable ? "ring-2 ring-blue-400 shadow-md animate-pulse z-10" : ""
        }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="font-medium text-sm">{returnRequest.id}</p>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {displayStatus}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{returnRequest.invoiceNumber}</p>
      <p className="text-[10px] text-muted-foreground font-normal">From: {returnRequest.clientName}</p>
      <p className="text-[10px] text-muted-foreground">
        Created: {returnRequest.created}
      </p>
    </motion.div>
  );
};

export function IncidentKanban() {
  const [selectedReturn, setSelectedReturn] = useState<typeof returnsRequestsData[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [swipeableCardIds, setSwipeableCardIds] = useState<string[]>([]);
  const [actionPath, setActionPath] = useState<'employee' | 'client' | null>(null);

  const handleCardSwipe = (path: "employee" | "client", returnRequest: typeof returnsRequestsData[0]) => {
    setSelectedReturn(returnRequest);
    setActionPath(path);
    setIsDetailsOpen(true);
    setSwipeableCardIds((prev) => prev.filter((id) => id !== returnRequest.id));
  };

  const uniqueClients = Array.from(new Set(returnsRequestsData.map((r) => r.clientName)));
  const [expandedColumns, setExpandedColumns] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const clientsPerPage = 4;
  const totalPages = Math.ceil(uniqueClients.length / clientsPerPage);
  const paginatedClients = uniqueClients.slice(currentPage * clientsPerPage, (currentPage + 1) * clientsPerPage);

  const colorStyles = [
    {
      badge: "bg-muted text-muted-foreground border-border",
      label: "text-foreground",
      card: "border-border bg-card",
      button: "border-border bg-background text-foreground hover:bg-muted",
    }
  ];

  const maxVisible = 6;

  const getRequestStatus = (status: string) =>
    (["Approved", "Flagged", "Pending", "New"].includes(status) ? status : "New") as
    | "Approved"
    | "Flagged"
    | "Pending"
    | "New";

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
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
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
          requestedQuantity: 2,
          unitPrice: "SAR 1,050",
          incidentType: "Damage",
          selected: true,
        },
        {
          id: `${returnRequest.id}-ITEM-3`,
          name: "Wireless Mouse Logitech",
          quantity: 10,
          requestedQuantity: 1,
          unitPrice: "SAR 120",
          incidentType: "Exchange",
          selected: true,
        },
        {
          id: `${returnRequest.id}-ITEM-4`,
          name: "USB-C Hub Multiport",
          quantity: 8,
          requestedQuantity: 1,
          unitPrice: "SAR 190",
          incidentType: "Missing",
          selected: true,
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Returns Requests</CardTitle>
            <p className="text-sm text-muted-foreground">Track all your return requests</p>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                type="button"
                className="p-1.5 rounded-md border bg-background hover:bg-muted disabled:opacity-50 transition-colors"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-md border bg-background hover:bg-muted disabled:opacity-50 transition-colors"
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedClients.map((client) => {
              const globalIndex = uniqueClients.indexOf(client);
              const clientReturns = returnsRequestsData.filter((r) => r.clientName === client);
              const style = colorStyles[globalIndex % colorStyles.length];
              const isExpanded = expandedColumns[client];
              const visibleReturns = isExpanded ? clientReturns : clientReturns.slice(0, maxVisible);

              return (
                <div key={client} className="space-y-3">
                  <div className="flex items-center justify-between mb-3 border-b pb-2">
                    <h4 className={`font-semibold shrink-0 pr-2 ${style.label} truncate`}>{client}</h4>
                    <Badge variant="outline" className={`shrink-0 ${style.badge}`}>
                      {clientReturns.length}
                    </Badge>
                  </div>
                  {visibleReturns.map((returnRequest) => (
                    <SwipeableListCard
                      key={returnRequest.id}
                      returnRequest={returnRequest}
                      isSwipeable={swipeableCardIds.includes(returnRequest.id)}
                      onClick={() => handleSelectReturn(returnRequest)}
                      onSwipe={(path) => handleCardSwipe(path, returnRequest)}
                    />
                  ))}
                  {clientReturns.length > maxVisible && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${style.button}`}
                        onClick={() => setExpandedColumns((prev) => ({ ...prev, [client]: !isExpanded }))}
                      >
                        {isExpanded ? "Show less" : `Show more (${clientReturns.length - maxVisible})`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>








      <Dialog
        open={isDetailsOpen && !!selectedReturn}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedReturn(null);
            setActionPath(null);
          }
        }}
      >
        <DialogContent
          className={
            actionPath === null
              ? "w-[92vw] max-w-[1200px] max-h-[88vh] p-0 rounded-2xl left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-sm bg-transparent border-none shadow-none flex flex-col"
              : "w-[90vw] max-w-[400px] p-0 rounded-2xl border-none shadow-none text-sm bg-transparent"
          }
        >
          {selectedReturn && (
            <div className="relative w-full overflow-hidden flex flex-col rounded-2xl">

              <div
                className="w-full bg-background border shadow-2xl overflow-y-auto crm-scrollbar p-6 rounded-2xl z-10 pb-8 flex-1 max-h-[88vh]"
              >
                {actionPath === null ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>
                        {selectedReturn.returnType} Request - {selectedReturn.id}
                      </DialogTitle>
                    </DialogHeader>
                    {(() => {
                      const details = getDetailFor(selectedReturn);
                      return (
                        <div className="space-y-3 mt-4">
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
                                  onChange={() => { }}
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
                                  onChange={() => { }}
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
                            <Table className="[&_td]:px-2 [&_td]:py-1 [&_th]:px-2 [&_th]:py-1 text-xs">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">Type</TableHead>
                                  <TableHead className="text-[11px]">Item Name</TableHead>
                                  <TableHead className="text-center text-[10px]">Quantity</TableHead>
                                  <TableHead className="text-center text-[10px]">Qty</TableHead>
                                  <TableHead className="text-right text-[10px]">Unit Price</TableHead>
                                  <TableHead className="text-right text-[10px]">Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody className="text-xs">
                                {details.items.map((item) => {
                                  let highlightColor = "";
                                  if (item.selected) {
                                    if (item.incidentType === "Refund") highlightColor = "text-green-600 dark:text-green-400 font-bold";
                                    else if (item.incidentType === "Missing") highlightColor = "text-blue-600 dark:text-blue-400 font-bold";
                                    else if (item.incidentType === "Damage" || item.incidentType === "Damaged") highlightColor = "text-red-600 dark:text-red-400 font-bold";
                                    else if (item.incidentType === "Exchange") highlightColor = "text-amber-600 dark:text-amber-400 font-bold";
                                    else highlightColor = "text-green-600 dark:text-green-400 font-bold";
                                  }

                                  return (
                                    <TableRow
                                      key={item.id}
                                      className={item.selected ? "bg-muted/30" : ""}
                                    >
                                      <TableCell>
                                        <div
                                          className={`w-6 h-6 rounded-md ${getIncidentTypeStyle(item.incidentType)}`}
                                        />
                                      </TableCell>
                                      <TableCell className="font-medium text-[11px]">{item.name}</TableCell>
                                      <TableCell className="text-center text-[11px]">{item.quantity}</TableCell>
                                      <TableCell className={`text-center text-[11px] ${highlightColor}`}>{item.requestedQuantity}</TableCell>
                                      <TableCell className="text-right text-[11px]">{item.unitPrice}</TableCell>
                                      <TableCell className={`text-right text-[11px] ${highlightColor}`}>
                                        SAR {(parseSar(item.unitPrice) * item.requestedQuantity).toLocaleString()}
                                      </TableCell>
                                    </TableRow>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </div>

                          <div className="space-y-2 mt-4 pt-4 border-t border-border">
                            <h3 className="text-sm font-medium">Internal Note & Attachments</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label className="text-xs">Internal Note (Optional)</Label>
                                <Textarea placeholder="Add instructions, updates, or details..." rows={2} className="resize-none min-h-[60px] text-xs" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Upload Attachment (Optional)</Label>
                                <label className="flex items-center justify-center gap-2 w-full h-[60px] rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/10 text-xs cursor-pointer hover:bg-muted/30 transition-colors">
                                  <Upload className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground font-medium">Click to upload files</span>
                                  <input type="file" className="hidden" />
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 mt-4 border-t border-border">
                            <div className="flex justify-between items-center pt-2">
                              <button
                                type="button"
                                className="px-4 py-2 rounded-md border h-10 hover:bg-muted transition-colors"
                                onClick={() => setIsEditMode((prev) => !prev)}
                              >
                                {isEditMode ? "View" : "Edit"}
                              </button>
                              <button
                                type="button"
                                className="px-6 py-2.5 rounded-md bg-[#0B3AAE] text-white font-medium shadow-md hover:bg-blue-700 transition"
                                onClick={() => {
                                  setSwipeableCardIds((prev) => [...new Set([...prev, selectedReturn.id])]);
                                  setIsDetailsOpen(false);
                                }}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                ) : actionPath === "employee" ? (
                  <div className="space-y-4 animate-in fade-in duration-300 bg-blue-50/50 dark:bg-blue-950/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/50 h-full flex flex-col justify-center">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-800">
                      <DialogTitle className="font-semibold text-lg text-blue-700 dark:text-blue-400">Assign to Employee</DialogTitle>
                    </div>
                    <div className="space-y-4 pt-2">
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        Select an employee to handle the incident for <span className="font-medium">{selectedReturn.clientName}</span>.
                      </p>
                      <div className="space-y-2">
                        <Label className="text-blue-900 dark:text-blue-200">Employee</Label>
                        <Select>
                          <SelectTrigger className="border-blue-200 focus:ring-blue-500 bg-white dark:bg-black/50">
                            <SelectValue placeholder="Choose an employee..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emp1">Ahmed Al-Faisal (Logistics)</SelectItem>
                            <SelectItem value="emp2">Sarah Smith (Returns)</SelectItem>
                            <SelectItem value="emp3">Mohammed Khalid (Warehouse)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 mt-6">
                        <button type="button" className="px-5 py-2.5 rounded-md border border-blue-200 text-blue-700 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors" onClick={() => { setActionPath(null); setIsDetailsOpen(false); }}>Cancel</button>
                        <button type="button" className="px-5 py-2.5 rounded-md bg-[#0B3AAE] hover:bg-blue-700 text-white font-medium shadow-md transition" onClick={() => setIsDetailsOpen(false)}>Inform</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-300 bg-green-50/50 dark:bg-green-950/20 p-6 rounded-xl border border-green-100 dark:border-green-900/50 h-full flex flex-col justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <DialogTitle className="font-semibold text-lg text-green-700 dark:text-green-400">Send to Client</DialogTitle>
                    <p className="text-sm text-green-900 dark:text-green-200">
                      Are you sure you want to send the finalized incident report to <span className="font-medium text-green-600 dark:text-green-300">{selectedReturn.clientName}</span>?
                    </p>
                    <div className="flex justify-center gap-3 pt-6 mt-4">
                      <button type="button" className="px-5 py-2.5 rounded-md border border-green-200 text-green-700 dark:text-green-400 font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors" onClick={() => { setActionPath(null); setIsDetailsOpen(false); }}>Cancel</button>
                      <button type="button" className="px-5 py-2.5 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium shadow-md transition" onClick={() => setIsDetailsOpen(false)}>Confirm</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
                        <NewCrmStatusBadge status={getRequestStatus(returnRequest.status)} force />
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
    </div >
  );
}
