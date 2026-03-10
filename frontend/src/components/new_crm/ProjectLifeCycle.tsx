"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, XCircle, ChevronRight, ChevronLeft, LayoutDashboard, Target } from "lucide-react";
import { cn } from "../ui/utils";
import { InvoiceDetailsModal } from "./modals/InvoiceDetailsModal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { DonutChart } from "../shared/DonutChart";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    ZAxis,
    Cell
} from "recharts";

interface LifeCycleStage {
    id: string;
    name: string;
    status: "pending" | "active" | "completed" | "rejected";
    invoiceId: string;
    date: string;
    amount: string;
    client: string;
}

const projectData: Record<string, {
    name: string,
    stages: LifeCycleStage[],
    stats: { name: string, value: number, color: string }[],
    summary: { inProcess: number, completed: number, rate: number }
}> = {
    "project-1": {
        name: "Project Alpha",
        stages: [
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
                name: "Delivered",
                status: "pending",
                invoiceId: "INV-2024-501",
                date: "Mar 04",
                amount: "SAR 12,450",
                client: "Global Retail Group",
            },
            {
                id: "close-back",
                name: "Closed",
                status: "pending",
                invoiceId: "INV-2024-501",
                date: "Mar 04",
                amount: "SAR 12,450",
                client: "Global Retail Group",
            },
        ],
        stats: [
            { name: "Done", value: 12, color: "#22c55e" },
            { name: "In Progress", value: 8, color: "#eab308" },
            { name: "Rejected", value: 2, color: "#ef4444" },
        ],
        summary: { inProcess: 8, completed: 12, rate: 60 }
    },
    "project-2": {
        name: "Project Beta",
        stages: [
            {
                id: "to-go",
                name: "To Go",
                status: "completed",
                invoiceId: "INV-2024-602",
                date: "Mar 05",
                amount: "SAR 8,200",
                client: "Tech Solutions Ltd",
            },
            {
                id: "delivery",
                name: "Delivered",
                status: "active",
                invoiceId: "INV-2024-602",
                date: "Mar 05",
                amount: "SAR 8,200",
                client: "Tech Solutions Ltd",
            },
            {
                id: "close-back",
                name: "Closed",
                status: "pending",
                invoiceId: "INV-2024-602",
                date: "Mar 05",
                amount: "SAR 8,200",
                client: "Tech Solutions Ltd",
            },
        ],
        stats: [
            { name: "Done", value: 25, color: "#22c55e" },
            { name: "In Progress", value: 4, color: "#eab308" },
            { name: "Rejected", value: 1, color: "#ef4444" },
        ],
        summary: { inProcess: 4, completed: 25, rate: 86 }
    },
    "project-3": {
        name: "Project Gamma",
        stages: [
            {
                id: "to-go",
                name: "To Go",
                status: "completed",
                invoiceId: "INV-2024-703",
                date: "Mar 06",
                amount: "SAR 15,100",
                client: "Eco Energy Corp",
            },
            {
                id: "delivery",
                name: "Delivered",
                status: "completed",
                invoiceId: "INV-2024-703",
                date: "Mar 06",
                amount: "SAR 15,100",
                client: "Eco Energy Corp",
            },
            {
                id: "close-back",
                name: "Closed",
                status: "active",
                invoiceId: "INV-2024-703",
                date: "Mar 06",
                amount: "SAR 15,100",
                client: "Eco Energy Corp",
            },
        ],
        stats: [
            { name: "Done", value: 5, color: "#22c55e" },
            { name: "In Progress", value: 15, color: "#eab308" },
            { name: "Rejected", value: 3, color: "#ef4444" },
        ],
        summary: { inProcess: 15, completed: 5, rate: 25 }
    }
};

const clientProjectsData = [
    { client: "Global Retail", projects: 80, color: "#22c55e" },
    { client: "Tech Solutions", projects: 30, color: "#ef4444" },
    { client: "Eco Energy", projects: 60, color: "#eab308" },
    { client: "Modern Logistics", projects: 45, color: "#3b82f6" },
];

const projectPerformanceData = [
    { duration: 15, rate: 85, name: "Alpha", client: "Global Retail" },
    { duration: 30, rate: 45, name: "Beta", client: "Tech Solutions" },
    { duration: 10, rate: 95, name: "Gamma", client: "Eco Energy" },
    { duration: 45, rate: 30, name: "Delta", client: "Modern Logistics" },
    { duration: 20, rate: 70, name: "Epsilon", client: "Future Systems" },
    { duration: 35, rate: 60, name: "Zeta", client: "Global Retail" },
    { duration: 50, rate: 20, name: "Theta", client: "Tech Solutions" },
    { duration: 5, rate: 100, name: "Iota", client: "Eco Energy" },
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
        statusText = "Active";
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
            className={`p-3 border rounded-lg transition-all space-y-2 relative w-full ${borderColor} ${bgColor} ${isPrepared ? "ring-2 ring-yellow-400 shadow-md animate-pulse z-10 cursor-grab" :
                stage.status === "active" ? "cursor-pointer" : ""
                }`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-1">
                <p className="font-bold text-sm text-black dark:text-white capitalize tracking-tight">{stage.name}</p>
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

export function ProjectLifeCycle() {
    const [selectedProjectId, setSelectedProjectId] = useState<string>("project-1");
    const [phases, setPhases] = useState<LifeCycleStage[][]>([projectData["project-1"].stages]);
    const [activeStageId, setActiveStageId] = useState<string>(
        projectData["project-1"].stages.find(s => s.status === "active")?.id || "to-go"
    );
    const [preparedStageId, setPreparedStageId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStage, setSelectedStage] = useState<LifeCycleStage | null>(null);

    // Confirmation Dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<{
        stageId: string;
        direction: "right" | "left";
        phaseIndex: number;
    } | null>(null);

    const handleProjectChange = (projectId: string) => {
        setSelectedProjectId(projectId);
        const newStages = projectData[projectId].stages;
        setPhases([newStages]);
        setActiveStageId(newStages.find(s => s.status === "active")?.id || "to-go");
        setPreparedStageId(null);
    };

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

    const triggerSwipe = (stageId: string, direction: "right" | "left", phaseIndex: number) => {
        setPendingAction({ stageId, direction, phaseIndex });
        setConfirmOpen(true);
    };

    const confirmSwipe = () => {
        if (!pendingAction) return;
        const { stageId, direction, phaseIndex } = pendingAction;

        const newPhases = [...phases];
        const currentPhase = [...newPhases[phaseIndex]];
        const stageIndex = currentPhase.findIndex((s) => s.id === stageId);

        if (direction === "right") {
            // Complete current and move next
            currentPhase[stageIndex].status = "completed";
            if (stageIndex < currentPhase.length - 1) {
                currentPhase[stageIndex + 1].status = "active";
                setActiveStageId(currentPhase[stageIndex + 1].id);
            }
            newPhases[phaseIndex] = currentPhase;
        } else {
            // Reject current
            currentPhase[stageIndex].status = "rejected";
            newPhases[phaseIndex] = currentPhase;

            // If it's the last point in the current phase, start a new phase below
            if (stageIndex === currentPhase.length - 1) {
                const newPhase: LifeCycleStage[] = [
                    {
                        id: `to-go-${phases.length + 1}`,
                        name: "To Go",
                        status: "active",
                        invoiceId: `INV-PHASE-${phases.length + 1}`,
                        date: "New Phase",
                        amount: "SAR 0",
                        client: currentPhase[0].client,
                    },
                    {
                        id: `delivery-${phases.length + 1}`,
                        name: "Delivered",
                        status: "pending",
                        invoiceId: `INV-PHASE-${phases.length + 1}`,
                        date: "New Phase",
                        amount: "SAR 0",
                        client: currentPhase[0].client,
                    },
                    {
                        id: `close-back-${phases.length + 1}`,
                        name: "Closed",
                        status: "pending",
                        invoiceId: `INV-PHASE-${phases.length + 1}`,
                        date: "New Phase",
                        amount: "SAR 0",
                        client: currentPhase[0].client,
                    },
                ];
                newPhases.push(newPhase);
                setActiveStageId(newPhase[0].id);
            }
        }

        setPhases(newPhases);
        setConfirmOpen(false);
        setPendingAction(null);
        setPreparedStageId(null);
    };

    return (
        <div className="space-y-8 pt-8 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 md:items-end gap-6">
                <div className="text-left md:col-span-1">
                    <h3 className="text-xl font-bold text-foreground">
                        Project Life Cycle
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Process flow from warehouse to client closing.</p>
                </div>

                <div className="flex justify-center md:col-span-1">
                    <div className="flex items-center w-full max-w-xs relative group pb-1">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
                        <Select value={selectedProjectId} onValueChange={handleProjectChange}>
                            <SelectTrigger className="w-full relative bg-background border border-blue-100 dark:border-blue-900 rounded-lg shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all font-medium py-4 px-4 h-11">
                                <div className="flex items-center gap-2">
                                    <LayoutDashboard className="h-4 w-4 text-blue-500" />
                                    <SelectValue placeholder="Select project" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-2">
                                {Object.entries(projectData).map(([id, project]) => (
                                    <SelectItem key={id} value={id} className="py-3 px-4 focus:bg-blue-50 dark:focus:bg-blue-950 cursor-pointer">
                                        <span className="font-semibold">{project.name}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="md:col-span-1"></div>
            </div>

            <div className="space-y-4">
                {phases.map((phase, phaseIndex) => (
                    <div key={phaseIndex} className="animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                            {phase.map((stage, index) => (
                                <div key={stage.id} className="flex-1 flex flex-col md:flex-row items-center w-full">
                                    <SwipeableStageCard
                                        stage={stage}
                                        isActive={activeStageId === stage.id}
                                        isPrepared={preparedStageId === stage.id}
                                        onClick={() => stage.status === "active" && handleCardClick(stage)}
                                        onSwipe={(dir) => triggerSwipe(stage.id, dir, phaseIndex)}
                                    />
                                    {index < phase.length - 1 && (
                                        <div className="flex items-center justify-center p-4 md:p-6 opacity-30">
                                            <ArrowRight className="h-8 w-8 hidden md:block" />
                                            <ArrowRight className="h-8 w-8 block md:hidden rotate-90" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <AlertDialogContent className="w-[90vw] max-w-[400px] p-0 rounded-2xl border-none shadow-none text-sm bg-transparent">
                        <div className="relative w-full overflow-hidden flex flex-col rounded-2xl">
                            <div className="w-full bg-background border shadow-2xl overflow-y-auto crm-scrollbar p-6 rounded-2xl z-10 pb-8 flex-1 max-h-[88vh]">
                                <div className={cn(
                                    "space-y-4 animate-in fade-in duration-300 p-6 rounded-xl border h-full flex flex-col justify-center text-center",
                                    pendingAction?.direction === "right"
                                        ? "bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900/50"
                                        : "bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50"
                                )}>
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2",
                                        pendingAction?.direction === "right"
                                            ? "bg-green-100 dark:bg-green-900/50"
                                            : "bg-red-100 dark:bg-red-900/50"
                                    )}>
                                        {pendingAction?.direction === "right" ? (
                                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                        )}
                                    </div>

                                    <AlertDialogTitle className={cn(
                                        "font-semibold text-lg",
                                        pendingAction?.direction === "right" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                                    )}>
                                        {pendingAction?.direction === "right" ? "Complete Stage" : "Reject Stage"}
                                    </AlertDialogTitle>

                                    <p className={cn(
                                        "text-sm",
                                        pendingAction?.direction === "right" ? "text-green-900 dark:text-green-200" : "text-red-900 dark:text-red-200"
                                    )}>
                                        Are you sure you want to {pendingAction?.direction === "right" ? "accept and complete" : "reject"} the <span className="font-medium underline decoration-1 underline-offset-2">{phases[pendingAction?.phaseIndex || 0].find(s => s.id === pendingAction?.stageId)?.name}</span> stage?
                                        {pendingAction?.direction === "left" && pendingAction.stageId.includes("close-back") &&
                                            " This will initiate a new lifecycle phase below."}
                                    </p>

                                    <div className="flex justify-center gap-3 pt-6 mt-4">
                                        <button
                                            type="button"
                                            className={cn(
                                                "px-5 py-2.5 rounded-md border font-medium transition-colors",
                                                pendingAction?.direction === "right"
                                                    ? "border-green-200 text-green-700 hover:bg-green-100 dark:hover:bg-green-900/50"
                                                    : "border-red-200 text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50"
                                            )}
                                            onClick={() => {
                                                setConfirmOpen(false);
                                                setPendingAction(null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className={cn(
                                                "px-5 py-2.5 rounded-md text-white font-medium shadow-md transition",
                                                pendingAction?.direction === "right"
                                                    ? "bg-green-600 hover:bg-green-700"
                                                    : "bg-red-600 hover:bg-red-700"
                                            )}
                                            onClick={() => {
                                                setConfirmOpen(false);
                                                confirmSwipe();
                                            }}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </AlertDialog>

            {selectedStage && (
                <InvoiceDetailsModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={selectedStage.id === activeStageId ? handleModalSubmit : undefined}
                    invoiceData={{
                        id: selectedStage.invoiceId,
                        clientName: selectedStage.client,
                        invoiceNumber: selectedStage.invoiceId,
                        date: selectedStage.date,
                        amount: selectedStage.amount,
                        status: selectedStage.status,
                    }}
                    isEditable={selectedStage.id === activeStageId}
                />
            )}


            {/* Analytics Section */}
            <div className="space-y-6 mt-12 pt-12 border-t text-foreground">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Donut Chart: Project Status Distribution */}
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Project Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DonutChart
                                data={projectData[selectedProjectId].stats}
                                className="h-64"
                                outerRadius={90}
                            />
                            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs font-medium">
                                {projectData[selectedProjectId].stats.map((stat) => (
                                    <div key={stat.name} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                                        <span>{stat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bar Chart: Projects by Client */}
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Projects by Client</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={clientProjectsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                        <XAxis dataKey="client" axisLine={false} tick={false} tickLine={false} />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                            domain={[0, 80]}
                                            ticks={[0, 20, 40, 60, 80]}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-background border rounded-lg p-2 shadow-lg">
                                                            <p className="text-sm font-medium">{payload[0].payload.client}</p>
                                                            <p className="text-sm text-muted-foreground">{payload[0].value} projects</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="projects" radius={[2, 2, 0, 0]} barSize={50}>
                                            {clientProjectsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Completion Rate: Landscape Card */}
                <Card className="border border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Project Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-12 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="flex items-center gap-2 text-sm font-medium">
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                            In Process
                                        </span>
                                        <span className="text-[#717182] text-sm">{projectData[selectedProjectId].summary.inProcess} requisitions</span>
                                    </div>
                                    <Progress value={27} className="h-1.5 [&>div]:bg-yellow-500 bg-[#ececf0]" />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="flex items-center gap-2 text-sm font-medium">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                            Completed
                                        </span>
                                        <span className="text-[#717182] text-sm">{projectData[selectedProjectId].summary.completed} requisitions</span>
                                    </div>
                                    <Progress value={73} className="h-1.5 [&>div]:bg-green-500 bg-[#ececf0]" />
                                </div>
                            </div>
                            <div className="flex items-center justify-center pt-8 md:pt-0">
                                <div className="text-center">
                                    <p className="text-4xl font-bold mb-1 text-green-600 tracking-tight">{projectData[selectedProjectId].summary.rate}%</p>
                                    <p className="text-sm font-medium text-[#717182]">Completion Rate</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
