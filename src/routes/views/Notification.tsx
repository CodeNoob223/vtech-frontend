import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import "easymde/dist/easymde.min.css";
import axios from "axios";
import getToken from "../../helpers/getLocalStorage";
import MessageBox from "../../components/Notification/MessageBox";
import { Helmet } from "react-helmet";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { updateUserNotification } from "../../features/userData/userSlice";
import { localhostIP } from "../../App"; 

export default function NotificationList() {
    const user = useAppSelector(state => state.userData);
    const dispatch = useAppDispatch();

    const [notification, setNotification] = useState<PageNotification>({
        show: false,
        type: "bg-error",
        message: ""
    });

    const [buttonPos, setButtonPos] = useState<string>("fixed bottom-[28px] right-[28px]")

    const handleDeleteNotification = async (id: string, option: "all" | "one") => {
        const accessToken = await getToken("access");
        let url = `http://${localhostIP}:3001/api/interact/notification?id=${id}`;
        if (option === "all") url = `http://${localhostIP}:3001/api/interact/allnotification?id=${id}`;

        try {
            const { data } = await axios.delete(url, {
                headers: {
                    "auth-token": accessToken
                }
            });

            setNotification({
                type: "bg-success",
                show: true,
                message: data.message
            });

            await getNotification();

        } catch (error: any) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const { message } = error.response.data;
                setNotification({ type: "bg-error", show: true, message });
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                setNotification({ type: "bg-error", show: true, message: error.request });
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                setNotification({ type: "bg-error", show: true, message: error.message });
                console.log('Error', error.message);
            }
            console.log(error);
        };
    }

    const getNotification = async () => {
        console.log("called get notification");
        if (user._id) {
            const accessToken = await getToken("access");
            try {
                const res = await axios.get(`http://${localhostIP}:3001/api/interact/notification?id=${user._id}`, {
                    headers: {
                        "auth-token": accessToken
                    }
                });

                dispatch(updateUserNotification(res.data.data));
            } catch (error: any) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    const { message } = error.response.data;
                    setNotification({ type: "bg-error", show: true, message });
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    setNotification({ type: "bg-error", show: true, message: error.request });
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    setNotification({ type: "bg-error", show: true, message: error.message });
                    console.log('Error', error.message);
                }
                console.log(error);
            };
        }
    }

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 < document.documentElement.offsetHeight - 500) {
            setButtonPos("fixed bottom-[28px] right-[28px]");
            return;
        }
        setButtonPos("absolute bottom-[-15px] right-[20px]");
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative">
            <Helmet>
                <title>{(user.notifications.length > 1) ? `(${user.notifications.length}) Notifications` : `(${user.notifications.length}) Notification`}</title>
                <meta name="description" content="Your blogs" />
            </Helmet>
            {notification.show &&
                <MessageBox
                    content={notification.message as string}
                    key={Math.floor(Math.random() * 10).toString() + Date.now().toString()}
                    messageType={notification.type}
                    onClose={() => {
                        setNotification({
                            show: false,
                            type: "bg-error",
                            message: ""
                        })
                    }}
                />}
            <div className="bg-secondary w-[90vw] h-max rounded-3xl mx-auto p-1 mt-[8vh] relative">
                <div className="bg-black w-full h-full rounded-[22px] px-8 py-[60px]">
                    {/* BLOG CONTENT */}
                    <div className="absolute top-[-15px] sm:top-[-22px] left-7 sm:left-8 px-2 text-white bg-black">
                        <h1 className="text-[6vw] sm:text-[32px]">
                            {(user.notifications.length > 1) ? `Notifications (${user.notifications.length})` : `Notification (${user.notifications.length})`}
                        </h1>
                    </div>

                    <div className={`${buttonPos} sm:absolute h-max bottom-[40px] sm:top-[-14px] right-7 sm:right-8 px-2 text-white bg-black`}>
                        <Button
                            iconPos="back"
                            content="Clear all"
                            icon="icon-Delete"
                            myStyles="bg-primary font-medium"
                            handleClick={() => handleDeleteNotification(user._id as string, "all")}
                        />
                    </div>

                    <div className="w-full px-2">
                        <div className="w-full flex flex-row flex-shrink-0 flex-wrap gap-4">
                            {user.notifications.length > 0 ?
                                user.notifications.map((child) => {
                                    return <div
                                        key={child._id}
                                        className="relative flex items-center w-full"
                                    >
                                        <a href={child.url}>
                                            <div className="flex items-center">
                                                <span className={`${child.icon} text-[26px] mr-2 text-primary animate-bounce`}></span>
                                                <h3 className="text-white01">{child.title}</h3>
                                            </div>
                                            <p className="text-white02">{child.content}</p>
                                        </a>
                                        <div className="ml-auto w-max">
                                            <Button
                                                iconPos="none"
                                                content=""
                                                icon="icon-Check"
                                                myStyles="text-success"
                                                handleClick={() => handleDeleteNotification(child._id as string, "one")}
                                            />
                                        </div>
                                    </div>
                                })
                                : <p className="text-white02">No notification!</p>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
} 