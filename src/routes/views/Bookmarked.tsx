import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import "easymde/dist/easymde.min.css";
import getToken from "../../helpers/getLocalStorage";
import SmallCard from "../../components/Card/SmallCard";
import { Helmet } from "react-helmet";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { localhostIP } from "../../App";
import { updateNotification } from "../../features/pageNotification/pageNotificationSlice";
import { getRequest, putRequest } from "../../helpers/fetchData";

export default function BookmarkedBlog() {
    const user = useAppSelector(state => state.userData);
    const dispatch = useAppDispatch();

    const [blogList, setBlogList] = useState<Blog[]>([]);

    const handleRemoveBookmark = async (blogId: string) => {
        if (user._id === "") {
            return dispatch(updateNotification({
                show: true,
                message: "Please login first",
                type: "bg-error"
            }));
        }

        const accessToken = await getToken("access");
        const res = await putRequest(`${localhostIP}/api/interact/bookmark?id=${blogId}`, accessToken, {});

        dispatch(updateNotification({
            type: "bg-success",
            message: res.message,
            show: true
        }));

        //navigate(0);
    }

    const getBlogs = async () => {
        if (user._id) {
            const accessToken = await getToken("access");

            const res = await getRequest(`${localhostIP}/api/blog/bookmarked?id=${user._id}`, accessToken);
            setBlogList(res.data as Blog[]);
        }
    }

    const copyToClipboard = (value: string) => {
        // Copy the text inside the text field
        navigator.clipboard.writeText(value);
        dispatch(updateNotification({
            show: true,
            type: "bg-success",
            message: "Copied url to clipboard!"
        }));
    }

    useEffect(() => {
        if (user._id) {
            getBlogs();
        }
    }, []);

    return (
        <div className="relative">
            <Helmet>
                <title>{(user.notifications.length > 0) ? `(${user.notifications.length})` : ""} Bookmarks</title>
                <meta name="description" content="Bookmarked blogs" />
            </Helmet>
            <div className="bg-secondary w-[96vw] h-max rounded-3xl mx-auto p-1 mt-[8vh] relative">
                <div className="bg-black w-full h-full rounded-[22px] px-8 py-[60px]">
                    {/* BLOG CONTENT */}
                    <div className="absolute top-[-15px] sm:top-[-22px] left-7 sm:left-8 px-2 text-white bg-black">
                        <h1 className="text-[6vw] sm:text-[32px]">
                            Bookmarks
                        </h1>
                    </div>

                    <div className="w-full px-2">
                        <div className="w-full flex flex-row flex-shrink-0 flex-wrap gap-4">
                            {blogList.length > 0 ?
                                blogList.map((child) => {
                                    return <div
                                        key={child._id}
                                        className="relative items-center w-full"
                                    >
                                        <SmallCard
                                            _id={child.author._id!}
                                            authorName={child.author.name}
                                            blogUrl={`/blog/${child._id}`}
                                            description={child.description as string}
                                            likesCount={child.likesCount as number}
                                            time={child.time}
                                            title={child.title}
                                            viewsCount={child.viewsCount as number}
                                            coverImage={child.coverImage}
                                            myStyles="mr-auto"
                                        />
                                        <div className="absolute right-0 top-[50%] translate-y-[-50%]">
                                            <Button
                                                iconPos="none"
                                                content=""
                                                icon="icon-Delete"
                                                myStyles="bg-none text-error"
                                                handleClick={() => handleRemoveBookmark(child._id as string)}
                                            />
                                            <Button
                                                iconPos="none"
                                                content=""
                                                icon="icon-Share"
                                                myStyles="bg-none text-success"
                                                handleClick={() => { copyToClipboard(`http://${localhostIP}:5173/blog/${child._id}`) }}
                                            />
                                        </div>
                                    </div>
                                })
                                : <p className="text-white02">No blog bookmarked!</p>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
} 