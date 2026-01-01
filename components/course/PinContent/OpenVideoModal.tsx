"use client"

import { useState } from "react";

export default function OpenVideoModal() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="absolute-full-center d-flex justify-center items-center">
            <div
                onClick={() => setIsOpen(true)}
                className="d-flex justify-center items-center size-60 rounded-full bg-white js-gallery cursor"
                data-gallery="gallery1"
            >
                <div className="icon-play text-18"></div>
            </div>
        </div>
    );
}