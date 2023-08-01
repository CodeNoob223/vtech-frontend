import Button from "../Button/Button";
import { useAppDispatch } from "../../app/hook";
import getToken from "../../helpers/getLocalStorage";
import { logOutAction } from "../../features/userData/userSlice";
import { postRequest } from "../../helpers/fetchData";
import { localhostIP } from "../../App";

type AppUserCard = {
  user: User,
  myStyles?: String
}

export default function UserCard({ user, myStyles }: AppUserCard): JSX.Element {
  const dispatch = useAppDispatch();
  const logOut = async () => {
    const accessToken = await getToken("access");

    const res = await postRequest<undefined>(`${localhostIP}/api/user/logout`, accessToken, {});
    
    if (res.success) {
      localStorage.clear();
      dispatch(logOutAction());
    }
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
            {user.isCertified && <span className="icon-Verified small-icon ml-1 text-primary"></span>}
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