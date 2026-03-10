"use client";

import { useState, useEffect } from "react";
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

// Static data removed in favor of backend fetching

export function IncidentReturnsRequests() {
  const [selectedReturn, setSelectedReturn] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Real Data State
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setIsLoadingIncidents(true);
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/incidents/");
      const data = await resp.json();
      setIncidents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching incidents:", err);
    } finally {
      setIsLoadingIncidents(false);
    }
  };

  // New Incident Search/Creation State
  const [searchInvoiceId, setSearchInvoiceId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [foundInvoice, setFoundInvoice] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [incidentForm, setIncidentForm] = useState<{
    items: Array<{
      invoice_item: string;
      item_name: string;
      item_code: string;
      incident_type: string;
      quantity: number;
      max_qty: number;
    }>;
    notes: string;
  }>({ items: [], notes: "" });

  const handleSearch = async () => {
    if (!searchInvoiceId || !searchEmail) {
      setSearchError("Please enter both Invoice ID and Email");
      return;
    }
    setIsSearching(true);
    setSearchError("");
    setFoundInvoice(null);

    try {
      const resp = await fetch(`http://127.0.0.1:8000/api/invoices/search_by_email/?invoice_id=${searchInvoiceId}&email=${searchEmail}`);
      const data = await resp.json();
      if (!resp.ok) {
        setSearchError(data.error || "Invoice not found");
      } else {
        setFoundInvoice(data);
        // Initialize incident form items
        setIncidentForm({
          notes: "",
          items: data.items.map((i: any) => ({
            invoice_item: i.id,
            item_name: i.item_name,
            item_code: i.item_code,
            incident_type: "Damaged",
            quantity: 0,
            max_qty: i.quantity
          }))
        });
      }
    } catch (err) {
      setSearchError("Connection error. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmitIncident = async () => {
    const activeItems = incidentForm.items.filter(i => i.quantity > 0);
    if (activeItems.length === 0) {
      alert("Please specify at least one item with a quantity greater than zero.");
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await fetch(`http://127.0.0.1:8000/api/incidents/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice: foundInvoice.id,
          notes: incidentForm.notes,
          items: activeItems.map(i => ({
            invoice_item: i.invoice_item,
            incident_type: i.incident_type,
            quantity: i.quantity
          }))
        })
      });

      if (resp.ok) {
        alert("Incident request submitted successfully!");
        setFoundInvoice(null);
        setSearchInvoiceId("");
        setSearchEmail("");
        fetchIncidents(); // Refresh the list
      } else {
        const data = await resp.json();
        alert(`Error: ${data.error || "Failed to submit"}`);
      }
    } catch (err) {
      alert("Error submitting request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRequestStatus = (status: string) =>
    (["Approved", "Flagged", "Pending"].includes(status) ? status : "Pending") as
    | "Approved"
    | "Flagged"
    | "Pending"
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

  // getDetailFor removed as it was for static data

  // Helper functions removed as they are no longer needed


  return (
    <div id="incident-returns-requests" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Submit New Incident</CardTitle>
            <p className="text-xs text-muted-foreground">Search by Invoice ID and Client Email</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Invoice ID</Label>
              <Input
                placeholder="e.g. INV-2026..."
                value={searchInvoiceId}
                onChange={(e) => setSearchInvoiceId(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Client Email</Label>
              <Input
                type="email"
                placeholder="e.g. client@example.com"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="h-9"
              />
            </div>
            {searchError && <p className="text-xs text-red-500 font-medium">{searchError}</p>}
            <Button
              className="w-full h-9 bg-[#0B3AAE] hover:bg-blue-700"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search Invoice"}
            </Button>
          </CardContent>
        </Card>

        {foundInvoice ? (
          <Card className="lg:col-span-2 border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Invoice {foundInvoice.id}</CardTitle>
                  <p className="text-xs text-muted-foreground">Client: {foundInvoice.client_name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setFoundInvoice(null)} className="h-7 text-xs">Reset</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border bg-background overflow-hidden">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="h-8 py-0">
                      <TableHead className="h-8">Item</TableHead>
                      <TableHead className="h-8 text-center">In Stock</TableHead>
                      <TableHead className="h-8 w-24 text-center">Incident Qty</TableHead>
                      <TableHead className="h-8 w-32">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidentForm.items.map((item, idx) => (
                      <TableRow key={item.invoice_item}>
                        <TableCell className="py-1">
                          <p className="font-medium">{item.item_name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.item_code}</p>
                        </TableCell>
                        <TableCell className="text-center py-1">{item.max_qty}</TableCell>
                        <TableCell className="py-1">
                          <Input
                            type="number"
                            min="0"
                            max={item.max_qty}
                            value={item.quantity}
                            onChange={(e) => {
                              const val = Math.min(item.max_qty, Math.max(0, parseInt(e.target.value) || 0));
                              const newItems = [...incidentForm.items];
                              newItems[idx].quantity = val;
                              setIncidentForm({ ...incidentForm, items: newItems });
                            }}
                            className="h-7 text-center focus-visible:ring-blue-500"
                          />
                        </TableCell>
                        <TableCell className="py-1">
                          <Select
                            value={item.incident_type}
                            onValueChange={(val) => {
                              const newItems = [...incidentForm.items];
                              newItems[idx].incident_type = val;
                              setIncidentForm({ ...incidentForm, items: newItems });
                            }}
                          >
                            <SelectTrigger className="h-7 text-[10px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Damaged" className="text-xs">Damaged</SelectItem>
                              <SelectItem value="Missing" className="text-xs">Missing</SelectItem>
                              <SelectItem value="Refund" className="text-xs">Refund</SelectItem>
                              <SelectItem value="Exchange" className="text-xs">Exchange</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Internal Notes / Additional Info</Label>
                <Textarea
                  placeholder="Tell us more about the problem..."
                  className="text-xs min-h-[60px]"
                  value={incidentForm.notes}
                  onChange={(e) => setIncidentForm({ ...incidentForm, notes: e.target.value })}
                />
              </div>

              <Button
                className="w-full h-10 bg-green-600 hover:bg-green-700 font-semibold"
                disabled={isSubmitting}
                onClick={handleSubmitIncident}
              >
                {isSubmitting ? "Submitting..." : "Submit Incident Report"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2 flex items-center justify-center border-dashed bg-muted/20">
            <div className="text-center p-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">Enter an Invoice ID above to report an issue</p>
            </div>
          </Card>
        )}
      </div>

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
                const details = selectedReturn;
                return (
                  <div className="space-y-3 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Client Name</label>
                        <Input value={details.client_name} disabled />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Invoice Number</label>
                        <Input value={details.invoice_id} disabled />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Incident Status</label>
                        <Input value={details.status} disabled />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Submitted At</label>
                        <Input value={new Date(details.created_at).toLocaleString()} disabled />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-medium mb-1">Items Included</h3>
                      <Table className="text-xs">
                        <TableHeader className="bg-muted/30">
                          <TableRow className="h-8 py-0">
                            <TableHead className="w-12 h-8">Type</TableHead>
                            <TableHead className="h-8">Item Name</TableHead>
                            <TableHead className="h-8 text-center">Code</TableHead>
                            <TableHead className="h-8 text-center">Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {details.items?.map((item: any) => (
                            <TableRow key={item.id}>
                              <TableCell className="py-1">
                                <div className={`w-6 h-6 rounded-md ${getIncidentTypeStyle(item.incident_type)}`} />
                              </TableCell>
                              <TableCell className="font-medium py-1">{item.item_name}</TableCell>
                              <TableCell className="text-center py-1">{item.item_code}</TableCell>
                              <TableCell className="text-center font-bold py-1">{item.quantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {details.notes && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Incident Notes</label>
                        <Textarea value={details.notes} readOnly className="text-xs min-h-[60px] bg-muted/20" />
                      </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                      <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(false)}>Close</Button>
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
                  {isLoadingIncidents ? (
                    <tr><td colSpan={9} className="text-center p-8 text-muted-foreground">Loading incidents...</td></tr>
                  ) : incidents.length === 0 ? (
                    <tr><td colSpan={9} className="text-center p-8 text-muted-foreground">No incident requests found.</td></tr>
                  ) : incidents.map((inc) => (
                    <tr
                      key={inc.id}
                      className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedReturn(inc);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <td className="p-3 text-xs font-mono">{inc.id.split('-')[0]}...</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-muted-foreground" />
                          {inc.client_name}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{inc.invoice_id}</td>
                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                          {inc.items?.map((item: any, idx: number) => (
                            <CrmReturnTypeBadge key={idx} type={getReturnType(item.incident_type)} />
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <CrmReturnModeBadge mode={inc.items?.length === 1 ? "Full" : "Partial"} />
                      </td>
                      <td className="p-3 font-medium">---</td>
                      <td className="p-3">{renderStars(4)}</td>
                      <td className="p-3">
                        <RequestStatusBadge status={getRequestStatus(inc.status)} force />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={inc.status === 'Approved' ? 100 : 45} className="w-20" />
                          <span className="text-xs text-muted-foreground">
                            {inc.status === 'Approved' ? '100%' : '45%'}
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

