import axios from "axios";
import Button from "../Button/Button";
import { useAppDispatch } from "../../app/hook";
import getToken from "../../helpers/getLocalStorage";
import { logOutAction } from "../../features/userData/userSlice";

type AppUserCard = {
  user: User,
  myStyles?: String
}

export default function UserCard({ user, myStyles }: AppUserCard): JSX.Element {
  const dispatch = useAppDispatch();
  const logOut = async () => {
    const accessToken = await getToken("access");
    try {
      await axios.post(`http://localhost:3001/api/user/logout`, {}, {
        headers: {
          "auth-token": accessToken
        }
      });
      localStorage.clear();
      dispatch(logOutAction());
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { message } = error.response.data;
        console.log({ type: "bg-error", show: true, message });
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log({ type: "bg-error", show: true, message: error.request });
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log({ type: "bg-error", show: true, message: error.message });
        console.log('Error', error.message);
      }
      console.log(error);
    };
  }


  return (
    <section className={`${myStyles} flex h-21 bg-secondary p-5`}>
      <div className="h-12 w-12 bg-black rounded-sm overflow-hidden mr-2 flex-shrink-0">
        <img className={`w-[100%] h-[100%] top-[${user.avatar.top}px] left-[${user.avatar.left}px] `} src={`${user.avatar.url}`} alt="" />
      </div>

      <div>
        <div className="text-white font-medium">
          <div className="flex items-center max-w-[130px] overflow-hidden">
            <a href={`/profile/${user._id}`}>
              <p className="max-w-[100px] whitespace-nowrap overflow-clip text-clip">
                {user.name}
              </p>
            </a>
            {true && <span className="icon-Verified small-icon ml-1 text-primary"></span>}
          </div>
          <p className="max-w-[150px] whitespace-nowrap overflow-clip text-clip text-white02 text-sm">
            {user.profession}
          </p>
        </div>
      </div>

      <Button
        myStyles="ml-auto flex-shrink-0"
        icon="icon-Logout"
        handleClick={() => { logOut() }}
        iconPos="none"
      />
    </section>
  );
}