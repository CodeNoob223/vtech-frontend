import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import "easymde/dist/easymde.min.css";
import axios from "axios";
import getToken from "../../helpers/getLocalStorage";
import MessageBox from "../../components/Notification/MessageBox";
import { Helmet } from "react-helmet";
import { useAppSelector } from "../../app/hook";
import AuthorCard from "../../components/Card/AuthorCard";
import { localhostIP } from "../../App"; 

export default function Followed() {
    const user = useAppSelector(state => state.userData);

    const [notification, setNotification] = useState<PageNotification>({
        show: false,
        type: "bg-error",
        message: ""
    });

    const [userList, setUserList] = useState<User[]>([]);

    const getFollowedUsers = async () => {
        if (user._id) {
            const accessToken = await getToken("access");
            try {
                const res = await axios.get(`http://${localhostIP}:3001/api/interact/followed?id=${user._id}`);
                setUserList(res.data.data);
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

    const handleFollow = async (userId: string) => {
        if (user._id === "") {
            return setNotification({
                show: true,
                message: "Please login first",
                type: "bg-error"
            });
        }

        if (user._id === userId) {
            return setNotification({
                show: true,
                message: "You can't follow yourself",
                type: "bg-warning"
            });
        }

        const accessToken = await getToken("access");
        try {
            await axios.put(`http://${localhostIP}:3001/api/interact/follow?id=${userId}`, {}, {
                headers: {
                    "auth-token": accessToken
                }
            })

            await getFollowedUsers();

            //navigate(0);
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

    useEffect(() => {
        if (user._id) {
            getFollowedUsers();
        }
    }, []);

    return (
        <div className="relative">
            <Helmet>
                <title>{(user.notifications.length > 0) ? `(${user.notifications.length})` : ""} Your blogs</title>
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
            <div className="bg-secondary w-[96vw] h-max rounded-3xl mx-auto p-1 mt-[8vh] relative">
                <div className="bg-black w-full h-full rounded-[22px] px-8 py-[60px]">
                    {/* BLOG CONTENT */}
                    <div className="absolute top-[-15px] sm:top-[-22px] left-7 sm:left-8 px-2 text-white bg-black">
                        <h1 className="text-[6vw] sm:text-[32px]">
                            Followed
                        </h1>
                    </div>

                    <div className="w-full px-2">
                        <div className="w-full grid min-[1254px]:grid-cols-4 2xl:grid-cols-5 min-[977px]:grid-cols-3 min-[633px]:grid-cols-2 gap-4">
                            {userList.length > 0 ?
                                userList.map((child) => {
                                    return  <AuthorCard
                                            _id={child._id}
                                            key={child._id}
                                            avatar={child.avatar}
                                            isAdmin={child.isAdmin}
                                            isFollowed={user.follows?.includes(child._id as string) || false}
                                            name={child.name}
                                            notifications={[]}
                                            onFollow={handleFollow}
                                            profession={child.profession}
                                            isCertified={child.isCertified || false}
                                        />
                                        
                                })
                                : <p className="text-white02">You haven't followed anyone!</p>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
} 