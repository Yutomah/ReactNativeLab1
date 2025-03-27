import React, { createContext, useState, useCallback, useMemo } from "react";
import {MarkerType, ContextType} from "@/components/types";


export const Context = createContext<ContextType>({markers: [], setMarkers: null});


export function GlobalContextProvider({ children }:any){
    const [markers, setMarkers] = useState<MarkerType[]>([]);
    return (
        <Context.Provider value={{ markers, setMarkers }}>
            {children}
        </Context.Provider>
    );
}