import {SQLiteDatabase, SQLiteProvider, useSQLiteContext} from "expo-sqlite";
import React, { createContext, useState, useCallback, useMemo } from "react";
import DbProvider from './DbProvider';

export const Context = createContext<DbProvider|null>(null);

export function GlobalContextProvider({ children }:any){
    const db = useSQLiteContext();
    const dbProvider = new DbProvider(db);
    return (
        <Context.Provider value={dbProvider}>
            {children}
        </Context.Provider>
    )
}