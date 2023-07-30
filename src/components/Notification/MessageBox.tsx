import { useEffect, useState } from "react";
import { closeNotification } from "../../features/pageNotification/pageNotificationSlice";
import { useAppDispatch } from "../../app/hook";

type MessageBox = {
    id: string
    content: string,
    messageType?: "bg-success" | "bg-error" | "bg-warning" | "bg-normal",
    onClose?: () => void
}

export default function MessageBox({ id, content = "Placeholder message", messageType = "bg-error", onClose }: MessageBox) {
    const [exit, setExit] = useState(false);
    const [width, setWidth] = useState(0);
    const [intervalID, setIntervalID] = useState<NodeJS.Timer>();
    const dispatch = useAppDispatch();

    const handleStartTimer = () => {
        const idq = setInterval(() => {
            setWidth(prev => {
                if (prev < 100) {
                    return prev + 0.5;
                }

                clearInterval(id);
                return prev;
            });
        }, 20);

        setIntervalID(idq);
    };

    const handlePauseTimer = () => {
        clearInterval(intervalID);
    };

    const handleCloseNotification = () => {
        handlePauseTimer();
        setExit(true);
        setTimeout(() => {
            dispatch(closeNotification(id))
        }, 500)
    };

    useEffect(() => {
        if (width === 100) {
            // Close notification
            handleCloseNotification()
        }
    }, [width])

    useEffect(() => {
        handleStartTimer();
    }, []);

    return (
        <div
            onMouseEnter={handlePauseTimer}
            onMouseLeave={handleStartTimer}
            className={`${exit ? "message-box-leave" : "message-box-enter"} h-[42px] ${messageType} rounded px-3 py-2 w-max flex overflow-hidden`}
        >
            <p className="text-white mr-2">{content}</p>
            <span className="icon-Close cursor-pointer text-white translate-y-1"
                onClick={() => {
                    handleCloseNotification();
                    if (onClose) onClose();
                }}></span>
            <div className="bg-slate-50 opacity-70 absolute w-0 h-1 bottom-0 left-0" style={{ width: `${width}%` }}></div>
        </div>
    )
} 