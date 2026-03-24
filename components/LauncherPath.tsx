import * as React from "react"

import Step from "@/components/Step"
import { stepsConfig } from "@/utils/stepsConfig"

export default function LauncherPath({ step }: { step: number }) {
    return (
        <div className="relative w-full h-full">
            {stepsConfig.map((config) => (
                <div key={config.id} className="absolute inset-0">
                    <Step step={step} config={config} />
                </div>
            ))}
        </div>
    )
}
