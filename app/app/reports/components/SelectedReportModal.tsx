"use client"

import { useSelectedReport } from "@/app/app/reports/contexts/SelectedReportContext";

export default function SelectedReportModal() {

    const { selectedReportId, setSelectedReportId } = useSelectedReport();

    return (
        <dialog id="selected-report-modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click outside to close</p>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={() => setSelectedReportId(-1)}>close</button>
            </form>
        </dialog>
    )
}