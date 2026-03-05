"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { ArrowRight, CheckCircle, Clock, XCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { InvoiceDetailsModal } from "./modals/InvoiceDetailsModal";

interface LifeCycleStage {
    id: string;
    name: string;
    status: "pending" | "active" | "completed" | "rejected";
    invoiceId: string;
    date: string;
    amount: string;
    client: string;
}

const initialStages: LifeCycleStage[] = [
    {
        id: "to-go",
        name: "To Go",
        status: "active",
        invoiceId: "INV-2024-501",
        date: "Mar 04",
        amount: "SAR 12,450",
        client: "Global Retail Group",
    },
    {
        id: "delivery",
        name: "Delivery",
        status: "pending",
        invoiceId: "INV-2024-501",
        date: "Mar 04",
        amount: "SAR 12,450",
        client: "Global Retail Group",
    },
    {
        id: "close-back",
        name: "Close or Back",
        status: "pending",
        invoiceId: "INV-2024-501",
        date: "Mar 04",
        amount: "SAR 12,450",
        client: "Global Retail Group",
    },
];

const SwipeableStageCard = ({
    stage,
    isActive,
    isPrepared,
    onClick,
    onSwipe,
}: {
    stage: LifeCycleStage;
    isActive: boolean;
    isPrepared: boolean;
    onClick: () => void;
    onSwipe: (direction: "right" | "left") => void;
}) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const dragThreshold = 100;

    const handleDragEnd = (_: any, info: any) => {
        if (!isPrepared) return;
        const offsetX = info.offset.x;
        if (offsetX > dragThreshold) {
            onSwipe("right");
        } else if (offsetX < -dragThreshold) {
            onSwipe("left");
        } else {
            x.set(0);
        }
    };

    let borderColor = "border-muted-foreground/20";
    let bgColor = "bg-muted/50 dark:bg-muted/10";
    let badgeColor = "text-muted-foreground bg-muted dark:bg-muted/50";
    let statusText = "Pending";

    if (stage.status === "active") {
        borderColor = "border-amber-300 dark:border-amber-800";
        bgColor = "bg-amber-50/50 dark:bg-amber-950/20";
        badgeColor = "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/50";
        statusText = stage.name;
    } else if (stage.status === "completed") {
        borderColor = "border-green-300 dark:border-green-800";
        bgColor = "bg-green-50/50 dark:bg-green-950/20";
        badgeColor = "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50";
        statusText = "Done";
    } else if (stage.status === "rejected") {
        borderColor = "border-red-300 dark:border-red-800";
        bgColor = "bg-red-50/50 dark:bg-red-950/20";
        badgeColor = "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50";
        statusText = "Rejected";
    }

    return (
        <motion.div
            drag={isPrepared ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
            style={{ x, rotate }}
            className={`p-3 border rounded-lg transition-all space-y-2 cursor-pointer relative w-full ${borderColor} ${bgColor} ${isPrepared ? "ring-2 ring-blue-400 shadow-md animate-pulse z-10" : ""
                }`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-1">
                <p className="font-medium text-sm text-[#0B3AAE] dark:text-blue-400">LC-001</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
                    {statusText}
                </span>
            </div>
            <p className="text-xs font-medium text-foreground">{stage.invoiceId}</p>
            <p className="text-[10px] text-muted-foreground font-normal">From: {stage.client}</p>
            <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-muted-foreground">Created: {stage.date}</p>
                {stage.status === "completed" && <CheckCircle className="h-3 w-3 text-green-600" />}
            </div>
        </motion.div>
    );
};

export function ProductLifeCycle() {
    const [stages, setStages] = useState<LifeCycleStage[]>(initialStages);
    const [activeStageId, setActiveStageId] = useState<string>("to-go");
    const [preparedStageId, setPreparedStageId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStage, setSelectedStage] = useState<LifeCycleStage | null>(null);

    const handleCardClick = (stage: LifeCycleStage) => {
        setSelectedStage(stage);
        setIsModalOpen(true);
    };

    const handleModalSubmit = () => {
        setIsModalOpen(false);
        if (selectedStage) {
            setPreparedStageId(selectedStage.id);
        }
    };

    const handleSwipe = (stageId: string, direction: "right" | "left") => {
        const currentIndex = stages.findIndex((s) => s.id === stageId);
        let nextStages = [...stages];

        if (direction === "right") {
            // Complete current and move next
            nextStages[currentIndex].status = "completed";
            if (currentIndex < stages.length - 1) {
                nextStages[currentIndex + 1].status = "active";
                setActiveStageId(stages[currentIndex + 1].id);
            }
        } else {
            // Reject current
            nextStages[currentIndex].status = "rejected";
        }

        setStages(nextStages);
        setPreparedStageId(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Product Life Cycle</h2>
                    <p className="text-sm text-muted-foreground">Process flow from warehouse to client closing.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                {stages.map((stage, index) => (
                    <div key={stage.id} className="flex-1 flex flex-col md:flex-row items-center w-full">
                        <SwipeableStageCard
                            stage={stage}
                            isActive={activeStageId === stage.id}
                            isPrepared={preparedStageId === stage.id}
                            onClick={() => handleCardClick(stage)}
                            onSwipe={(dir) => handleSwipe(stage.id, dir)}
                        />
                        {index < stages.length - 1 && (
                            <div className="flex items-center justify-center p-4 md:p-6 opacity-30">
                                <ArrowRight className="h-8 w-8 hidden md:block" />
                                <ArrowRight className="h-8 w-8 block md:hidden rotate-90" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedStage && (
                <InvoiceDetailsModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    invoiceData={{
                        id: selectedStage.invoiceId,
                        clientName: selectedStage.client,
                        invoiceNumber: selectedStage.invoiceId,
                        date: selectedStage.date,
                        amount: selectedStage.amount,
                        status: selectedStage.status,
                    }}
                    isEditable={selectedStage.id === "close-back"}
                />
            )}

            {/* Background hint for swipe */}
            {preparedStageId && (
                <div className="flex justify-center gap-12 text-sm font-medium animate-bounce mt-4">
                    <div className="flex items-center gap-2 text-red-500">
                        <ChevronLeft className="h-4 w-4" /> Reject (Swipe Left)
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                        Accept (Swipe Right) <ChevronRight className="h-4 w-4" />
                    </div>
                </div>
            )}
        </div>
    );
}
