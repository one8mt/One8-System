"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Star, Upload, Eye } from "lucide-react";

interface InvoiceDetailsModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    invoiceData: {
        id: string;
        clientName: string;
        invoiceNumber: string;
        date: string;
        amount: string;
        status: string;
    };
    isEditable?: boolean;
}

const itemsData = [
    {
        itemCode: "ITM-001",
        itemName: "Laptop Dell XPS",
        qty: 1,
        unitPrice: "SAR 8,500",
        total: "SAR 8,500",
    },
    {
        itemCode: "ITM-042",
        itemName: "Wireless Mouse",
        qty: 2,
        unitPrice: "SAR 150",
        total: "SAR 300",
    },
];

export function InvoiceDetailsModal({ open, onClose, onSubmit, invoiceData, isEditable = false }: InvoiceDetailsModalProps) {
    const [notes, setNotes] = useState("");
    const [editableInvoice, setEditableInvoice] = useState(invoiceData.invoiceNumber);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto crm-scrollbar">
                <DialogHeader>
                    <DialogTitle>Invoice Details - {invoiceData.id}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Client Name</Label>
                            <Input value={invoiceData.clientName} readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label>Invoice Number</Label>
                            <Input
                                value={isEditable ? editableInvoice : invoiceData.invoiceNumber}
                                onChange={(e) => isEditable && setEditableInvoice(e.target.value)}
                                readOnly={!isEditable}
                                className={isEditable ? "border-blue-500 focus:ring-blue-500" : ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input value={invoiceData.date} readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Amount</Label>
                            <Input value={isEditable ? invoiceData.amount : invoiceData.amount} readOnly={!isEditable} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Items</Label>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item Code</TableHead>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead className="text-right">Unit Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {itemsData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.itemCode}</TableCell>
                                            <TableCell>{item.itemName}</TableCell>
                                            <TableCell>{item.qty}</TableCell>
                                            <TableCell className="text-right">{item.unitPrice}</TableCell>
                                            <TableCell className="text-right font-medium">{item.total}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Internal Notes {isEditable ? "" : "(Read Only)"}</Label>
                        <Textarea
                            placeholder="Enter notes about this invoice lifecycle..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            readOnly={!isEditable}
                        />
                    </div>

                    {isEditable && (
                        <div className="space-y-2">
                            <Label>Upload Signature or Delivery Note</Label>
                            <Button variant="outline" className="gap-2 w-full">
                                <Upload className="h-4 w-4" />
                                Choose File
                            </Button>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={onClose}>
                            {isEditable ? "Cancel" : "Close"}
                        </Button>
                        {isEditable && (
                            <Button onClick={onSubmit || onClose} className="bg-[#0B3AAE] hover:bg-blue-700">
                                Submit & Close
                            </Button>
                        )}
                        {!isEditable && (
                            <Button onClick={onSubmit || onClose} className="bg-[#0B3AAE] hover:bg-blue-700">
                                Done
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
