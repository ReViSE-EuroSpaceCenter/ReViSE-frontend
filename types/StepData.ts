import {StepBonus} from "@/types/StepBonus";

export type StepData = {
    id: number;
    title: string;
    text: string;
    bonuses: StepBonus[];
    resources: {
        teams4: string[];
        teams6: string[];
    };
};