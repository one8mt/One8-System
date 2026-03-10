"use client";

import { useState, useEffect } from "react";
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
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Label } from "../ui/label";

export type ReturnRequestOptions = {
  id: string;
  realId: string;
  clientName: string;
  created: string;
  invoiceNumber: string;
  returnType: string;
  returnMode: string;
  amount: string;
  rating: number;
  status: string;
  progress: number;
  notes?: string;
  attachment?: any;
  items: any[];
};

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
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          {returnRequest.created}
        </p>
        <p className="text-[10px] font-semibold text-foreground">{returnRequest.amount}</p>
      </div>
    </motion.div>
  );
};

export function IncidentKanban() {
  const [returnsRequestsData, setReturnsRequestsData] = useState<ReturnRequestOptions[]>([]);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequestOptions | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [swipeableCardIds, setSwipeableCardIds] = useState<string[]>([]);
  const [actionPath, setActionPath] = useState<'employee' | 'client' | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/incidents/")
      .then((res) => res.json())
      .then((data: any[]) => {
        const mapped = data.map((incident) => {
          const uniqueTypes = [...new Set(incident.items?.map((item: any) => item.incident_type) || [])];
          return {
            id: incident.id.slice(0, 8).toUpperCase(), // Use short UUID as ID
            realId: incident.id,
            clientName: incident.client_name,
            created: new Date(incident.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }),
            invoiceNumber: incident.invoice_id,
            returnType: uniqueTypes.length > 1 ? "Mixed" : (uniqueTypes[0] || "Refund"),
            returnMode: (incident.items?.length > 1) ? "Partial" : "Full",
            amount: "SAR " + (incident.items?.reduce((acc: number, item: any) => acc + (item.quantity * parseFloat(item.unit_price || "0")), 0) || 0).toLocaleString(),
            rating: 4,
            status: incident.status,
            progress: incident.status === "Approved" ? 100 : incident.status === "Pending" ? 45 : 10,
            notes: incident.notes,
            attachment: incident.attachment,
            items: (incident.items || []).map((item: any) => ({
              id: item.id,
              name: item.item_name,
              quantity: item.quantity + 2, // Mock total qty
              requestedQuantity: item.quantity,
              unitPrice: "SAR " + parseFloat(item.unit_price || "0").toLocaleString(),
              incidentType: item.incident_type,
              selected: true
            }))
          };
        });
        setReturnsRequestsData(mapped);
      })
      .catch(err => console.error("Error fetching incidents:", err));
  }, []);

  const handleCardSwipe = (path: "employee" | "client", returnRequest: ReturnRequestOptions) => {
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
    (["Refund", "Missing", "Damage", "Exchange", "Mixed"].includes(type) ? type : "Refund") as
    | "Refund"
    | "Missing"
    | "Damage"
    | "Exchange"
    | "Mixed";

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

  const getDetailFor = (returnRequest: ReturnRequestOptions) => {
    return {
      email: `${returnRequest.clientName.toLowerCase().replace(/[^a-z0-9]/g, "")}@client.com`,
      dateTime: `${returnRequest.created}, 2026 2:35 PM`,
      items: returnRequest.items
    };
  };

  const parseSar = (value: string) =>
    Number(value.replace(/[^\d.]/g, "")) || 0;

  const handleSelectReturn = (returnRequest: ReturnRequestOptions) => {
    setSelectedReturn(returnRequest);
    setIsDetailsOpen(true);
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
                  <div className="space-y-3">
                    {visibleReturns.map((returnRequest) => (
                      <SwipeableListCard
                        key={returnRequest.id}
                        returnRequest={returnRequest}
                        isSwipeable={swipeableCardIds.includes(returnRequest.id)}
                        onClick={() => handleSelectReturn(returnRequest)}
                        onSwipe={(path) => handleCardSwipe(path, returnRequest)}
                      />
                    ))}
                  </div>
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
              <div className="w-full bg-background border shadow-2xl overflow-y-auto crm-scrollbar p-6 rounded-2xl z-10 pb-8 flex-1 max-h-[88vh]">
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
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs">Client Name</Label>
                              <Input value={selectedReturn.clientName} readOnly className="h-9 text-xs" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Invoice Number</Label>
                              <Input value={selectedReturn.invoiceNumber} readOnly className="h-9 text-xs" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Return Mode</Label>
                              <Input value={selectedReturn.returnMode} readOnly className="h-9 text-xs" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs">Email</Label>
                              <Input value={details.email} readOnly className="h-9 text-xs" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Date & Time</Label>
                              <Input value={details.dateTime} readOnly className="h-9 text-xs" />
                            </div>
                          </div>

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
                                {details.items.map((item: any) => {
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
                                      className={item.selected ? "bg-muted/10 border-b" : "border-b"}
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

                          <div className="space-y-4 mt-4 pt-4 border-t">
                            <h3 className="text-sm font-semibold">Internal Note & Attachments</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-xs">Internal Note (Optional)</Label>
                                <Textarea
                                  placeholder="Add instructions, updates, or details..."
                                  rows={2}
                                  value={selectedReturn.notes || ""}
                                  onChange={(e) => {
                                    const updated = { ...selectedReturn, notes: e.target.value };
                                    setSelectedReturn(updated);
                                    setReturnsRequestsData(prev => prev.map(r => r.realId === selectedReturn.realId ? updated : r));
                                  }}
                                  className="resize-none min-h-[80px] text-xs"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Upload Attachment (Optional)</Label>
                                <label className="flex flex-col items-center justify-center gap-2 w-full h-[80px] rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/5 text-xs cursor-pointer hover:bg-muted/10 transition-colors group">
                                  <Upload className="h-5 w-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                                  <span className="text-muted-foreground font-medium px-4 text-center">
                                    {selectedReturn.attachment ? (typeof selectedReturn.attachment === 'string' ? selectedReturn.attachment.split('/').pop() : 'File selected') : 'Click to upload files'}
                                  </span>
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const updated = { ...selectedReturn, attachment: file };
                                        setSelectedReturn(updated);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
                            <button
                              type="button"
                              className="px-6 py-2.5 rounded-md border h-10 hover:bg-muted font-medium transition-colors"
                              onClick={() => setIsDetailsOpen(false)}
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              className="px-8 py-2.5 rounded-md bg-[#0B3AAE] text-white font-semibold shadow-md hover:bg-blue-700 transition"
                              onClick={async () => {
                                const formData = new FormData();
                                formData.append('notes', selectedReturn.notes || '');
                                if (selectedReturn.attachment instanceof File) {
                                  formData.append('attachment', selectedReturn.attachment);
                                }

                                try {
                                  const resp = await fetch(`http://127.0.0.1:8000/api/incidents/${selectedReturn.realId}/`, {
                                    method: 'PATCH',
                                    body: formData,
                                  });
                                  if (resp.ok) {
                                    const updatedIncident = await resp.json();
                                    setReturnsRequestsData(prev => prev.map(r => r.realId === selectedReturn.realId ? {
                                      ...r,
                                      notes: updatedIncident.notes,
                                      attachment: updatedIncident.attachment
                                    } : r));

                                    setSwipeableCardIds((prev) => [...new Set([...prev, selectedReturn.id])]);
                                    setIsDetailsOpen(false);
                                  }
                                } catch (err) {
                                  console.error("Failed to update incident", err);
                                }
                              }}
                            >
                              Submit
                            </button>
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
                        <Input placeholder="Search employee..." className="border-blue-200" />
                      </div>
                      <div className="flex justify-end gap-3 pt-4 mt-6">
                        <button type="button" className="px-5 py-2.5 rounded-md border border-blue-200 text-blue-700 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors" onClick={() => { setActionPath(null); setIsDetailsOpen(false); }}>Cancel</button>
                        <button type="button" className="px-5 py-2.5 rounded-md bg-[#0B3AAE] hover:bg-blue-700 text-white font-medium shadow-md transition" onClick={() => setIsDetailsOpen(false)}>Assign</button>
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
            <div className="max-h-[400px] overflow-y-scroll crm-scrollbar">
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
    </div>
  );
}
