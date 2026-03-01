"use client";

import React, { createContext, useContext } from "react";

interface MissionContextType {
    teamColor: string;
    teamName: string;
    lobbyCode: string;
    clientId: string;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider = ({
                                    teamColor,
                                    teamName,
                                    lobbyCode,
                                    clientId,
                                    children
                                }: React.PropsWithChildren<MissionContextType>) => {
    return (
        <MissionContext.Provider value={{ teamColor, teamName, lobbyCode, clientId }}>
            {children}
        </MissionContext.Provider>
    );
};

export const useMissionContext = () => {
    const context = useContext(MissionContext);
    if (!context) {
        throw new Error("useMissionContext must be used within a MissionProvider");
    }
    return context;
};