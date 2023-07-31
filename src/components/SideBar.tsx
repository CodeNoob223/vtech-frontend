import ButtonLink from "./Button/ButtonLink";
import Button from "./Button/Button";
import { useEffect, useState } from "react";
import UserCard from "./Card/UserCard";
import { useAppSelector } from "../app/hook";

type AppSideBar = {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  location: string
}

export default function SideBar({ isOpen, setIsOpen, location }: AppSideBar): JSX.Element {
  const user: User = useAppSelector((state) => state.userData);
  const [currentLocation, setCurrentLocation] = useState<string>("");

  useEffect(() => {
    setCurrentLocation(location);
  }, [location])

  useEffect(() => {
    document.addEventListener("keydown", escPressed, true);

    return document.removeEventListener("keydown", escPressed);
  }, []);

  const escPressed = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  if (user._id) {
    return (
      <menu className={`fixed z-50 h-screen w-64 top-0 left-n64 bg-black ease-in-out duration-300 ${isOpen ? "translate-x-64" : "translate-x-0"}`}>
        <div className={`absolute top-0 ${isOpen ? "left-0" : "left-n64"} w-[260px] h-full bg-secondary z-10`}></div>
        <div className={`transition-opacity absolute top-0 left-0 h-full w-[200vw] bg-black ${isOpen ? "opacity-80" : "hidden pointer-events-none"}`} onClick={() => setIsOpen(false)}></div>
        <section className="relative bg-secondary w-full h-15 grid grid-cols-3 gap-4 items-center z-10">
          <Button
            handleClick={() => {
              setIsOpen(false);
            }}
            myStyles="place-self-start-center ml-1"
            icon="icon-Keyboard-arrow-left"
            iconPos="none"
          />
          <ButtonLink
            to="/home"
            myStyles="bg-transparent"
            image="/logo.svg"
            iconPos="back"
          />
        </section>
        <section className="relative w-full h-full bg-black z-10">
          <div className="relative bg-black text-white w-full pl-6 pt-6 pb-0">
            <p className="text-white02 mb-2">Options</p>
            <ul className="space-y-2">
              <li>
                <ButtonLink
                  content="Your profile"
                  to={`/profile/${user?._id}`}
                  myStyles={`${currentLocation === `/profile/${user?._id}` && "text-primary"} bg-transparent font-medium`}
                  icon={currentLocation === `/profile/${user?._id}` ? "icon-Account-circle text-primary" : "icon-Account-circle"}
                  iconPos="front"
                />
              </li>
              <li>
                <ButtonLink
                  content="Followed"
                  to="/followed"
                  myStyles={`${currentLocation === "/followed" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/followed" && "text-primary"} icon-Groups`}
                  iconPos="front"
                />
              </li>
              <li>
                <div className="relative">
                  <ButtonLink
                    content="Notification"
                    to="/notification"
                    myStyles={`${currentLocation === "/notification" && "text-primary"} bg-transparent font-medium`}
                    icon={`${currentLocation === "/notification" && "text-primary"} icon-Notifications`}
                    iconPos="front"
                  />
                  {(user && user.notifications.length > 0 && currentLocation !== "/notification") &&
                    <span className="absolute flex h-[10px] w-[10px] top-2 left-[30px] animate-bounce">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-primary"></span>
                    </span>
                  }
                </div>
              </li>
              <li>
                <ButtonLink
                  content="Create or edit"
                  to="/yourblogs"
                  myStyles={`${currentLocation === "/yourblogs" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/yourblogs" && "text-primary"} icon-Edit`}
                  iconPos="front"
                />
              </li>
              <li>
                <ButtonLink
                  content="Account"
                  to="/accountsetting"
                  myStyles={`${currentLocation === "/accountsetting" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/accountsetting" && "text-primary"} icon-Privacy-tip`}
                  iconPos="front"
                />
              </li>
            </ul>
          </div>
          <div className="text-white w-full pl-6 pt-6 pb-0">
            <p className="text-white02 mb-2">Blogs</p>
            <ul className="space-y-2">
              <li>
                <ButtonLink
                  content="Bookmark"
                  to="/bookmarked"
                  myStyles={`${currentLocation === "/bookmarked" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/bookmarked" && "text-primary"} icon-Bookmark`}
                  iconPos="front"
                />
              </li>
              <li>
                <ButtonLink
                  content="Latests"
                  to="/latests"
                  myStyles={`${currentLocation === "/latests" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/latests" && "text-primary"} icon-Access-time`}
                  iconPos="front"
                />
              </li>
              <li>
                <ButtonLink
                  content="Most likes"
                  to="/mostlikes"
                  myStyles={`${currentLocation === "/mostlikes" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/mostlikes" && "text-primary"} icon-Thumb-up`}
                  iconPos="front"
                />
              </li>
              <li className="relative">
                <ButtonLink
                  content="Most views"
                  to="/mostviews"
                  myStyles={`${currentLocation === "/mostviews" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/mostviews" && "text-primary"} icon-Visibility`}
                  iconPos="front"
                />
                <span className="absolute pointer-events-none flex h-max w-max top-0 text-xs bg-primary text-white font-bold px-[6px] rounded-full right-[80px] animate-bounce">
                  new
                </span>
              </li>
              <li>
                <ButtonLink
                  content="Certified"
                  to="/certifiedblogs"
                  myStyles={`${currentLocation === "/certifiedblogs" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/certifiedblogs" && "text-primary"} icon-Verified`}
                  iconPos="front"
                />
              </li>
            </ul>
          </div>
        </section>
        <UserCard
          user={user as User}
          myStyles={"absolute left-0 bottom-0 w-full z-10"}
        />
      </menu>
    );
  } else {
    return (
      <menu className={`fixed z-50 h-screen w-64 top-0 left-n64 bg-black ease-out duration-300 ${isOpen ? "translate-x-64" : "translate-x-0"}`}>
        <div className={`absolute top-0 ${isOpen ? "left-0" : "left-n64"} w-[260px] h-full bg-secondary z-10`}></div>
        <div className={`transition-opacity absolute top-0 left-0 h-full w-[200vw] bg-black ${isOpen ? "opacity-80" : "hidden pointer-events-none"}`} onClick={() => setIsOpen(false)}></div>
        <section className="relative bg-secondary w-full h-15 grid grid-cols-3 gap-4 items-center z-10">
          <Button
            handleClick={() => {
              setIsOpen(false);
            }}
            myStyles="place-self-start-center ml-1"
            icon="icon-Keyboard-arrow-left"
            iconPos="none"
          />
          <ButtonLink
            to="/home"
            myStyles="bg-transparent"
            image="/logo.svg"
            iconPos="back"
          />
        </section>
        <section className="relative w-full h-full bg-black z-10">
          <div className="text-white w-full pl-6 pt-6 pb-0">
            <p className="text-white02 mb-2">Blogs</p>
            <ul className="space-y-2">
              <li>
                <ButtonLink
                  content="Latests"
                  to="/latests"
                  myStyles={`${currentLocation === "/latests" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/latests" && "text-primary"} icon-Access-time`}
                  iconPos="front"
                />
              </li>
              <li>
                <ButtonLink
                  content="Most likes"
                  to="/mostlikes"
                  myStyles={`${currentLocation === "/mostlikes" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/mostlikes" && "text-primary"} icon-Thumb-up`}
                  iconPos="front"
                />
              </li>
              <li className="relative">
                <ButtonLink
                  content="Most views"
                  to="/mostviews"
                  myStyles={`${currentLocation === "/mostviews" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/mostviews" && "text-primary"} icon-Visibility`}
                  iconPos="front"
                />
                <span className="absolute pointer-events-none flex h-max w-max top-0 text-xs bg-primary text-white font-bold px-[6px] rounded-full right-[80px] animate-bounce">
                  new
                </span>
              </li>
              <li>
                <ButtonLink
                  content="Certified"
                  to="/certifiedblogs"
                  myStyles={`${currentLocation === "/certifiedblogs" && "text-primary"} bg-transparent font-medium`}
                  icon={`${currentLocation === "/certifiedblogs" && "text-primary"} icon-Verified`}
                  iconPos="front"
                />
              </li>
            </ul>
          </div>
          <div className="text-white w-full pl-6 pt-6 pb-0">
            <p className="text-white02 mb-2">Account</p>
            <div className="flex space-x-2 items-center">
              <ButtonLink
                content="Login"
                to="/login"
                iconPos="none"
                myStyles="bg-primary"
              />
              <p>Or</p>
              <ButtonLink
                content="Register"
                to="/register"
                iconPos="none"
                myStyles="bg-secondary"
              />
            </div>
          </div>
        </section>
      </menu>
    );
  }
}