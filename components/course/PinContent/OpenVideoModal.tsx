"use client"

import { useState } from "react";
import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.css";

interface OpenVideoModalProps {
    videoId?: string;
}

export default function OpenVideoModal({ videoId = "LlCwHnp3kL4" }: OpenVideoModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="absolute-full-center d-flex justify-center items-center">
                <div
                    onClick={() => setIsOpen(true)}
                    className="d-flex justify-center items-center size-60 rounded-full bg-white js-gallery cursor"
                    data-gallery="gallery1"
                    style={{ cursor: "pointer" }}
                >
                    <div className="icon-play text-18"></div>
                </div>
            </div>

            <ModalVideo
                channel="youtube"
                youtube={{ mute: 0, autoplay: 0 }}
                isOpen={isOpen}
                videoId={videoId}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}