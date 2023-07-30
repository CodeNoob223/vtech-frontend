import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import getToken from "../../helpers/getLocalStorage";
import SmallCard from "../../components/Card/SmallCard";
import ButtonLink from "../../components/Button/ButtonLink";
import { Helmet } from "react-helmet";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { localhostIP } from "../../App";
import { deleteRequest, getRequest } from "../../helpers/fetchData";
import { updateNotification } from "../../features/pageNotification/pageNotificationSlice";

export default function WrittenBlog() {
    const user = useAppSelector(state => state.userData);

    const dispatch = useAppDispatch()

    const [buttonPos, setButtonPos] = useState<string>("fixed");
    const [blogList, setBlogList] = useState<Blog[]>([]);

    const handleDeleteBlog = async (blogId: string) => {
        const accessToken = await getToken("access");

        const res = await deleteRequest(`${localhostIP}/api/blog/${blogId}`, accessToken);

        dispatch(updateNotification({
            type: "bg-success",
            show: true,
            message: res.message
        }));

        await getBlogs();

    }

    const getBlogs = async () => {
        if (user._id) {
            const res = await getRequest<Blog[]>(`${localhostIP}/api/blog/getblogs/${user._id}`);
            setBlogList(res.data);
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

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 < document.documentElement.offsetHeight - 500) {
            setButtonPos("fixed bottom-[28px] right-[28px]");
            return;
        }
        setButtonPos("absolute bottom-[-15px] right-[20px]");
    };

    useEffect(() => {
        if (user._id) {
            getBlogs();
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative">
            <Helmet>
                <title>{(user.notifications.length > 0) ? `(${user.notifications.length})` : ""} Your blogs</title>
                <meta name="description" content="Your blogs" />
            </Helmet>
            <div className="bg-secondary w-[90vw] h-max rounded-3xl mx-auto p-1 mt-[8vh] relative">
                <div className="bg-black w-full h-full rounded-[22px] px-8 py-[60px]">
                    {/* BLOG CONTENT */}
                    <div className="absolute top-[-15px] sm:top-[-22px] left-7 sm:left-8 px-2 text-white bg-black">
                        <h1 className="text-[6vw] sm:text-[32px]">
                            Your blogs
                        </h1>
                    </div>

                    <div
                        className={`${buttonPos} z-50 sm:z-10 sm:absolute h-max sm:top-[-14px] sm:right-8 px-2 text-white bg-black`}
                    >
                        <ButtonLink
                            to="/write"
                            iconPos="none"
                            content="Add new"
                            icon="icon-Edit"
                            myStyles="bg-primary font-medium"
                        />
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
                                        <div className="absolute right-0 top-0">
                                            <ButtonLink
                                                to={`edit/${child._id}`}
                                                iconPos="none"
                                                content=""
                                                icon="icon-Edit"
                                                myStyles="bg-none text-normal"
                                            />
                                            <Button
                                                iconPos="none"
                                                content=""
                                                icon="icon-Delete"
                                                myStyles="bg-none text-error"
                                                handleClick={() => handleDeleteBlog(child._id as string)}
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
                                : <p className="text-white02">No blog written!</p>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
} 