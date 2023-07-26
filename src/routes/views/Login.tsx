import { Navigate, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import TextInput from "../../components/Input/TextInput";
import { useState } from "react";
import axios from "axios";
import MessageBox from "../../components/Notification/MessageBox";
import BigButtonLink from "../../components/Button/BigButtonLink";
import { Helmet } from "react-helmet";
import { useAppDispatch } from "../../app/hook";
import { updateData } from "../../features/userData/userSlice";
import { localhostIP } from "../../App"; 

type LoginError = {
  status: boolean,
  message?: string
}

type LoginForm = {
  email: string,
  password: string
}

export default function Login(): JSX.Element {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: ""
  });
  const [formError, setError] = useState<LoginError>({
    status: false,
    message: ""
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://${localhostIP}:3001/api/user/login`, form);
      const data = res.data;
      localStorage.setItem("token", JSON.stringify(data.token));
      localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));

      dispatch(updateData(data.user));
    
      //Clear error
      setError({
        status: false,
        message: ""
      })
      setSuccess(true);
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { message } = error.response.data;
        setError({
          status: true,
          message
        });
        alert(message);

      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      //console.log(error.config);
    };
  }
  return (
    <div className="relative bg-black w-screen h-screen">
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login into Vtech" />
      </Helmet>
      {formError.status && <MessageBox key={Math.random()} content={formError.message as string} onClose={() => {
        setError({
          status: false,
          message: ""
        });
      }} />}
      {success && <Navigate to="/" />}
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
          <form className="relative" method="POST" aria-autocomplete="list" onSubmit={(e) => handleSubmit(e)} onKeyDown={(e) => { if (e.key === "Enter") { handleSubmit(e) } }}>
            <p className="text-center font-bold text-xl sm:text-[32px] mb-9">Welcome back, 👋</p>
            <TextInput
              id={undefined}
              type="text"
              name="email"
              placeholder="Email"
              myStyles="block mb-[24px]"
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, email: e.target.value });
              }}
            />
            <TextInput
              type="password"
              name="password"
              placeholder="Password"
              myStyles="block mb-[28px]"
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, password: e.target.value });
              }}
              toggleType={true}
            />
            <div className="flex items-center w-max">
              <Button
                content="Sign in"
                type="submit"
                myStyles=""
                handleClick={undefined}
                icon="icon-Arrow-right-alt"
                iconPos="back"
              />
              <span className="mx-2">or</span>
              <a href="/register">
                <p className="text-primary font-bold">
                  Create an account
                </p>
              </a>
            </div>
            <div className="w-full relative">
              <div className="absolute left-0 w-full bg-white03 h-[2px] center"></div>
              <p className="relative text-white03 w-max mx-auto mt-4 mb-3 bg-black px-2">Sign in with</p>
            </div>
            <BigButtonLink
              iconPos="front"
              icon="icon-google-Logo"
              to="/"
              content="Sign in with Google"
            />
            <BigButtonLink
              iconPos="front"
              myStyles="mt-4"
              icon="icon-facebook-Logo"
              to="/"
              content="Sign in with Facebook"
            />
          </form>
        </div>
      </div>
    </div>
  );
}