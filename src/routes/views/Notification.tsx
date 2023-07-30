import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import getToken from "../../helpers/getLocalStorage";
import { Helmet } from "react-helmet";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { updateUserNotification } from "../../features/userData/userSlice";
import { localhostIP } from "../../App";
import { deleteRequest, getRequest } from "../../helpers/fetchData";
import { updateNotification } from "../../features/pageNotification/pageNotificationSlice";

export default function NotificationList() {
    const user = useAppSelector(state => state.userData);
    const dispatch = useAppDispatch();

    const [buttonPos, setButtonPos] = useState<string>("fixed bottom-[28px] right-[28px]")

    const handleDeleteNotification = async (id: string, option: "all" | "one") => {
        const accessToken = await getToken("access");
        let url = `${localhostIP}/api/interact/notification?id=${id}`;
        if (option === "all") url = `${localhostIP}/api/interact/allnotification?id=${id}`;

        const res = await deleteRequest(url, accessToken);

        dispatch(updateNotification({
            type: "bg-success",
            show: true,
            message: res.message
        }));

        await getNotification();
    }

    const getNotification = async () => {
        console.log("called get notification");
        if (user._id) {
            const accessToken = await getToken("access");

            const res = await getRequest<UserNotification[]>(`${localhostIP}/api/interact/notification?id=${user._id}`, accessToken);

            dispatch(updateUserNotification(res.data));
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