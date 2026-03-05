"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Star, UserCircle, ChevronDown, Upload, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { RequestStatusBadge } from "../shared/RequestStatusBadge";
import { CrmReturnModeBadge, CrmReturnTypeBadge } from "../shared/CrmReturnBadges";
import { Button } from "../ui/button";
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

export function IncidentReturnsRequests() {
  const [selectedReturn, setSelectedReturn] = useState<typeof returnsRequestsData[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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
  };

  return (
    <div id="incident-returns-requests" className="space-y-6">
      <Dialog
        open={isDetailsOpen && !!selectedReturn}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedReturn(null);
          }
        }}
      >
        <DialogContent className="w-[92vw] max-w-[1200px] max-h-[88vh] p-0 rounded-2xl">
          {selectedReturn && (
            <div className="relative w-full overflow-hidden flex flex-col rounded-2xl bg-background border shadow-2xl p-6 overflow-y-auto crm-scrollbar">
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
                    </div>

                    <div>
                      <h3 className="text-xs font-medium mb-1">Items</h3>
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Type</TableHead>
                            <TableHead>Item Name</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {details.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className={`w-6 h-6 rounded-md ${getIncidentTypeStyle(item.incidentType)}`} />
                              </TableCell>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell className="text-center">{item.quantity}</TableCell>
                              <TableCell className="text-center font-bold">{item.requestedQuantity}</TableCell>
                              <TableCell className="text-right">{item.unitPrice}</TableCell>
                              <TableCell className="text-right font-bold">
                                SAR {(parseSar(item.unitPrice) * item.requestedQuantity).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                      <Button onClick={() => setIsEditMode(!isEditMode)}>
                        {isEditMode ? "Save Changes" : "Edit Request"}
                      </Button>
                    </div>
                  </div>
                );
              })()}
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

