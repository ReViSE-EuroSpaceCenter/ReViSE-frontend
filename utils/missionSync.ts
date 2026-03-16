export type MissionSyncMessage = {
    lobbyCode: string;
    teamName: string;
    missionsToUpdate: string[];
};

const CHANNEL_NAME = "revise-mission-sync";

export function createMissionSyncChannel() {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
        return null;
    }

    return new BroadcastChannel(CHANNEL_NAME);
}