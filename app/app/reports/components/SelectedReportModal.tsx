"use client"

import { useEffect, useMemo, useState } from "react";
import { Report } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FileIcon from "@/app/app/load-document/components/FileIcon";
import { FaXmark } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";
import { deleteReportById, updateReportById } from "@/app/lib/db/report";
import toast from "react-hot-toast";

interface SelectedReportModal {
    selectedReport: Report | undefined,
}

export default function SelectedReportModal({ selectedReport }: SelectedReportModal) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const [ updateLoading, setUpdateLoading ] = useState<boolean>(false);
    const [ deleteLoading, setDeleteLoading ] = useState<boolean>(false);

    const initialName = useMemo(() => selectedReport?.name ?? selectedReport?.filename ?? "", [ selectedReport ]);

    const [ reportName, setReportName ] = useState<string>(selectedReport?.name ?? selectedReport?.filename ?? "");

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reportSize = useMemo(() => {
        const length = selectedReport?.text.length || 0;
        if (length < 1024) {
            return `${length} B`;
        } else if (length < 1024 * 1024) {
            return `${(length / 1024).toFixed(2)} KB`;
        }
        return `${(length / 1024 / 1024).toFixed(2)} MB`;
    }, [ selectedReport?.text ]);

    const anythingUpdated = useMemo(() => {
        return reportName !== initialName
    }, [ reportName, initialName ]);

    async function handleDelete() {
        try {
            setDeleteLoading(true);
            await deleteReportById(selectedReport?.id as number);
            handleClose();
            toast.success(`Ваш отчет ${reportName} был успешно удален`)
        } catch (error) {
            toast.error("Мы не смогли удалить ваш отчет, попробуйте еще раз через некоторое время")
        } finally {
            setDeleteLoading(false);
        }
    }

    async function handleSave() {
        const updateData = { name: reportName };
        try {
            setUpdateLoading(true);
            await updateReportById(selectedReport?.id as number, updateData);
            handleClose();
            toast.success(`Ваш отчет ${reportName} был успешно обновлен`)
        } catch (error) {
            toast.error("Мы не смогли обновить ваш отчет, попробуйте еще раз через некоторое время")
        } finally {
            setUpdateLoading(false);
        }
    }

    function handleClose() {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete("selectedReportId");
        router.push(pathname + '?' + newSearchParams.toString());
    }

    useEffect(() => {
        const dialog = document.getElementById("selected-report-modal") as HTMLDialogElement;
        if (searchParams.get("selectedReportId")) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [ searchParams ]);

    useEffect(() => {
        if (selectedReport) {
            setReportName(selectedReport.name || selectedReport.filename);
        }
    }, [ selectedReport ]);

    return (
        <dialog id="selected-report-modal" className="modal">
            <div className="modal-box">
                <h3 className="text-lg font-bold">Отчет {reportName}</h3>
                <form method="dialog">
                    <button onClick={handleClose} className="absolute top-2 right-2"><FaXmark size={18}/></button>
                </form>
                <div className="flex gap-x-2 items-center">
                    <FileIcon filename={selectedReport?.filename || ""}/>
                    <div className="flex-1 flex flex-col gap-y-3">
                        <label className="w-full flex items-center justify-between gap-x-2">
                            <span className="label-text text-sm">Название</span>
                            <input type="text" placeholder="Type here" value={reportName}
                                   onChange={event => setReportName(event.target.value)}
                                   className="border-b-2 border-gray-400 focus:outline-none focus-visible:outline-none
                                   max-w-[280px] w-full indent-2"/>
                        </label>
                        {/*<label className="w-full flex items-center justify-between gap-x-2">*/}
                        {/*    <span className="label-text text-sm">Файл</span>*/}
                        {/*    <input type="text" placeholder="Type here"*/}
                        {/*           className="input input-sm input-bordered max-w-[280px] w-full"/>*/}
                        {/*</label>*/}
                        <label className="w-full flex items-center justify-between gap-x-2">
                            <span className="label-text text-sm">Размер</span>
                            <input type="text" defaultValue={reportSize} disabled
                                   className="border-b-2 border-gray-400 focus:border-gray-800 focus:border-0 focus-visible:border-0
                                   focus:border-b-2 focus-visible:border-b-2 max-w-[280px] w-full indent-2 "/>
                        </label>
                    </div>
                </div>
                <div className="modal-action w-full  gap-x-3">
                    <button className="btn  btn-sm btn-error" onClick={handleDelete}>{deleteLoading ?
                        <span className="loading loading-spinner"/> : <FaTrashCan/>}</button>
                    <div className="flex-1"/>
                    <button className="btn  btn-sm btn-warning" onClick={handleSave} disabled={!anythingUpdated}>
                        {updateLoading ? <span className="loading loading-spinner"/> : "Save"}
                    </button>
                    <button className="btn btn-sm " onClick={handleClose}>Cancel</button>
                </div>
            </div>


            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
            </form>
        </dialog>
    )
}