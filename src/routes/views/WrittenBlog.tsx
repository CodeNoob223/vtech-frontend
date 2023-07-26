import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import "easymde/dist/easymde.min.css";
import axios from "axios";
import getToken from "../../helpers/getLocalStorage";
import MessageBox from "../../components/Notification/MessageBox";
import SmallCard from "../../components/Card/SmallCard";
import ButtonLink from "../../components/Button/ButtonLink";
import { Helmet } from "react-helmet";
import { useAppSelector } from "../../app/hook";
import { localhostIP } from "../../App";

export default function WrittenBlog() {
    const user = useAppSelector(state => state.userData);

    const [notification, setNotification] = useState<PageNotification>({
        show: false,
        type: "bg-error",
        message: ""
    });

    const [buttonPos, setButtonPos] = useState<string>("fixed");
    const [blogList, setBlogList] = useState<Blog[]>([]);

    const handleDeleteBlog = async (blogId: string) => {
        const accessToken = await getToken("access");

        try {
            const { data } = await axios.delete(`http://${localhostIP}:3001/api/blog/${blogId}`, {
                headers: {
                    "auth-token": accessToken
                }
            });

            setNotification({
                type: "bg-success",
                show: true,
                message: data.message
            });

            await getBlogs();

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

    const getBlogs = async () => {
        if (user._id) {
            try {
                const res = await axios.get(`http://${localhostIP}:3001/api/blog/getblogs/${user._id}`);
                setBlogList(res.data.data);
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

    const copyToClipboard = (value: string) => {
        // Copy the text inside the text field
        navigator.clipboard.writeText(value);
        setNotification({
            show: true,
            type: "bg-success",
            message: "Copied url to clipboard!"
        });
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