import { useEffect, useRef, useState } from "react";
import Button from "../../components/Button/Button";
import TinyButton from "../../components/Button/TinyButton";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import getToken from "../../helpers/getLocalStorage";
import { formatDate } from "../../helpers/dateFormatting";
import FileInput from "../../components/Input/FileInput";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAppSelector } from "../../app/hook";
import { localhostIP } from "../../App";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../helpers/fetchData";
import { useAppDispatch } from "../../app/hook";
import { updateNotification } from "../../features/pageNotification/pageNotificationSlice";

export default function EditBlog() {
    const { blogId } = useParams();
    let mdeValue = useRef<string>("");
    const user = useAppSelector(state => state.userData);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [acceptTerm, setAcceptTerm] = useState<boolean>(false);

    const [searchResult, setSearchResult] = useState<SearchResult<Category>>({
        isFocus: false,
        results: []
    });

    const [blogData, setBlogData] = useState<Blog>(
        {
            _id: "",
            author: {
                _id: user?._id || "No id",
                avatar: user?.avatar || "",
                isAdmin: user?.isAdmin || false,
                name: user?.name || "No user found",
                profession: user?.profession || "No user found",
                isCertified: user?.isCertified || false,
                notifications: []
            },
            content: "",
            time: formatDate(new Date()),
            title: "",
            description: "",
            likesCount: 0,
            dislikesCount: 0,
            categories: [],
            tags: [],
            coverImage: "",
            imageFile: undefined,
            attachedImages: [],
            comments: [],
            commentsCount: 0,
            dislikedBy: [],
            likedBy: [],
            viewsCount: 0
        }
    );

    useEffect(() => {
        if (user._id) {
            const fetchData = async () => {
                const res = await getRequest<Blog>(`${localhostIP}/api/blog?id=${blogId}`, "", {
                    "userId": user._id
                }, false);
                const data = res.data as Blog;
                setBlogData({ ...data, attachedImages: data.attachedImages });
                mdeValue.current = data.content;
            }
            fetchData();
        }
    }, []);

    useEffect(() => {
        if (!blogData.imageFile) {
            setBlogData(prev => {
                return {
                    ...prev,
                    coverImage: ""
                }
            });
            return;
        }
        const objectUrl = URL.createObjectURL(blogData.imageFile);
        setBlogData(prev => {
            return {
                ...prev,
                coverImage: objectUrl
            }
        });

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [blogData.imageFile]);

    //Handle uploading cover image
    const handleUploadCover = (file: File, width: number, height: number, url: string) => {
        dispatch(updateNotification({
            type: "bg-error",
            show: false,
            message: ""
        }));
        if (file) {
            setBlogData({
                ...blogData,
                imageFile: file
            });
        }
    }

    const checkInput = (inputList: string[]): boolean => {
        let pattern: RegExp = /\B#([A-Za-z0-9]{2,})(?![~!@#$%^&*()=+_`\-\|\/'\[\]\{\}]|[?.,]*\w)/;
        inputList.forEach(input => {
            if (!pattern.test(input)) {
                dispatch(updateNotification({
                    type: "bg-error",
                    show: true,
                    message: "Tags are not correct!"
                }));
                return false;
            }
        });
        return true
    }

    const copyToClipboard = (value: string) => {
        // Copy the text inside the text field
        navigator.clipboard.writeText(value);
        dispatch(updateNotification({
            show: true,
            type: "bg-success",
            message: "Copied to clipboard!"
        }));
    }

    const searchCategory = async (searchString: string) => {
        const { data } = await getRequest<Category[]>(`${localhostIP}/api/category?name=${searchString}`);
        setSearchResult(prev => {
            return {
                ...prev,
                results: data as Category[]
            }
        });
    }

    const handleDeleteBlog = async () => {
        const accessToken = await getToken("access");

        const { message } = await deleteRequest(`${localhostIP}/api/blog/${blogData._id}`, accessToken);

        dispatch(updateNotification({
            type: "bg-success",
            show: true,
            message: message
        }));

        navigate("/create");
    }

    //Upload blog content to backend
    const handleUploadBlog = async () => {
        const accessToken = await getToken("access");

        if (checkInput(blogData.tags)) {
            if (blogData._id === "") {
                const { message } = await postRequest(`${localhostIP}/api/blog/`, accessToken as string,
                    {
                        ...blogData,
                        content: mdeValue.current,
                        time: formatDate(new Date()),
                        attachedImages: [],
                        categories: blogData.categories.map(category => category._id)
                    },
                    true
                );
                dispatch(updateNotification({
                    type: "bg-success",
                    show: true,
                    message: message
                }));

            } else {
                const { message } = await putRequest(`${localhostIP}/api/blog?id=${blogData._id}`, accessToken as string,
                    {
                        ...blogData,
                        content: mdeValue.current,
                        time: formatDate(new Date()),
                        attachedImages: [],
                        categories: blogData.categories.map(category => category._id)
                    },
                    true
                );
                dispatch(updateNotification({
                    show: true,
                    type: "bg-success",
                    message: message
                }));
            }
        }
    }

    const addCategory = (value: Category) => {
        const newCategoryList: Category[] = blogData.categories;
        if (!newCategoryList.some(element => {
            if (element._id === value._id) return true;

            return false;
        })) {
            newCategoryList.push(value);
        }
        setBlogData({ ...blogData, categories: newCategoryList });
        setSearchResult({
            isFocus: false,
            results: []
        });
    }

    //Delete image from backend
    const handleImageDelete = async (imageId: string) => {
        const accessToken = await getToken("access");

        let res = await deleteRequest(`${localhostIP}/api/blog/removeimage/${imageId}`, accessToken);

        if (blogData._id && res.data) {
            dispatch(updateNotification({
                show: true,
                message: res.message,
                type: "bg-warning"
            }));
            res = await getRequest(`${localhostIP}/api/blog/attachimages/${blogData._id}`, accessToken as string);

            setBlogData(prev => {
                return {
                    ...prev,
                    attachedImages: res.data as attachedImages[]
                }
            });
        }
    }

    //Upload image to backend when user put image inside markdown
    const handleImageUpload = async (image: File, onSuccess: (url: string) => void, onError: (error: string) => void) => {
        const accessToken = await getToken("access");
        let data = await postRequest<{
            success: boolean,
            message: string,
            data: string,
            imageUrl: string,
            source: string
        }>(`${localhostIP}/api/blog/uploadimage`, accessToken as string,
            {
                image: image,
                "blogId": blogData._id
            },
            true,
            true
        );

        onSuccess(data.imageUrl);
        dispatch(updateNotification({
            type: "bg-success",
            show: true,
            message: "Image uploaded!"
        }));

        if (blogData._id) {
            let newres = await getRequest<attachedImages[]>(`${localhostIP}/api/blog/attachimages/${blogData._id}`, accessToken as string);

            setBlogData(prev => {
                return {
                    ...prev,
                    attachedImages: newres.data as attachedImages[]
                }
            });
        } else {
            setBlogData(prev => {
                return {
                    ...prev,
                    _id: data.data
                }
            });
        }
    }

    return (
        <div className="relative">
            <Helmet>
                <title>{(user.notifications.length > 0) ? `(${user.notifications.length})` : ""} Edit your blog</title>
            </Helmet>

            <div className="bg-secondary w-[96vw] h-max rounded-3xl mx-auto p-1 mt-[8vh] relative">
                <div className="bg-black w-full h-full rounded-[22px] px-8 py-[60px]">
                    {/* BLOG CONTENT */}
                    <div className="absolute top-[-10px] sm:top-[-22px] left-7 sm:left-8 px-2 text-white bg-black">
                        <h1 className="text-[6vw] sm:text-[32px]">
                            {blogData.title || "Edit your blog"}
                        </h1>
                    </div>

                    <div className="lg:grid lg:grid-cols-[65%_33%] gap-x-[2%]">
                        <form className="w-full max-w-[864px]"
                            method="POST" aria-autocomplete="list"
                            encType="multipart/form-data"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            {/* BLOG IMAGE COVER */}
                            <FileInput
                                inputTitle="Cover image"
                                name="imageFile"
                                accept="image/png,image/jpeg,image/jpg,image/webg"
                                handleChange={handleUploadCover}
                                myStyles={"mb-[24px]"}
                            />
                            {
                                blogData.coverImage &&
                                <div className="rounded-2xl w-full max-h-[400px] overflow-hidden mb-10">
                                    <img className="w-full h-full object-cover" src={blogData.coverImage} alt="Cover image" />
                                </div>
                            }
                            <div className="w-full text-white03 text-sm sm:text-base">
                                <SimpleMDE
                                    options={{
                                        autosave: {
                                            uniqueId: Date.now.toString(),
                                            enabled: false
                                        },
                                        previewClass: "blog-content",
                                        placeholder: "Write here",
                                        spellChecker: false,
                                        uploadImage: true,
                                        imageUploadFunction: handleImageUpload,
                                    }}
                                    onChange={(value) => {
                                        mdeValue.current = value;
                                    }}
                                    value={mdeValue.current}
                                />
                            </div>
                        </form>
                        <div className="w-full mt-7 min-w-[258px] h-max lg:mt-0">
                            <div className="relative w-full">
                                <div className="absolute left-0 w-full bg-secondary h-[2px] center"></div>
                                <h3 className="relative w-max bg-black pr-2 text-white02 mb-2">Blog's id</h3>
                            </div>
                            <div className="relative w-full h-[40px] mb-5">
                                <input
                                    name="_id"
                                    autoComplete="off"
                                    type="text"
                                    className="w-full h-full rounded-sm pl-2"
                                    placeholder="Please upload first"
                                    value={blogData._id}
                                    readOnly={true}
                                    onChange={(e) => {
                                        setBlogData({ ...blogData, _id: e.target.value });
                                    }}
                                />
                                <span
                                    className={`absolute medium-icon right-[16px] top-[8px] cursor-pointer icon-Content-copy text-background opacity-25 hover:opacity-100`}
                                    onClick={() => {
                                        copyToClipboard(blogData._id || "Please upload first");
                                    }}
                                ></span>
                            </div>
                            <div className="relative w-full">
                                <div className="absolute left-0 w-full bg-secondary h-[2px] center"></div>
                                <h3 className="relative w-max bg-black pr-2 text-white02 mb-2">Title</h3>
                            </div>

                            <div className="relative w-full h-[40px] mb-5">
                                <input
                                    name="title"
                                    autoComplete="off"
                                    type="text"
                                    className="w-full h-full rounded-sm pl-2"
                                    placeholder="Insert title"
                                    onChange={(e) => {
                                        setBlogData({ ...blogData, title: e.target.value });
                                    }}
                                    value={blogData.title}
                                    maxLength={40}
                                />
                                <span
                                    className={`absolute medium-icon right-[16px] top-[8px] cursor-pointer icon-Close text-background opacity-25 hover:opacity-100`}
                                    onClick={() => {
                                        setBlogData({ ...blogData, title: "" });
                                    }}
                                ></span>
                            </div>

                            <div className="relative w-full">
                                <div className="absolute left-0 w-full bg-secondary h-[2px] center"></div>
                                <h3 className="relative w-max bg-black pr-2 text-white02 mb-2">Description</h3>
                            </div>

                            <div className="relative w-full h-max mb-5">
                                <textarea
                                    name="description"
                                    rows={6}
                                    className="w-full rounded-sm px-2 py-2 outline-none resize-none"
                                    placeholder="Insert description"
                                    onChange={(e) => {
                                        setBlogData({ ...blogData, description: e.target.value });
                                    }}
                                    value={blogData.description}
                                    maxLength={600}
                                >
                                </textarea>
                                <span
                                    className={`absolute medium-icon right-[16px] top-[8px] cursor-pointer icon-Close text-background opacity-25 hover:opacity-100`}
                                    onClick={() => {
                                        setBlogData({ ...blogData, description: "" });
                                    }}
                                ></span>
                            </div>

                            <div className="relative w-full">
                                <div className="absolute left-0 w-full bg-secondary h-[2px] center"></div>
                                <h3 className="relative w-max bg-black pr-2 text-white02 mb-2">Categories</h3>
                            </div>

                            <div className="relative w-full h-[40px] mb-5">
                                <input
                                    name="categories"
                                    autoComplete="off"
                                    type="text"
                                    className="w-full h-full rounded-sm pl-2"
                                    placeholder="Search categories"
                                    onChange={async (e) => {
                                        await searchCategory(e.target.value);
                                    }}
                                    onFocus={async (e) => {
                                        setSearchResult(prev => { return { ...prev, isFocus: true } });
                                        await searchCategory(e.target.value);
                                    }}
                                    onBlur={() => setTimeout(() => setSearchResult(prev => { return { ...prev, isFocus: false } }), 300)}
                                    maxLength={40}
                                />
                                <span
                                    className={`absolute medium-icon right-[16px] top-[8px] icon-Search text-background opacity-25 hover:opacity-100`}
                                ></span>
                                <div className={`absolute h-max w-full max-h-[120px] lg:max-h-[320px] top-[40px] left-0 rounded-sm overflow-y-scroll z-10 cursor-pointer ${!searchResult.isFocus && "hidden"}`}>
                                    {searchResult.results.map((result: Category) => {
                                        return (
                                            <div key={result._id} className="h-[40px] w-full bg-slate-50 hover:bg-slate-200 pt-2 pl-2"
                                                onClick={() => {
                                                    addCategory(result);
                                                }}
                                            >
                                                {result._id}
                                            </div>)
                                    })}
                                </div>
                            </div>
                            <div className="w-full h-max flex flex-wrap mb-4 space-x-2">
                                {blogData.categories.length > 0 ?
                                    blogData.categories.map((category: Category) => {
                                        return (
                                            <TinyButton
                                                key={category._id}
                                                iconPos="none"
                                                content={category._id}
                                                myStyles="sm:my-0 my-1 bg-primary"
                                                handleClick={() => {
                                                    setBlogData(prev => {
                                                        return { ...prev, categories: prev.categories.filter(item => item !== category) }
                                                    });
                                                }}
                                            />
                                        );
                                    }) : <p className="text-sm text-white03">No category chosen!</p>}
                            </div>

                            <div className="relative w-full">
                                <div className="absolute left-0 w-full bg-secondary h-[2px] center"></div>
                                <h3 className="relative w-max bg-black pr-2 text-white02 mb-2">Tags</h3>
                            </div>

                            <div className="relative w-full h-[40px] mb-5">
                                <input
                                    name="tags"
                                    autoComplete="off"
                                    type="text"
                                    className="w-full h-full rounded-sm pl-2"
                                    placeholder="#tag1 #tag2 #tag3 #..."
                                    onChange={(e) => {
                                        setBlogData({ ...blogData, tags: e.target.value.split(" ") });
                                    }}
                                    value={blogData.tags.join(" ")}
                                    maxLength={40}
                                />
                                <span
                                    className={`absolute medium-icon right-[16px] top-[8px] cursor-pointer icon-Close text-background opacity-25 hover:opacity-100`}
                                    onClick={() => {
                                        setBlogData({ ...blogData, tags: [] });
                                    }}
                                ></span>
                            </div>

                            <div className="relative w-full">
                                <div className="absolute left-0 w-full bg-secondary h-[2px] center"></div>
                                <h3 className="relative w-max bg-black pr-2 text-white02 mb-2">Attached images</h3>
                            </div>

                            <div className="w-full min-h-[60px] max-h-[400px] overflow-y-scroll bg-black rounded-sm pt-3 px-3 custom-sb">
                                {(blogData.attachedImages?.length as number > 0) ?
                                    blogData.attachedImages?.map(item => {
                                        return <div className="relative flex mb-4 w-full h-[60px] bg-black rounded-md" key={item._id}>
                                            <img className="object-cover w-[60px] h-[60px] rounded overflow-hidden mr-2" src={item.imageUrl} alt="Attached image" />
                                            <p className="h-[60px] text-white02 align-middle w-max max-w-[300px]">
                                                {item.fileName}
                                            </p>
                                            <span
                                                className={`absolute medium-icon right-[46px] top-[18px] cursor-pointer icon-Content-copy text-primary`}
                                                onClick={() => {
                                                    copyToClipboard(item.imageUrl as string);
                                                }}
                                            ></span>
                                            <span
                                                className={`absolute medium-icon right-[16px] top-[18px] cursor-pointer icon-Delete text-error`}
                                                onClick={async () => {
                                                    await handleImageDelete(item._id as string);
                                                }}
                                            ></span>
                                        </div>
                                    })
                                    : <p className="px-2 py-1 text-slate-400">
                                        "No images"
                                    </p>
                                }
                            </div>
                            <div className="sm:flex flex-shrink-0 flex-wrap sm:mt-0 mt-4 gap-y-2">
                                {
                                    acceptTerm ?
                                        <Button
                                            iconPos="back"
                                            content={"Update"}
                                            type="button"
                                            icon="icon-Upload-file"
                                            myStyles="bg-primary overflow-hidden rounded-md"
                                            handleClick={() => handleUploadBlog()}
                                        /> :
                                        <Button
                                            iconPos="back"
                                            content={"Update"}
                                            type="button"
                                            icon="icon-Upload-file"
                                            myStyles="bg-disable overflow-hidden rounded-md"
                                        />
                                }
                                <div className="flex flex-shrink-0 sm:ml-4 sm:mt-0 sm:mb-0 mt-2 mb-4 mr-auto w-max h-max translate-y-[5px]">
                                    <div className="relative w-4 h-4 rounded-[2px] overflow-hidden bg-white mr-1 translate-y-[3.5px]">
                                        {acceptTerm && <img className="absolute top-[-4px] left-0 w-[24px] h-[24px] pointer-events-none" src="images/checked.svg" alt="checked" />}
                                        <input className="absolute top-0 left-0 opacity-0 cursor-pointer" type="checkbox" onChange={(e) => setAcceptTerm(e.target.checked)} />
                                    </div>
                                    <p className="text-white02 sm:text-base text-sm">I've read & agree with <a className="text-primary font-bold" href="/">Vtech terms</a></p>
                                </div>
                                <Button
                                    iconPos="back"
                                    content="Delete blog"
                                    handleClick={async () => {
                                        await handleDeleteBlog();
                                    }}
                                    icon="icon-Delete"
                                    myStyles="bg-error rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
} 