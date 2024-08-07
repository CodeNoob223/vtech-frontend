import axios from "axios";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { createBrowserRouter, Navigate, redirect, RouterProvider } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./app/hook";
import { RootState } from "./app/store";
import NotificationContainer from "./components/NotificationsContainer";
import { updateData, updateUserNotification } from "./features/userData/userSlice";
import { getRequest } from "./helpers/fetchData";
import getToken from "./helpers/getLocalStorage";
import ErrorPage from "./routes/errorPage";
import Root from "./routes/root";
import Blog from "./routes/views/Blog";
import BookmarkedBlog from "./routes/views/Bookmarked";
import Certified from "./routes/views/Certified";
import CreateBlog from "./routes/views/CreateBlog";
import EditBlog from "./routes/views/EditBlog";
import Followed from "./routes/views/Followed";
import Latests from "./routes/views/Latests";
// import Login from "./routes/views/Login";

import Login from "./routes/views/Login";
import Main from "./routes/views/Main";
import MostLikes from "./routes/views/MostLikes";
import MostViews from "./routes/views/MostViews";
import NotificationList from "./routes/views/Notification";
import Profile from "./routes/views/Profile";
import Register from "./routes/views/Register";
import SearchPage from "./routes/views/Search";
import WrittenBlog from "./routes/views/WrittenBlog";
import { socket } from "./Socket";

export const localhostIP = "https://vtech-api.onrender.com";
// export const localhostIP = "http://localhost:3001";

export default function App() {
  const user: User = useAppSelector((state: RootState) => state.userData);
  const dispatch = useAppDispatch();

  const axiosJWT = axios.create();

  socket.on("notification", async (args: string) => {
    if (user._id) {
      await getNotification();
    }
  });

  const getNotification = async () => {
    if (user._id) {
      const accessToken = await getToken("access");

      const res = await getRequest<UserNotification[]>(`${localhostIP}/api/interact/notification?id=${user._id}`, accessToken);
      
      if (res.success) {
        dispatch(updateUserNotification(res.data));
      }

    }
  }
  const refreshToken = async () => {
    try {
      const refToken: string = await getToken("refresh") as string;
      const headers: object = { "refresh-token": refToken }
      const res = await axios.post(`${localhostIP}/api/user/refreshtoken`, {}, {
        headers
      });
      const userData = res.data as { token: string, refreshToken: string };
      localStorage.setItem("token", JSON.stringify(userData.token));
      localStorage.setItem("refreshToken", JSON.stringify(userData.refreshToken));
      return userData.token;
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data;
        console.log(message);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
      return "";
    };
  }
  const fetchUserData = async () => {
    const accessToken = await getToken("access");
    if (!user._id && accessToken) {
      try {
        const res = await axiosJWT.get(`${localhostIP}/api/user/getuser`, {
          headers: {
            "auth-token": accessToken
          }
        });
        const userData: User = res.data.user;
        dispatch(updateData(userData));
        socket.auth = { userId: userData._id as string };
        socket.connect();
        return userData;
      } catch (error: any) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const { message } = error.response.data;
          console.log(message);
          if (message === "Please login first!") {
            localStorage.clear();
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
        return null;
      };
    }
  }
  useEffect(() => {
    // console.log("App.tsx called getuser api");
    //user chua ton tai va phai co 1 token
    //VD1: khi refresh thi user = null, nhung token lai ton tai => da dang nhap => fetch
    //VD2: khi user = null, token cung khong ton tai => chua dang nhap => khong fetch
    fetchUserData();
  }, []);
  const router = createBrowserRouter([
    {
      path: "",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          path: "/",
          element: <Main />
        },
        {
          path: "search",
          element: <SearchPage />
        },
        {
          path: "blog/:blogId",
          element: <Blog />,
          loader: async ({ params }) => {
            const accessToken = await getToken("access");
            try {
              const res = await axios.get(`${localhostIP}/api/blog?id=${params.blogId}`, {
                headers: {
                  "auth-token": accessToken,
                }
              });
              const data: Blog = res.data.data;

              return {
                blogData: data,
                blogNotification: {
                  type: "bg-error",
                  show: false,
                  message: ""
                }
              };

            } catch (error: any) {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const { message } = error.response.data;
                if (message === "Can't find the blog!") {
                  return redirect("/");
                }

                return {
                  blogData: {},
                  blogError: { status: true, message }
                };
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
                return {
                  blogData: {},
                  blogError: { status: true, message: error.request }
                };
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                return {
                  blogData: {},
                  blogError: { status: true, message: error.message }
                }
              }
            };
          }
        },
        {
          path: "edit/:blogId",
          element: <EditBlog />,
          loader: async () => {
            const accessToken = await getToken("access");
            if (!accessToken) return redirect("/");
            return user;
          }
        },
        {
          path: "/write",
          element: <CreateBlog />,
          loader: async () => {
            const accessToken = await getToken("access");
            if (!accessToken) return redirect("/");
            return user;
          }
        },
        {
          path: "/yourblogs",
          element: <WrittenBlog />,
          loader: async () => {
            const accessToken = await getToken("access");
            if (!accessToken) return redirect("/");
            return user;
          }
        },
        {
          path: "/profile/:userId",
          element: <Profile />,
          loader: async ({ params }) => {
            try {
              const result = await axios.get(`${localhostIP}/api/user/getprofile/${params.userId}`);
              const data = {
                ...result.data.data,
                recentPosts: result.data.recentPosts,
                likedPosts: result.data.likedPosts
              }

              return data;
            } catch (err) {
              return redirect("/");
            }
          }
        },
        {
          path: "/notification",
          element: <NotificationList />,
          loader: async () => {
            const accessToken = await getToken("access");
            if (!accessToken) return redirect("/");
            return user;
          }
        },
        {
          path: "/bookmarked",
          element: <BookmarkedBlog />,
          loader: async () => {
            const accessToken = await getToken("access");
            if (!accessToken) return redirect("/");
            return user;
          }
        },
        {
          path: "/followed",
          element: <Followed />,
          loader: async () => {
            const accessToken = await getToken("access");
            if (!accessToken) return redirect("/");
            return user;
          }
        },
        {
          path: "/latests",
          element: <Latests />
        },
        {
          path: "/mostlikes",
          element: <MostLikes />
        },
        {
          path: "/certifiedblogs",
          element: <Certified />
        },
        {
          path: "/mostviews",
          element: <MostViews />
        },
      ]
    },
    {
      path: "/register",
      errorElement: <ErrorPage />,
      element: <Register />
    },
    {
      path: "/login",
      errorElement: <ErrorPage />,
      element: <Login />
    },
    {
      path: "*",
      errorElement: <ErrorPage />,
      element: <Navigate to="/" replace={true} />
    }
  ]);

  axiosJWT.interceptors.request.use(async (config: any) => {
    const token = await getToken("access");
    if (token) {
      let currentDate = new Date();
      type decodeToken = {
        exp: number
      }
      const decodedToken = jwtDecode(token) as decodeToken;

      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const newToken = await refreshToken();
        config.headers["auth-token"] = newToken;
      }
    }
    return config;
  }, (error) => {

    return Promise.reject(error);
  });

  return (
    <>
      <NotificationContainer />
      <RouterProvider router={router} />
    </>
  );
}