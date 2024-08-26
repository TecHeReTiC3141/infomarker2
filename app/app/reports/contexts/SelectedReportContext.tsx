"use client"

import { createContext, ReactNode, useContext, useState } from "react";

interface SelectedReportContextValue {
    selectedReportId: number,
    setSelectedReportId: (value: (((prevState: number) => number) | number)) => void,
}

const SelectedReportContext = createContext<SelectedReportContextValue | null>(null);

export function useSelectedReport() {
    return useContext(SelectedReportContext) as SelectedReportContextValue;
}

export default function SelectedReportContextProvider({ children }: { children: ReactNode }) {
    const [ selectedReportId, setSelectedReportId ] = useState<number>(-1);

    const value = { selectedReportId, setSelectedReportId };

    return (
        <SelectedReportContext.Provider value={value}>
            {children}
        </SelectedReportContext.Provider>
    );
}