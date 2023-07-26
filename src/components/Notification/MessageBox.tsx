import { useEffect, useRef, useState } from "react";

type MessageBox = {
    content: string,
    messageType?: "bg-success" | "bg-error" | "bg-warning" | "bg-normal",
    onClose?: () => void
}

export default function MessageBox({ content = "Placeholder message", messageType = "bg-error", onClose }: MessageBox) {
    const [message, setMessage] = useState<{ content: string, messageType: MessageBox["messageType"] }>({
        content,
        messageType,
    });
    const progressBar = useRef<HTMLDivElement>(null);
    const self = useRef<HTMLDivElement>(null);

    const unMount = () => {
        if (self.current?.tagName !== undefined) {
            if (onClose !== undefined) {
                onClose();
            }
            self.current.classList.add("hidden");
        }
    }

    useEffect(() => {
        if (self.current) {
            setMessage({ content, messageType });
            setTimeout(() => {
                let id = setInterval(frame, content.length * 3);
                let width = 1;
                function frame() {
                    if (progressBar.current) {
                        if (width >= 100) {
                            clearInterval(id);
                            unMount();
                        }
                        else {
                            width++;
                            progressBar.current.style.width = width + "%";
                        }
                    }
                }
            }, 600);
        }
    }, [content, messageType]);

    return (
        <div className={`message-box h-[42px] ${message.messageType} z-50 rounded-md px-3 py-2 w-max flex fixed top-14 overflow-hidden`} ref={self}>
            <p className="text-white mr-2">{message.content}</p>
            <span className="icon-Close cursor-pointer text-white translate-y-1"
                onClick={() => {unMount();}}></span>
            <div className="progress-bar absolute w-0 h-1 bottom-0 left-0" ref={progressBar}></div>
        </div>
    )
} 