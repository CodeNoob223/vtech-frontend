import { useEffect, useState } from "react";
import getToken from "../../helpers/getLocalStorage";
import { Helmet } from "react-helmet";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import AuthorCard from "../../components/Card/AuthorCard";
import { localhostIP } from "../../App";
import { getRequest, putRequest } from "../../helpers/fetchData";
import { updateNotification } from "../../features/pageNotification/pageNotificationSlice";

export default function Followed() {
    const user = useAppSelector(state => state.userData);
    const dispatch = useAppDispatch();

    const [userList, setUserList] = useState<User[]>([]);

    const getFollowedUsers = async () => {
        if (user._id) {
            const accessToken = await getToken("access");
            const res = await getRequest(`${localhostIP}/api/interact/followed?id=${user._id}`, accessToken);
            setUserList(res.data as User[]);
        }
    }

    const handleFollow = async (userId: string) => {
        if (user._id === "") {
            return dispatch(updateNotification({
                show: true,
                message: "Please login first",
                type: "bg-error"
            }));
        }

        if (user._id === userId) {
            return dispatch(updateNotification({
                show: true,
                message: "You can't follow yourself",
                type: "bg-warning"
            }));
        }

        const accessToken = await getToken("access");
        await putRequest(`${localhostIP}/api/interact/follow?id=${userId}`, accessToken, {})

        await getFollowedUsers();
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
                                    return <AuthorCard
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