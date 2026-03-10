"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle, CheckCircle2, AlertCircle, Clock, XCircle, ArrowLeft, ChevronRight, ChevronLeft, LayoutDashboard, Target } from "lucide-react";
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

interface Project {
    name: string;
    phases: LifeCycleStage[][];
}

interface LifeCycleStage {
    id: string;
    name: string;
    status: "pending" | "active" | "completed" | "rejected";
    invoiceId: string;
    date: string;
    amount: string;
    client: string;
    clientAddress?: string;
    clientCity?: string;
    clientCountry?: string;
    deliveryNoteFile?: string;
    notes?: string;
    phase_number?: number;
}

// Remove static projectData entirely
// The clientProjectsData array will be calculated dynamically

const projectPerformanceData: { duration: number, rate: number, name: string, client: string }[] = [];


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
            className={`p-3 border rounded-lg transition-all space-y-2 relative w-full cursor-pointer ${borderColor} ${bgColor} ${isPrepared ? "ring-2 ring-yellow-400 shadow-md animate-pulse z-10 cursor-grab" :
                stage.status === "active" ? "hover:shadow-md" : "hover:bg-muted/60"
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
    const [projectsMap, setProjectsMap] = useState<Record<string, any>>({});
    const [clientStats, setClientStats] = useState<any[]>([]);
    const [globalStats, setGlobalStats] = useState({
        distribution: [
            { name: "Done", value: 0, color: "#22c55e" },
            { name: "In Progress", value: 0, color: "#eab308" },
            { name: "Rejected", value: 0, color: "#ef4444" },
        ],
        summary: { inProcess: 0, completed: 0, rate: 0 }
    });
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");

    const [phases, setPhases] = useState<LifeCycleStage[][]>([]);
    const [activeStageId, setActiveStageId] = useState<string>("");
    const [preparedStageId, setPreparedStageId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStage, setSelectedStage] = useState<LifeCycleStage | null>(null);

    const fetchProjects = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/projects/");
            if (!res.ok) throw new Error("Failed to fetch projects");
            const data: any[] = await res.json();

            const cStats: any = {};
            const newMap: Record<string, Project> = {};
            let pPending = 0, pCompleted = 0, pRejected = 0;
            let phPending = 0, phCompleted = 0, phRejected = 0;

            data.forEach((p: any) => {
                const projectStages = p.stages || [];
                const groupedStages: Record<number, any[]> = {};
                projectStages.forEach((s: any) => {
                    const phaseNum = s.phase_number || 1;
                    if (!groupedStages[phaseNum]) groupedStages[phaseNum] = [];
                    groupedStages[phaseNum].push(s);
                });

                const phaseKeys = Object.keys(groupedStages).map(Number).sort((a, b) => a - b);

                // Populate newMap with full LifeCycleStage objects
                const sortedPhases: LifeCycleStage[][] = phaseKeys.map(key =>
                    groupedStages[key].map((s: any) => ({
                        id: s.id,
                        name: s.stage_name,
                        status: s.status,
                        phase_number: s.phase_number,
                        invoiceId: p.invoice ? String(p.invoice) : "Draft",
                        date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                        amount: "---",
                        client: p.client_name,
                        clientAddress: p.client_address || "",
                        clientCity: p.client_city || "",
                        clientCountry: p.client_country || "",
                        deliveryNoteFile: s.delivery_note_file || "",
                        notes: s.notes || "",
                    }))
                );

                newMap[p.id] = {
                    name: p.title,
                    phases: sortedPhases,
                };

                if (phaseKeys.length === 0) {
                    pPending++;
                    phPending++;
                } else {
                    // Order status (Latest Phase)
                    const latestKey = phaseKeys[phaseKeys.length - 1];
                    const latestPhase = groupedStages[latestKey];
                    const lastInLatest = latestPhase[latestPhase.length - 1];
                    const hasRejectedInLatest = latestPhase.some((s: any) => s.status === 'rejected');

                    if (hasRejectedInLatest) pRejected++;
                    else if (lastInLatest.status === 'completed') pCompleted++;
                    else pPending++;

                    // Process results (All Phases)
                    phaseKeys.forEach((key) => {
                        const phase = groupedStages[key];
                        const lastStage = phase[phase.length - 1];
                        const hasRejected = phase.some((s: any) => s.status === 'rejected');

                        if (hasRejected) phRejected++;
                        else if (lastStage.status === 'completed') phCompleted++;
                        else phPending++;
                    });
                }

                cStats[p.client_name] = (cStats[p.client_name] || 0) + 1;
            });

            const totalOrders = data.length;
            const completionRate = totalOrders > 0 ? Math.round((pCompleted / totalOrders) * 100) : 0;

            setGlobalStats({
                distribution: [
                    { name: "Done", value: phCompleted, color: "#22c55e" },
                    { name: "In Progress", value: phPending, color: "#eab308" },
                    { name: "Rejected", value: phRejected, color: "#ef4444" },
                ],
                summary: { inProcess: pPending, completed: pCompleted, rate: completionRate }
            });

            setProjectsMap(newMap);

            const colors = ["#22c55e", "#ef4444", "#eab308", "#3b82f6"];
            setClientStats(Object.keys(cStats).map((client, i) => ({
                client, projects: cStats[client], color: colors[i % colors.length]
            })));

            return { data, newMap };
        } catch (err) {
            console.error("fetchProjects error:", err);
            return null;
        }
    };

    useEffect(() => {
        fetchProjects().then(result => {
            if (result && result.data.length > 0) {
                const firstId = String(result.data[0].id);
                setSelectedProjectId(firstId);
                const projectData = result.newMap[firstId];
                setPhases(projectData.phases || []);
                setActiveStageId(projectData.phases.flat().find((s: any) => s.status === "active")?.id || "");
            }
        });
    }, []);

    const currentProject = projectsMap[selectedProjectId] || { phases: [] };

    // Confirmation Dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<{
        stageId: string;
        direction: "right" | "left";
        phaseIndex: number;
        isLastInPhase: boolean;
    } | null>(null);

    const handleProjectChange = (projectId: string) => {
        setSelectedProjectId(projectId);
        const projectData = projectsMap[projectId];
        const phasesData = projectData?.phases || [];
        setPhases(phasesData);
        setActiveStageId(phasesData.flat().find((s: any) => s.status === "active")?.id || "");
        setPreparedStageId(null);
    };

    const handleCardClick = (stage: LifeCycleStage) => {
        if (stage.status !== "active") return; // Only allow clicking on active cards
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
        const stageIndex = phases[phaseIndex]?.findIndex((s) => s.id === stageId);
        const isLastInPhase = stageIndex === (phases[phaseIndex]?.length - 1);

        if (direction === "left" && phaseIndex === 0 && stageIndex === 0) {
            return;
        }

        setPendingAction({ stageId, direction, phaseIndex, isLastInPhase });
        setConfirmOpen(true);
    };

    const confirmSwipe = async () => {
        if (!pendingAction) return;
        const { stageId, direction, phaseIndex } = pendingAction;

        let newPhases = [...phases];
        let currentPhase = [...newPhases[phaseIndex]];
        const stageIndex = currentPhase.findIndex((s) => s.id === stageId);

        const updateStage = async (id: string, status: string) => {
            if (!id.includes('to-go') && !id.includes('delivery') && !id.includes('close-back')) {
                try {
                    await fetch(`http://127.0.0.1:8000/api/project-stages/${id}/`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status })
                    });
                } catch (e) {
                    console.error("Could not update stage", id, e);
                }
            }
        };

        if (direction === "right") {
            // Complete current and move next
            currentPhase[stageIndex].status = "completed";
            await updateStage(stageId, "completed");

            if (stageIndex < currentPhase.length - 1) {
                currentPhase[stageIndex + 1].status = "active";
                await updateStage(currentPhase[stageIndex + 1].id, "active");
                setActiveStageId(currentPhase[stageIndex + 1].id);
            }
            newPhases[phaseIndex] = currentPhase;
        } else {
            // Check if it's the last card in the current phase
            if (pendingAction.isLastInPhase) {
                // Reject current
                currentPhase[stageIndex].status = "rejected";
                await updateStage(stageId, "rejected");

                // Branch it in the backend
                try {
                    await fetch(`http://127.0.0.1:8000/api/projects/${selectedProjectId}/create_new_phase/`, {
                        method: 'POST'
                    });
                } catch (err) {
                    console.error("Failed to branch project:", err);
                }
            } else {
                // Revert current
                currentPhase[stageIndex].status = "pending";
                await updateStage(stageId, "pending");

                if (stageIndex > 0) {
                    // Previous becomes active
                    currentPhase[stageIndex - 1].status = "active";
                    await updateStage(currentPhase[stageIndex - 1].id, "active");
                    setActiveStageId(currentPhase[stageIndex - 1].id);
                }
            }
        }

        // Always sync with backend to get latest phase structure and stats
        const res = await fetchProjects();
        if (res && res.newMap[selectedProjectId]) {
            newPhases = res.newMap[selectedProjectId].phases;
        }

        setPhases([...newPhases]);
        setConfirmOpen(false);
        setPendingAction(null);
        setPreparedStageId(null);
    };

    return (
        <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                {Object.entries(projectsMap).map(([id, project]) => (
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

            <div className="space-y-2">
                {phases.map((phase, phaseIndex) => (
                    <div key={phaseIndex} className="animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                            {phase.map((stage, index) => (
                            <div key={stage.id} className="flex-1 flex flex-col md:flex-row items-center w-full">
                                <SwipeableStageCard
                                    stage={stage}
                                    isActive={activeStageId === stage.id}
                                    isPrepared={preparedStageId === stage.id}
                                    onClick={() => handleCardClick(stage)}
                                        onSwipe={(dir) => triggerSwipe(stage.id, dir, phaseIndex)}
                                />
                                    {index < phase.length - 1 && (
                                    <div className="flex items-center justify-center p-2 md:p-4 opacity-30">
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
                            : pendingAction?.isLastInPhase
                                ? "bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50"
                                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50"
                    )}>
                        <div className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-full mb-4 mx-auto",
                            pendingAction?.direction === "right" ? "bg-green-100 dark:bg-green-900/30" : pendingAction?.isLastInPhase ? "bg-red-100 dark:bg-red-900/30" : "bg-amber-100 dark:bg-amber-900/30"
                        )}>
                            {pendingAction?.direction === "right" ? (
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                            ) : pendingAction?.isLastInPhase ? (
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            ) : (
                                <ArrowLeft className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            )}
                        </div>

                        <AlertDialogTitle className={cn(
                            "font-semibold text-lg",
                            pendingAction?.direction === "right" ? "text-green-700 dark:text-green-400" : pendingAction?.isLastInPhase ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"
                        )}>
                            {pendingAction?.direction === "right" ? "Complete Stage" : pendingAction?.isLastInPhase ? "Reject Stage" : "Revert Stage"}
                        </AlertDialogTitle>

                        <p className={cn(
                                        "text-sm",
                            pendingAction?.direction === "right" ? "text-green-900 dark:text-green-200" : pendingAction?.isLastInPhase ? "text-red-900 dark:text-red-200" : "text-amber-900 dark:text-amber-200"
                        )}>
                            Are you sure you want to {pendingAction?.direction === "right" ? "accept and complete" : pendingAction?.isLastInPhase ? "reject" : "revert back from"} the <span className="font-medium underline decoration-1 underline-offset-2">{phases[pendingAction?.phaseIndex || 0]?.find(s => s.id === pendingAction?.stageId)?.name}</span> stage?
                                        {pendingAction?.direction === "left" && pendingAction.isLastInPhase &&
                                            " This will initiate a new lifecycle phase below."}
                                    </p>

                                    <div className="flex justify-center gap-3 pt-6 mt-4">
                                        <button
                                            onClick={() => setConfirmOpen(false)}
                                            className="px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium min-w-[100px]"
                                        >
                                Cancel
                                        </button>
                                        <button
                                onClick={confirmSwipe}
                                className={cn(
                                                "px-6 py-2 rounded-lg text-white font-medium transition-transform active:scale-95 shadow-lg min-w-[100px]",
                                    pendingAction?.direction === "right" ? "bg-green-600 hover:bg-green-700" : pendingAction?.isLastInPhase ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
                                )}
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
                    onSubmit={(selectedStage.id === activeStageId || selectedStage.name === "Delivered" || selectedStage.name === "Closed") ? handleModalSubmit : undefined}
                    invoiceData={{
                        id: selectedStage.invoiceId,
                        clientName: selectedStage.client,
                        invoiceNumber: selectedStage.invoiceId,
                        date: selectedStage.date,
                        amount: selectedStage.amount,
                        status: selectedStage.status,
                        stageId: selectedStage.id,
                        initialNotes: selectedStage.notes,
                        clientAddress: selectedStage.clientAddress,
                        clientCity: selectedStage.clientCity,
                        clientCountry: selectedStage.clientCountry,
                        deliveryNoteFile: selectedStage.deliveryNoteFile,
                    }}
                    isEditable={selectedStage.id === activeStageId || ((selectedStage.name === "Delivered" || selectedStage.name === "Closed") && selectedStage.status !== "pending")}
                />
            )}


            {/* Analytics Section */}
            <div className="space-y-4 mt-6 pt-6 border-t text-foreground">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Donut Chart: Project Status Distribution */}
                    <Card className="border border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Project Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DonutChart
                                data={globalStats.distribution}
                                className="h-64"
                                outerRadius={90}
                            />
                            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs font-medium">
                                {globalStats.distribution.map((stat: any) => (
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
                                    <BarChart data={clientStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                        <XAxis dataKey="client" axisLine={false} tick={false} tickLine={false} />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                            domain={[0, 'dataMax']}
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
                                            {clientStats.map((entry, index) => (
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
                                        <span className="text-[#717182] text-sm">{globalStats.summary.inProcess} requisitions</span>
                                    </div>
                                    <Progress value={globalStats.summary.inProcess > 0 ? Math.round((globalStats.summary.inProcess / (globalStats.summary.inProcess + globalStats.summary.completed)) * 100) : 0} className="h-1.5 [&>div]:bg-yellow-500 bg-[#ececf0]" />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="flex items-center gap-2 text-sm font-medium">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                            Completed
                                        </span>
                                        <span className="text-[#717182] text-sm">{globalStats.summary.completed} requisitions</span>
                                    </div>
                                    <Progress value={globalStats.summary.completed > 0 ? Math.round((globalStats.summary.completed / (globalStats.summary.inProcess + globalStats.summary.completed)) * 100) : 0} className="h-1.5 [&>div]:bg-green-500 bg-[#ececf0]" />
                                </div>
                            </div>
                            <div className="flex items-center justify-center pt-8 md:pt-0">
                                <div className="text-center">
                                    <p className="text-4xl font-bold mb-1 text-green-600 tracking-tight">{globalStats.summary.rate}%</p>
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
