"use client";

import Image from "next/image";

type ResourceCardProps = {
    image: string;
    label: string;
    alt: string;
    iconSize?: string;
};

export default function ResourceCard({
                                         image,
                                         label,
                                         alt,
                                         iconSize = "w-[100px] h-[100px] md:w-[120px] md:h-[120px]",
                                     }: ResourceCardProps) {
    return (
        <div className="flex max-w-35 flex-col items-center text-center">
            <div className={`${iconSize} relative`}>
                <Image
                    src={image}
                    alt={alt}
                    fill
                    className="object-contain"
                />
            </div>

            <span className="mt-2 text-xs font-semibold uppercase text-white/70 md:text-sm">
                {label}
            </span>
        </div>
    );
}