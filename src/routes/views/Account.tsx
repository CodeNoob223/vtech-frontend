import { useState } from "react";
import { Helmet } from "react-helmet";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { updateNotification } from "../../features/pageNotification/pageNotificationSlice";
import Button from "../../components/Button/Button";
import { postRequest } from "../../helpers/fetchData";
import { localhostIP } from "../../App";
import getToken from "../../helpers/getLocalStorage";
import { logOutAction } from "../../features/userData/userSlice";

export default function EditAccount() {
    const user = useAppSelector(state => state.userData);
    const [newPass, setNewPass] = useState<string>("");
    const [type, setType] = useState<"text" | "password">("password");

    const dispatch = useAppDispatch()

    const sendRequest = async () => {
        if (user._id === "") {
            dispatch(updateNotification({
                show: true,
                type: "bg-error",
                message: "Please login first!"
            }));

            setTimeout(() => {
                dispatch(logOutAction());
            }, 300);
        };

        if (newPass.length < 10) {
            dispatch(updateNotification({
                show: true,
                message: "Password is too short!",
                type: "bg-error"
            }))
        };

        const res = await postRequest(`${localhostIP}/api/interact/otp`, await getToken("access"), {
            request_user: user._id,
            action: "change_password",
            payload: newPass
        });

        if (res.success) {
            dispatch(updateNotification({
                show: true,
                message: "Please confirm in your email!",
                type: "bg-success"
            }));
        };
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
                            Account settings
                        </h1>
                    </div>

                    <div className="w-full">
                        <p className="text-white01 mb-2">Change your password:</p>
                        <div className="relative w-full max-w-[400px] h-[40px] mb-5">
                            <input
                                name="_id"
                                autoComplete="off"
                                type={type}
                                className="w-full h-full rounded-sm pl-2"
                                placeholder="New password"
                                value={newPass}
                                onChange={(e) => {
                                    setNewPass(e.target.value);
                                }}
                            />
                            <span
                                className={`absolute medium-icon right-[16px] top-[8px] cursor-pointer ${type === "password" ? "icon-Visibility" : "icon-Visibility-off"} text-background opacity-25 hover:opacity-100`}
                                onClick={() => {
                                    setType(prev => {
                                        if (prev === "password") return "text";
                                        else return "password";
                                    });
                                }}
                            ></span>
                        </div>
                        {
                            newPass.length > 9 ?
                                <Button
                                    content="Confirm"
                                    myStyles="bg-success"
                                    iconPos="back"
                                    icon="icon-Lock"
                                    handleClick={sendRequest}
                                />
                                : <Button
                                    content="Confirm"
                                    myStyles="bg-disable"
                                    iconPos="back"
                                    icon="icon-Lock"
                                />
                        }
                    </div>
                </div>
            </div>

        </div>
    )
} 