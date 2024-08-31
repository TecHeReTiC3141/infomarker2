"use client"

import { ReactSortable } from "react-sortablejs";
import ReportCard from "@/app/app/reports/components/ReportCard";
import { useEffect, useState } from "react";
import { Report } from "@prisma/client";
import { updateReportsOrder } from "@/app/app/reports/actions";
import useDebounce from "@/app/hooks";
import toast from "react-hot-toast";

interface ReportListProps {
    initialReports: Report[],
}

export default function ReportList({ initialReports }: ReportListProps) {

    const [ reports, setReports ] = useState<Report[]>(initialReports);
    const [ prevReports, setPrevReports ] = useState<Report[]>(initialReports);
    const [ loading, setLoading ] = useState<boolean>(false);
    const debouncedReports = useDebounce<Report[]>(reports, 400);

    useEffect(() => {
        const initialOrders = prevReports.map(report => report.order).join();
        const debouncedOrders = debouncedReports.map(report => report.order).join();
        const updateReports = async () => {
            if (initialOrders === debouncedOrders) return;
            setLoading(true);
            try {
                console.log("updating", debouncedReports);
                await updateReportsOrder(debouncedReports);
            } catch (error) {
                toast.error(`Failed to update reports order: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        updateReports();
    }, [ debouncedReports, initialReports, prevReports ]);

    async function handleUpdateOrder(newReports: Report[]) {
        setPrevReports(newReports);
        setReports(newReports);
    }

    return (
        <>
            <div className="flex w-full items-center justify-between">
                <h2 className="text-xl font-bold mb-4">Ваши отчеты ({reports.length})</h2>
                {loading && <span className="loading loading-spinner loading-sm" />}
            </div>
            <ReactSortable className="w-full flex gap-x-6 gap-y-4 flex-wrap items-start" list={reports}
                           setList={handleUpdateOrder}
                           animation={200}
                           handle=".handle"
                           delay={2}>
                {reports.map(report => (
                    <ReportCard key={report.id} report={report}/>
                ))}
            </ReactSortable>
        </>
    )

}