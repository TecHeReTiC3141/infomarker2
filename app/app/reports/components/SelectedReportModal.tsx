"use client"

import { useEffect } from "react";
import { Report } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FileIcon from "@/app/app/load-document/components/FileIcon";
import { FaXmark } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";

interface SelectedReportModal {
    selectedReport: Report | undefined,
}

export default function SelectedReportModal({ selectedReport }: SelectedReportModal) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

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

    return (
        <dialog id="selected-report-modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button onClick={handleClose} className="absolute top-2 right-2"><FaXmark size={18}/></button>
                </form>
                <div className="flex gap-x-2 items-center">
                    <FileIcon filename={selectedReport?.filename || ""}/>
                    <div className="flex-1 flex flex-col gap-y-3">
                        <label className="w-full flex items-center justify-between gap-x-2">
                            <span className="label-text text-sm">Название</span>
                            <input type="text" placeholder="Type here"
                                   className="input input-sm input-bordered max-w-[280px] w-full"/>
                        </label>
                        <label className="w-full flex items-center justify-between gap-x-2">
                            <span className="label-text text-sm">Файл</span>
                            <input type="text" placeholder="Type here"
                                   className="input input-sm input-bordered max-w-[280px] w-full"/>
                        </label>
                        <label className="w-full flex items-center justify-between gap-x-2">
                            <span className="label-text text-sm">Размер</span>
                            <input type="text" placeholder="Type here"
                                   className="input input-sm input-bordered max-w-[280px] w-full"/>
                        </label>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog" className="w-full flex gap-x-3">
                        <button className="btn  btn-sm btn-error"><FaTrashCan/></button>
                        <div className="flex-1"/>
                        <button className="btn  btn-sm btn-warning">Save</button>
                        <button className="btn btn-sm ">Cancel</button>
                    </form>

                </div>
            </div>


            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
            </form>
        </dialog>
    )
}