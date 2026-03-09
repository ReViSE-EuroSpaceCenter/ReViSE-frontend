"use client";

import React, {createContext, useContext, useMemo} from "react";

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

    const values = useMemo(
        () => ({ teamColor, teamName, lobbyCode, clientId }),
        [teamColor, teamName, lobbyCode, clientId]
    );

    return (
        <MissionContext.Provider value={values}>
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