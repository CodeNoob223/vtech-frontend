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

export default function EditAccount() {
    const user = useAppSelector(state => state.userData);

    const dispatch = useAppDispatch()

    const copyToClipboard = (value: string) => {
        // Copy the text inside the text field
        navigator.clipboard.writeText(value);
        dispatch(updateNotification({
            show: true,
            type: "bg-success",
            message: "Copied url to clipboard!"
        }));
    }

    return (
        <div className="relative">
            <Helmet>
                <title>{(user.notifications.length > 0) ? `(${user.notifications.length})` : ""} Account</title>
                <meta name="description" content="Edit your account" />
            </Helmet>
            <div className="bg-secondary w-[90vw] h-max rounded-3xl mx-auto p-1 mt-[8vh] relative">
                <div className="bg-black w-full h-full rounded-[22px] px-8 py-[60px]">
                    {/* BLOG CONTENT */}
                    <div className="absolute top-[-15px] sm:top-[-22px] left-7 sm:left-8 px-2 text-white bg-black">
                        <h1 className="text-[6vw] sm:text-[32px]">
                            Edit your account
                        </h1>
                    </div>


                    <div className="w-full px-2">
                        <div className="w-full flex flex-row flex-shrink-0 flex-wrap gap-4">
                            
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
} 