import Button from "../../components/Button/Button";
import TextInput from "../../components/Input/TextInput";
import FileInput from "../../components/Input/FileInput";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { localhostIP } from "../../App"; 
import { useAppDispatch } from "../../app/hook";
import { updateNotification } from "../../features/pageNotification/pageNotificationSlice";
import { postRequest } from "../../helpers/fetchData";
import { useNavigate } from "react-router-dom";

type RegisterForm = {
  email: string,
  name: string,
  profession: string,
  password: string,
  repeatPassword: string,
  avatarFile: File | null
}

export default function Register(): JSX.Element {
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    name: "",
    password: "",
    profession: "",
    repeatPassword: "",
    avatarFile: null
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await postRequest(`http://${localhostIP}:3001/api/user/register`, "",
      {
        ...form,
        avatar: {
          url: "",
          top: 0,
          left: 0
        }
      },);
    dispatch(updateNotification({
      type: "bg-success",
      show: true,
      message: "Account created!"
    }));

    navigate("/login");
  }

  const handleImageUpload = (file : File, width : number, height : number, url : string) => {
    if (file) {
      setForm({ ...form, avatarFile: file });
    }
  }

  return (
    <div className="relative bg-black w-screen h-screen">
      <Helmet>
        <title>Register</title>
        <meta name="description" content="Create a Vtech account" />
      </Helmet>
     
      <div className="center w-[96vw] max-w-[1280px] h-[608px] border-gradient bg-primary rounded-3xl text-white">
        <div className="grid min-[1079px]:grid-cols-[560px_1fr] max-[1078px]:grid-cols-1 place-items-center p-6 bg-black gap-x-[56px]">
          <img className="login-logo absolute top-[-24px] h-[50px]  bg-black px-4" src="/logo.svg" alt="v-tech logo" onClick={
            () => {
              navigate("/home");
            }
          }/>
          <img className="max-[1079px]:hidden w-[560px] h-[560px] object-cover" src="/images/signin.png" alt="v-tech signin picture" onClick={
            () => {
              navigate("/home");
            }
          }/>
          <form className="relative mx-auto" method="POST" aria-autocomplete="list" encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)} onKeyDown={(e) => { if (e.key === "Enter") { handleSubmit(e) } }}>
            <p className="text-center font-bold text-xl sm:text-[32px] mb-9">Create an account, 😎</p>

            <FileInput
              name="avatar"
              accept="image/png,image/jpeg,image/jpg,image/webg"
              handleChange={handleImageUpload}
              myStyles={"mb-[24px]"}
              inputTitle="Avatar"
            />

            <TextInput
              type="text"
              name="email"
              placeholder="Email"
              myStyles="block mb-[24px]"
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, email: e.target.value });
              }}
            />
            <TextInput
              type="text"
              name="name"
              placeholder="Username"
              myStyles="block mb-[24px]"
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, name: e.target.value });
              }}
            />
            <TextInput
              type="text"
              name="profession"
              placeholder="Profession"
              myStyles="block mb-[24px]"
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, profession: e.target.value });
              }}
            />
            <TextInput
              type="password"
              name="password"
              placeholder="Password"
              myStyles="block mb-[24px]"
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, password: e.target.value });
              }}
              toggleType={true}
            />
            <TextInput
              type="password"
              name="repeatPassword"
              placeholder="Confirm password"
              myStyles="block mb-[36px]"
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, repeatPassword: e.target.value });
              }}
              toggleType={true}
            />
            <div className="flex items-center w-max">
              <Button
                content="Register"
                type="submit"
                myStyles=""
                handleClick={undefined}
                icon="icon-Arrow-right-alt"
                iconPos="back"
              />
              <span className="mx-2">or</span>
              <a href="/login">
                <p className="text-primary font-bold">
                  Login
                </p>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}