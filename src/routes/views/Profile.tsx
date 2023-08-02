import { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useLoaderData, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import SmallCard from "../../components/Card/SmallCard";
import getToken from "../../helpers/getLocalStorage";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { localhostIP } from "../../App";
import { updateNotification } from "../../features/pageNotification/pageNotificationSlice";
import { deleteRequest, getRequest, putRequest } from "../../helpers/fetchData";
import FileInput from "../../components/Input/FileInput";
import EditAccount from "./Account";

interface UserProfile extends User {
    recentPosts: Blog[];
    likedPosts: Blog[];
}

type editProfile = {
    name: boolean,
    profession: boolean,
    about: boolean,
    contacts: boolean,
    avatar: boolean
}

export default function Profile() {
    const user = useAppSelector(state => state.userData);
    const data = useLoaderData();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserProfile>(data as UserProfile);
    const [hasFollowed, setHasFollowed] = useState<Boolean>(user?.follows?.includes(userData._id as string) as boolean);
    const dispatch = useAppDispatch();
    const [edit, setEdit] = useState<editProfile>({
        name: false,
        profession: false,
        about: false,
        contacts: false,
        avatar: false
    });

    const [searchResult, setSearchResult] = useState<SearchResult<ContactMedia>>({
        isFocus: false,
        results: []
    });

    const [avatarData, setAvatarData] = useState({
        avatar: {
            url: "",
            top: 0,
            left: 0
        } as UserAvatar,
        avatarFile: null as File | null,
        width: 0,
        height: 0
    });

    const userAbout = useRef<string>(userData.about || "");
    const userName = useRef<string>(userData.name || "");
    const userProfession = useRef<string>(userData.profession || "");

    const [contactList, setContactList] = useState<Contact[]>(userData.contacts as Contact[]);

    const handleFollow = async (userId: string) => {
        if (user === null) {
            return dispatch(updateNotification({
                show: true,
                message: "Please login first",
                type: "bg-error"
            }));
        }

        if (user && user._id === userData._id) {
            return dispatch(updateNotification({
                show: true,
                message: "You can't follow yourself",
                type: "bg-warning"
            }));
        }

        const accessToken = await getToken("access");

        await putRequest(`${localhostIP}/api/interact/follow?id=${userId}`, accessToken as string, {})
            .then(res => {
                if (res?.message === "Unfollowed!") {
                    setHasFollowed(false);
                } else {
                    setHasFollowed(true);
                }
            });
        //navigate(0);
    }

    const addContacts = (value: Contact) => {
        const newContactsList: Contact[] = contactList;
        if (!newContactsList.some(element => {
            if (element.media._id === value.media._id) return true;

            return false;
        })) {
            newContactsList.push(value);
        }
        setContactList(newContactsList);
    }

    const removeContacts = async (contactId: string) => {
        let idToRemove = "";
        const newContactsList = contactList.filter((contact: Contact) => {
            if (contact.media._id !== contactId) {
                return true;
            } else if (contact._id) {
                idToRemove = contact._id
                return false;
            }
        });

        if (idToRemove !== "") {
            const accessToken = await getToken("access");

            const res = await deleteRequest(`${localhostIP}/api/contact?id=${idToRemove}`, accessToken);

            return dispatch(updateNotification({
                show: true,
                message: res?.message,
                type: "bg-success"
            }));
        }
        setContactList(newContactsList as Contact[]);
    }

    const searchContacts = async (searchString: string) => {
        const res = await getRequest<ContactMedia[]>(`${localhostIP}/api/contact/media?name=${searchString}`);
        setSearchResult(prev => {
            return {
                ...prev,
                results: res?.data as ContactMedia[]
            }
        });
    }

    const saveContacts = async () => {
        const accessToken = await getToken("access");

        if (contactList.length < 1) {
            setEdit({ ...edit, contacts: false });
            setUserData({ ...userData, contacts: [] });
            return;
        }

        const isUrlValid = (value: Contact) => new RegExp(value.media.regex).test(value.url);

        if (!contactList.every(isUrlValid)) {
            return dispatch(updateNotification({
                show: true,
                message: "Url are not correct!",
                type: "bg-error"
            }));
        }

        const isContentValid = (value: Contact) => value.content !== "";

        if (!contactList.every(isContentValid)) {
            return dispatch(updateNotification({
                show: true,
                message: "Please fill in all the field!",
                type: "bg-error"
            }));
        }
        const res = await putRequest(`${localhostIP}/api/contact/`, accessToken as string, {
            contacts: contactList.map(contact => {
                return {
                    ...contact,
                    media: contact.media._id
                }
            })
        });

        dispatch(updateNotification({
            show: true,
            message: res?.message,
            type: "bg-success"
        }));

        setUserData({ ...userData, contacts: contactList });
        setEdit({ ...edit, contacts: false });
    }

    const saveAbout = async () => {
        const accessToken = await getToken("access");

        if (userAbout.current && userAbout.current.length < 20) {
            return dispatch(updateNotification({
                show: true,
                message: "About is too short!",
                type: "bg-warning"
            }));
        }

        const res = await putRequest(`${localhostIP}/api/interact/updateabout`, accessToken as string, {
            about: userAbout.current
        });

        dispatch(updateNotification({
            show: true,
            message: res?.message,
            type: "bg-success"
        }));

        setUserData({ ...userData, about: userAbout.current });
        setEdit({ ...edit, about: false });
    }

    const saveName = async () => {
        const accessToken = await getToken("access");

        if (userName.current === "") {
            return dispatch(updateNotification({
                show: true,
                message: "Username is empty!",
                type: "bg-warning"
            }));
        }

        if (userName.current.length < 7) {
            return dispatch(updateNotification({
                show: true,
                message: "Username is too short!",
                type: "bg-warning"
            }));
        }


        const res = await putRequest(`${localhostIP}/api/interact/updatename`, accessToken as string, {
            name: userName.current
        });

        dispatch(updateNotification({
            show: true,
            message: res?.message,
            type: "bg-success"
        }));

        setUserData({ ...userData, name: userName.current });
        setEdit({ ...edit, name: false });
    }

    const saveProfession = async () => {
        const accessToken = await getToken("access");

        if (userProfession.current === "") {
            return dispatch(updateNotification({
                show: true,
                message: "Profession is empty!",
                type: "bg-warning"
            }));
        }

        if (userProfession.current.length < 5) {
            return dispatch(updateNotification({
                show: true,
                message: "Profession is too short!",
                type: "bg-warning"
            }));
        }

        const res = await putRequest(`${localhostIP}/api/interact/updateprofession`, accessToken as string, {
            profession: userProfession.current
        });

        dispatch(updateNotification({
            show: true,
            message: res?.message,
            type: "bg-success"
        }));

        setUserData({ ...userData, about: userAbout.current });
        setEdit({ ...edit, profession: false });
    }

    const saveAvatar = async () => {
        const accessToken = await getToken("access");
        const res = await putRequest(`${localhostIP}/api/interact/avatar`, accessToken as string, avatarData);

        dispatch(updateNotification({
            show: true,
            message: res?.message,
            type: "bg-success"
        }));

        setEdit({ ...edit, avatar: false });

        setTimeout(() => {
            navigate(0);
        }, 300);
    }

    return (
        <>
            <div className={`relative`}>
                <Helmet>
                    <title>{(user.notifications.length > 0) ? `(${user.notifications.length})` : ""} {userData.name}</title>
                    <meta name="description" content="Nested component" />
                </Helmet>
                <div className="bg-secondary w-[96vw] h-max rounded-3xl mx-auto p-1 mt-[2vh] relative">
                    <div className="bg-black w-full h-full grid min-[1270px]:grid-cols-2 grid-cols-1 gap-8 rounded-[22px] sm:px-8 sm:py-[60px] p-[24px]">
                        {
                            edit.avatar && <div className="fixed top-0 left-0 z-50 h-full w-full bg-slate-900 bg-opacity-70">
                                <div className="absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] w-max max-w-[90vw] h-max bg-primary p-1 rounded-lg overflow-hidden">
                                    <div className="relative w-full h-full bg-black rounded-md p-12">
                                        <div className="flex flex-wrap lg:flex-row flex-col gap-4">
                                            <div className="relative lg:w-[20vw] lg:h-[20vw] w-[45vw] h-[45vw] max-w-[280px] max-h-[280px] border-dotted bg-secondary rounded-xl overflow-hidden bg-secondary">
                                                <div className="absolute icon-Upload-file text-[16vw] text-white02 left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] pointer-events-none"></div>
                                                <FileInput
                                                    accept="image/*"
                                                    name="avatar"
                                                    handleChange={(file, width, height, url) => {
                                                        setAvatarData({
                                                            avatar: {
                                                                url,
                                                                top: 0,
                                                                left: 0
                                                            },
                                                            avatarFile: file,
                                                            width,
                                                            height
                                                        });
                                                    }}
                                                    inputTitle="New avatar"
                                                    myStyles="w-full h-full opacity-0 cursor-pointer"
                                                />
                                                {avatarData.avatar.url && <img src={avatarData.avatar.url} alt="New avatar" className={`absolute z-10 w-full h-full top-[${avatarData.avatar.top}px] left-[${avatarData.avatar.left}px] object-cover pointer-events-none`} />}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="text-white02 min-[640px]:text-2xl text-base font-bold text-white01 sm:max-w-[40vw] max-w-[70%] overflow-hidden whitespace-nowrap">Name: <span className="font-normal text-white02">{avatarData.avatarFile?.name || "None"}</span></p>
                                                <p className="text-white02 min-[640px]:text-2xl text-base font-bold text-white01 sm:max-w-[40vw] max-w-[70%] overflow-hidden whitespace-nowrap">Width: <span className="font-normal text-white02">{avatarData.width || "0"} px</span></p>
                                                <p className="text-white02 min-[640px]:text-2xl text-base font-bold text-white01 sm:max-w-[40vw] max-w-[70%] overflow-hidden whitespace-nowrap">Height: <span className="font-normal text-white02">{avatarData.height || "0"} px</span></p>
                                                <p className="text-white02 min-[640px]:text-2xl text-base font-bold text-white01 sm:max-w-[40vw] max-w-[70%] overflow-hidden whitespace-nowrap">Size: <span className="font-normal text-white02">{avatarData.avatarFile?.size || "0"} bytes</span></p>
                                                <Button
                                                    content="Accept"
                                                    iconPos="back"
                                                    icon="icon-Check"
                                                    myStyles="text-success mt-4"
                                                    handleClick={() => {
                                                        saveAvatar();
                                                    }}
                                                />
                                                <Button
                                                    content="Cancel"
                                                    iconPos="back"
                                                    icon="icon-Close"
                                                    myStyles="text-error"
                                                    handleClick={() => {
                                                        setEdit({
                                                            ...edit,
                                                            avatar: false
                                                        })
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        <div className="flex">
                            <div className="relative shrink-0 max-w-[200px] max-h-[200px] w-[20vw] h-[20vw] overflow-hidden rounded-lg">
                                <img src={userData.avatar.url} alt="avatar" className={`absolute top-[${userData.avatar.top}px] left-[${userData.avatar.left}px] w-full object-cover h-full`} />
                                {
                                    userData._id === user._id &&
                                    <div className="absolute bottom-0 left-0 w-full h-full bg-slate-900 opacity-0 hover:opacity-80 flex items-center">
                                        <Button
                                            content="Change"
                                            iconPos="back"
                                            icon="icon-Add-photo-alternate"
                                            myStyles="text-white mx-auto"
                                            handleClick={() => {
                                                setEdit({ ...edit, avatar: true });
                                            }}
                                        />
                                    </div>
                                }
                            </div>
                            <div className="md:mx-4 ml-3">
                                <div className="flex items-center">
                                    {
                                        edit.name ?
                                            <input
                                                name="name"
                                                autoComplete="off"
                                                type="text"
                                                className="text-black h-[40px] rounded-sm pl-2 mr-2 w-full"
                                                placeholder={"Enter new username"}
                                                onChange={(e) => {
                                                    userName.current = e.target.value
                                                }}
                                                defaultValue={userData.name}
                                            />
                                            : <div className="flex gap-1 flex-shrink-0">
                                                <p className="text-white font-bold md:text-4xl text-xl">{userData.name}</p>
                                                {
                                                    user.isCertified &&
                                                    <div className="icon-Verified md:text-4xl text-2xl text-primary translate-y-[2px]"></div>
                                                }
                                            </div>
                                    }
                                    {(userData._id === user?._id && !edit.name) &&
                                        <Button
                                            iconPos="none"
                                            icon="icon-Edit"
                                            myStyles="text-white04"
                                            handleClick={() => {
                                                setEdit({ ...edit, name: true });
                                            }}
                                        />
                                    }
                                    {(userData._id === user?._id && edit.name) &&
                                        <div className="flex">
                                            <Button
                                                iconPos="none"
                                                icon="icon-Check"
                                                myStyles="text-success"
                                                handleClick={() => {
                                                    saveName();
                                                }}
                                            />
                                            <Button
                                                iconPos="none"
                                                icon="icon-Close"
                                                myStyles="text-error"
                                                handleClick={() => {
                                                    setEdit({ ...edit, name: false });
                                                }}
                                            />
                                        </div>
                                    }
                                </div>
                                <div className="flex items-center mt-2 mb-4">
                                    {
                                        edit.profession ?
                                            <input
                                                name="profession"
                                                autoComplete="off"
                                                type="text"
                                                className="text-black h-[40px] rounded-sm pl-2 mr-2 w-full"
                                                placeholder={"Enter new profession"}
                                                onChange={(e) => {
                                                    userProfession.current = e.target.value
                                                }}
                                                defaultValue={userData.profession}
                                            />
                                            : <p className="text-white02 md:ml-1">{userData.profession}</p>
                                    }
                                    {(userData._id === user?._id && !edit.profession) &&
                                        <Button
                                            iconPos="none"
                                            icon="icon-Edit"
                                            myStyles="text-white04"
                                            handleClick={() => {
                                                setEdit({ ...edit, profession: true });
                                            }}
                                        />
                                    }
                                    {(userData._id === user?._id && edit.profession) &&
                                        <div className="flex">
                                            <Button
                                                iconPos="none"
                                                icon="icon-Check"
                                                myStyles="text-success"
                                                handleClick={() => {
                                                    saveProfession();
                                                }}
                                            />
                                            <Button
                                                iconPos="none"
                                                icon="icon-Close"
                                                myStyles="text-error"
                                                handleClick={() => {
                                                    setEdit({ ...edit, profession: false });
                                                }}
                                            />
                                        </div>
                                    }
                                </div>
                                <div className="flex flex-wrap my-4 gap-2">
                                    <Button
                                        iconPos="back"
                                        content="Contact"
                                        icon="icon-Email"
                                        myStyles="bg-secondary"
                                    />
                                    {hasFollowed ?
                                        <Button
                                            iconPos="back"
                                            content="Followed"
                                            icon="icon-Notifications-active"
                                            handleClick={() => handleFollow(userData._id as string)}
                                        /> :
                                        <Button
                                            iconPos="back"
                                            content="Follow"
                                            icon="icon-Notifications"
                                            handleClick={() => handleFollow(userData._id as string)}
                                        />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-shrink-0 md:gap-3 gap-2 select-none">
                            <div className="relative max-w-[200px] max-h-[200px] w-[30vw] h-[30vw] rounded-xl bg-secondary">
                                <img className="absolute md:top-[50px] top-[6vw] left-[50%] max-w-[60px] max-h-[60px] w-[8vw] translate-x-[-50%]" src="/icons/BigIcon/NotificationsActive.svg" alt="" />
                                <p className="absolute md:bottom-[44px] bottom-[4vw] left-[50%] translate-x-[-50%] font-bold md:text-2xl text-[4.2vw] whitespace-nowrap">
                                    <span className="text-primary">Follows: </span><span className="text-white02">{userData.followersCount}</span>
                                </p>
                            </div>
                            <div className="relative max-w-[200px] max-h-[200px] w-[30vw] h-[30vw] rounded-xl bg-secondary">
                                <img className="absolute md:top-[50px] top-[6vw] left-[50%] max-w-[60px] max-h-[60px] w-[8vw] translate-x-[-50%]" src="/icons/BigIcon/ThumbUp.svg" alt="" />
                                <p className="absolute md:bottom-[44px] bottom-[4vw] left-[50%] translate-x-[-50%] font-bold md:text-2xl text-[4.2vw] whitespace-nowrap">
                                    <span className="text-primary">Likes: </span><span className="text-white02">{userData.likesCount}</span>
                                </p>
                            </div>
                            <div className="relative max-w-[200px] max-h-[200px] w-[30vw] h-[30vw] rounded-xl bg-secondary">
                                <img className="absolute md:top-[50px] top-[6vw] left-[50%] max-w-[60px] max-h-[60px] w-[8vw] translate-x-[-50%]" src="/icons/BigIcon/Articles.svg" alt="" />
                                <p className="absolute md:bottom-[44px] bottom-[4vw] left-[50%] translate-x-[-50%] font-bold md:text-2xl text-[4.2vw] whitespace-nowrap">
                                    <span className="text-primary">Posts: </span><span className="text-white02">{userData.recentPosts.length}</span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="flex mb-2">
                                <h3 className="text-primary">About</h3>
                                {(userData._id === user?._id && !edit.about) &&
                                    <Button
                                        iconPos="none"
                                        icon="icon-Edit"
                                        myStyles="text-white04"
                                        handleClick={() => {
                                            setEdit({ ...edit, about: true });
                                        }}
                                    />
                                }
                                {(userData._id === user?._id && edit.about) &&
                                    <div className="flex ml-3">
                                        <Button
                                            iconPos="none"
                                            icon="icon-Check"
                                            myStyles="text-success"
                                            handleClick={() => {
                                                saveAbout();
                                            }}
                                        />
                                        <Button
                                            iconPos="none"
                                            icon="icon-Close"
                                            myStyles="text-error"
                                            handleClick={() => {
                                                setEdit({ ...edit, about: false });
                                            }}
                                        />
                                    </div>
                                }
                            </div>
                            {
                                edit.about ?
                                    <textarea
                                        name="about"
                                        rows={6}
                                        className="w-full rounded-sm px-2 py-2 outline-none resize-none"
                                        placeholder="Tell us about yourself"
                                        onChange={(e) => userAbout.current = e.target.value}
                                        defaultValue={userAbout.current}
                                    ></textarea>
                                    : <p className="text-white02 md:text-base text-sm">
                                        {userData.about || "None"}
                                    </p>
                            }
                        </div>

                        <div>
                            <div className="flex mb-2">
                                <h3 className="text-primary">{(userData.contacts && userData.contacts.length > 1) ? "Contacts" : "Contact"}</h3>
                                {(userData._id === user?._id && !edit.contacts) &&
                                    <Button
                                        iconPos="none"
                                        icon="icon-Edit"
                                        myStyles="text-white04"
                                        handleClick={() => {
                                            setEdit({ ...edit, contacts: true });
                                        }}
                                    />
                                }
                                {(userData._id === user?._id && edit.contacts) &&
                                    <div className="flex ml-3">
                                        <Button
                                            iconPos="none"
                                            icon="icon-Check"
                                            myStyles="text-success"
                                            handleClick={() => {
                                                saveContacts();
                                            }}
                                        />
                                        <Button
                                            iconPos="none"
                                            icon="icon-Close"
                                            myStyles="text-error"
                                            handleClick={() => {
                                                setEdit({ ...edit, contacts: false });
                                            }}
                                        />
                                    </div>
                                }
                            </div>
                            {
                                edit.contacts ?
                                    <div className="relative w-full min-h-[100px] h-max mb-5">
                                        <input
                                            name="medias"
                                            autoComplete="off"
                                            type="text"
                                            className="w-full h-[40px] rounded-sm pl-2"
                                            placeholder="Choose media"
                                            onChange={async (e) => {
                                                await searchContacts(e.target.value);
                                            }}
                                            onFocus={async (e) => {
                                                setSearchResult(prev => { return { ...prev, isFocus: true } });
                                                await searchContacts(e.target.value);
                                            }}
                                            onBlur={() => setTimeout(() => setSearchResult(prev => { return { ...prev, isFocus: false } }), 300)}
                                            maxLength={40}
                                        />
                                        <span
                                            className={`absolute medium-icon right-[16px] top-[8px] icon-Search text-background opacity-25 hover:opacity-100`}
                                        ></span>
                                        <div className={`absolute h-max w-full max-h-[120px] lg:max-h-[200px] top-[40px] left-0 rounded-sm overflow-y-scroll z-10 cursor-pointer ${!searchResult.isFocus && "hidden"}`}>
                                            {searchResult.results.map((result: ContactMedia) => {
                                                return (
                                                    <div key={result._id} className="flex h-[40px] w-full bg-slate-50 hover:bg-slate-200 pt-2 pl-2"
                                                        onClick={() => {
                                                            addContacts({
                                                                url: "",
                                                                content: "",
                                                                media: {
                                                                    _id: result._id,
                                                                    icon: result.icon,
                                                                    name: result.name,
                                                                    placeholder: result.placeholder,
                                                                    regex: result.regex
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <div className={`${result.icon} h-4 w-4 translate-y-1 mr-2`}></div>{result.name}
                                                    </div>)
                                            })}
                                        </div>
                                        <div className="flex flex-col text-white02 md:text-base text-sm mt-2 gap-y-2">
                                            {
                                                contactList.length > 0 ?
                                                    contactList.map((contact: Contact, index: number) => {
                                                        return <div className="flex" key={contact.media._id}>
                                                            <div className={`${contact.media.icon} h-8 w-8 translate-y-1 mr-2 flex-shrink-0`}></div>
                                                            <div className="flex flex-col min-[632px]:flex-row gap-2 max-w-[180px] min-[632px]:max-w-[800px]">
                                                                <input
                                                                    name={contact.media.name + " name"}
                                                                    autoComplete="off"
                                                                    type="text"
                                                                    className="text-black h-[40px] rounded-sm pl-2 mr-2"
                                                                    placeholder={contact.media.name + " profile name"}
                                                                    onChange={(e) => {
                                                                        let newList = contactList;
                                                                        let contact = newList[index];
                                                                        contact.content = e.target.value;
                                                                        setContactList(newList);
                                                                    }}
                                                                    defaultValue={contact.content}
                                                                />
                                                                <input
                                                                    name={contact.media.name + " link"}
                                                                    autoComplete="off"
                                                                    type="text"
                                                                    className="text-black h-[40px] rounded-sm pl-2 mr-2"
                                                                    placeholder={contact.media.placeholder}
                                                                    onChange={(e) => {
                                                                        let newList = contactList;
                                                                        let contact = newList[index];
                                                                        contact.url = e.target.value;
                                                                        setContactList(newList);
                                                                    }}
                                                                    defaultValue={contact.url}
                                                                />
                                                            </div>
                                                            <Button
                                                                iconPos="none"
                                                                icon="icon-Delete"
                                                                myStyles="bg-error rounded-sm translate-y-[2px]"
                                                                handleClick={() => removeContacts(contact.media._id as string)}
                                                            />
                                                        </div>
                                                    }) :
                                                    "Please link some contacts"
                                            }
                                        </div>
                                    </div>
                                    :
                                    <div className="text-white02 md:text-base text-sm flex flex-col gap-3">
                                        {
                                            userData.contacts && userData.contacts.length > 0 ?
                                                userData.contacts?.map(contact => {
                                                    return <div className="flex" key={contact.media._id}>
                                                        <div className={`${contact.media.icon} h-6 w-6 mr-2`}></div>
                                                        <a className="font-medium text-white02" href={contact.url} target="_blank">{contact.content}</a>
                                                    </div>
                                                }) :
                                                "None"
                                        }
                                    </div>
                            }
                        </div>

                        <div>
                            <h3 className="text-primary mb-3">Recent posts</h3>
                            <div className="text-white02 flex flex-col gap-1 max-h-[600px] custom-sb overflow-y-scroll">
                                {
                                    userData.recentPosts && userData.recentPosts.length > 0 ?
                                        userData.recentPosts?.map(post => {
                                            return <SmallCard
                                                _id={post.author._id!}
                                                authorName={post.author.name}
                                                blogUrl={`blog/${post._id}`}
                                                description={post.description}
                                                likesCount={post.likesCount}
                                                time={post.time}
                                                title={post.title}
                                                viewsCount={post.viewsCount}
                                                coverImage={post.coverImage}
                                                key={post._id}
                                                myStyles="my-2"
                                            />
                                        }) :
                                        "None"
                                }
                            </div>
                        </div>

                        <div>
                            <h3 className="text-primary mb-3">Liked posts</h3>
                            <div className="text-white02 flex flex-col gap-1 max-h-[600px] custom-sb overflow-y-scroll">
                                {
                                    userData.likedPosts && userData.likedPosts.length > 0 ?
                                        userData.likedPosts?.map(post => {
                                            return <SmallCard
                                                _id={post.author._id!}
                                                authorName={post.author.name}
                                                blogUrl={`blog/${post._id}`}
                                                description={post.description}
                                                likesCount={post.likesCount}
                                                time={post.time}
                                                title={post.title}
                                                viewsCount={post.viewsCount}
                                                coverImage={post.coverImage}
                                                key={post._id}
                                                myStyles="my-2"
                                            />
                                        }) :
                                        "None"
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {user._id && <EditAccount />}
        </>
    )
} 