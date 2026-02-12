"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Star, Upload } from "lucide-react";

interface ClientFeedbackModalProps {
  open: boolean;
  onClose: () => void;
  feedbackData?: {
    id?: string;
    clientName: string;
    product?: string;
    clientType?: string;
    date?: string;
    rating?: number;
    feedbackType?: string;
    notes?: string;
  };
  isEditMode?: boolean;
}

export function ClientFeedbackModal({
  open,
  onClose,
  feedbackData,
  isEditMode = false,
}: ClientFeedbackModalProps) {
  const [clientName, setClientName] = useState(
    feedbackData?.clientName || "TechCorp Solutions"
  );
  const [product, setProduct] = useState(feedbackData?.product || "");
  const [clientType, setClientType] = useState(feedbackData?.clientType || "VIP");
  const [date, setDate] = useState(
    feedbackData?.date || new Date().toISOString().split("T")[0]
  );
  const [rating, setRating] = useState(feedbackData?.rating || 0);
  const [feedbackType, setFeedbackType] = useState(
    feedbackData?.feedbackType || "Positive"
  );
  const [notes, setNotes] = useState(feedbackData?.notes || "");

  const handleSubmit = () => {
    console.log({
      clientName,
      product,
      clientType,
      date,
      rating,
      feedbackType,
      notes,
    });
    onClose();
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= currentRating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            } ${
              interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""
            }`}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? `Feedback - ${feedbackData?.id}` : "New Feedback"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Product</Label>
              <Input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Type</Label>
              <Select value={clientType} onValueChange={setClientType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            {renderStars(rating, true)}
            <p className="text-xs text-muted-foreground">Click on stars to rate</p>
          </div>

          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Positive">Positive</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
                <SelectItem value="Negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Enter your feedback details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Attachment</Label>
            <Button variant="outline" className="gap-2 w-full">
              <Upload className="h-4 w-4" />
              Choose File
            </Button>
            <p className="text-xs text-muted-foreground">
              Optional: Upload supporting documents or images
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{isEditMode ? "Update" : "Submit"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
