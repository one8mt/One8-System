"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Star, Upload, Eye } from "lucide-react";
import { cn } from "../../ui/utils";

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
        stageId?: string;
        initialNotes?: string;
        clientAddress?: string;
        clientCity?: string;
        clientCountry?: string;
        deliveryNoteFile?: string;
    };
    isEditable?: boolean;
}

export function InvoiceDetailsModal({ open, onClose, onSubmit, invoiceData, isEditable = false }: InvoiceDetailsModalProps) {
    const [notes, setNotes] = useState(invoiceData.initialNotes || "");
    const [editableInvoice, setEditableInvoice] = useState(invoiceData.invoiceNumber);
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(invoiceData.amount);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (open && invoiceData.id && invoiceData.id !== "Draft") {
            setIsLoading(true);
            fetch(`http://127.0.0.1:8000/api/invoices/${invoiceData.id}/`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.items) {
                        setItems(data.items);
                        setTotalAmount(data.net_total ? `SAR ${data.net_total}` : invoiceData.amount);
                    } else {
                        setItems([]);
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching invoice details:", err);
                    setItems([]);
                    setIsLoading(false);
                });
        } else {
            setItems([]);
        }
    }, [open, invoiceData.id, invoiceData.amount]);

    const handleSave = async () => {
        if (isEditable && invoiceData.stageId) {
            // Save Stage Notes and File using FormData
            try {
                const formData = new FormData();
                formData.append('notes', notes);
                if (selectedFile) {
                    formData.append('delivery_note_file', selectedFile);
                }

                await fetch(`http://127.0.0.1:8000/api/project-stages/${invoiceData.stageId}/`, {
                    method: 'PATCH',
                    body: formData // No Content-Type header needed for FormData
                });
            } catch (err) {
                console.error("Could not save stage data:", err);
            }

            // Save Invoice Items
            if (items.length > 0) {
                for (const item of items) {
                    try {
                        await fetch(`http://127.0.0.1:8000/api/invoice-items/${item.id}/`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                quantity: item.quantity,
                                unit_price: item.unit_price
                            })
                        });
                    } catch (err) {
                        console.error("Could not save item:", item.id, err);
                    }
                }
            }
        }
        if (onSubmit) {
            onSubmit();
        } else {
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto crm-scrollbar p-4">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-lg">Invoice Details - {invoiceData.id}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="space-y-1">
                            <Label className="text-xs">Client Name</Label>
                            <Input value={invoiceData.clientName} readOnly className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Invoice Number</Label>
                            <Input
                                value={isEditable ? editableInvoice : invoiceData.invoiceNumber}
                                onChange={isEditable ? (e) => setEditableInvoice(e.target.value) : undefined}
                                readOnly={!isEditable}
                                className={cn(
                                    "font-mono text-sm h-8",
                                    isEditable ? "border-blue-500 focus:ring-blue-500" : "bg-muted/30"
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Date</Label>
                            <Input value={invoiceData.date} readOnly className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Total Amount</Label>
                            <Input value={totalAmount} readOnly className="h-8 text-sm font-semibold" />
                        </div>
                        {(invoiceData.clientAddress || invoiceData.clientCity || invoiceData.clientCountry) && (
                            <div className="space-y-1 col-span-2">
                                <Label className="text-xs">Client Address</Label>
                                <Input
                                    value={[invoiceData.clientAddress, invoiceData.clientCity, invoiceData.clientCountry].filter(Boolean).join(", ")}
                                    readOnly
                                    className="h-8 text-sm bg-muted/30"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs font-semibold">Items</Label>
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="h-8">
                                        <TableHead className="h-8 py-0 text-xs">Item Code</TableHead>
                                        <TableHead className="h-8 py-0 text-xs">Item Name</TableHead>
                                        <TableHead className="h-8 py-0 text-xs">Qty</TableHead>
                                        <TableHead className="h-8 py-0 text-xs text-right">Unit Price</TableHead>
                                        <TableHead className="h-8 py-0 text-xs text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4">Loading items...</TableCell>
                                        </TableRow>
                                    ) : items.length > 0 ? (
                                        items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{item.item_code}</TableCell>
                                                <TableCell className="py-1 text-xs">{item.item_name}</TableCell>
                                                <TableCell className="py-1">
                                                    {isEditable ? (
                                                        <Input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const newQty = parseInt(e.target.value) || 0;
                                                                const newItems = [...items];
                                                                newItems[index] = {
                                                                    ...item,
                                                                    quantity: newQty,
                                                                    line_total: (newQty * item.unit_price).toFixed(2)
                                                                };
                                                                setItems(newItems);
                                                                const newNet = newItems.reduce((sum, i) => sum + parseFloat(i.line_total), 0);
                                                                setTotalAmount(`SAR ${newNet.toFixed(2)}`);
                                                            }}
                                                            className="w-16 h-7 text-xs"
                                                        />
                                                    ) : <span className="text-xs">{item.quantity}</span>}
                                                </TableCell>
                                                <TableCell className="text-right py-1">
                                                    {isEditable ? (
                                                        <div className="flex items-center justify-end gap-1">
                                                            <span className="text-[10px] text-muted-foreground uppercase">SAR</span>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                value={item.unit_price}
                                                                onChange={(e) => {
                                                                    const newPrice = parseFloat(e.target.value) || 0;
                                                                    const newItems = [...items];
                                                                    newItems[index] = {
                                                                        ...item,
                                                                        unit_price: newPrice,
                                                                        line_total: (item.quantity * newPrice).toFixed(2)
                                                                    };
                                                                    setItems(newItems);
                                                                    const newNet = newItems.reduce((sum, i) => sum + parseFloat(i.line_total), 0);
                                                                    setTotalAmount(`SAR ${newNet.toFixed(2)}`);
                                                                }}
                                                                className="w-20 h-7 text-right font-mono text-xs"
                                                            />
                                                        </div>
                                                    ) : <span className="text-xs">SAR {item.unit_price}</span>}
                                                </TableCell>
                                                <TableCell className="text-right font-medium py-1 text-xs">SAR {item.line_total}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                                No items found for this invoice.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs font-semibold">Internal Notes {isEditable ? "" : "(Read Only)"}</Label>
                        <Textarea
                            placeholder="Enter notes about this invoice lifecycle..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            readOnly={!isEditable}
                            className="text-sm min-h-[60px]"
                        />
                    </div>

                    {isEditable && (
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-semibold">Upload Signature or Delivery Note</Label>
                                {invoiceData.deliveryNoteFile && (
                                    <a
                                        href={invoiceData.deliveryNoteFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <Eye className="h-3 w-3" />
                                        View Current Note
                                    </a>
                                )}
                            </div>
                            <input
                                type="file"
                                id="delivery-note-upload"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setSelectedFile(e.target.files[0]);
                                    }
                                }}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 w-full h-8 text-xs border-dashed"
                                onClick={() => document.getElementById('delivery-note-upload')?.click()}
                            >
                                <Upload className="h-3.5 w-3.5" />
                                {selectedFile ? selectedFile.name : "Choose File"}
                            </Button>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
                            {isEditable ? "Cancel" : "Close"}
                        </Button>
                        {isEditable && (
                            <Button onClick={handleSave} size="sm" className="bg-[#0B3AAE] hover:bg-blue-700 h-8 text-xs">
                                Submit & Close
                            </Button>
                        )}
                        {!isEditable && (
                            <Button onClick={onClose} size="sm" className="bg-[#0B3AAE] hover:bg-blue-700 h-8 text-xs">
                                Done
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
