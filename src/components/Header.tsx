import Button from "./Button/Button";
import ButtonLink from "./Button/ButtonLink";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

export default function Header({ openSideBar }: BlogAppHeader): JSX.Element {
  const user: User = useSelector((state: RootState) => state.userData);

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    window.onresize = () => {
      setWindowWidth(window.innerWidth);
    }
  }, []);

  if (user._id) {
    return (
      <header className="sticky bg-black z-50 top-0 grid grid-cols-3 px-[24px] mx-auto gap-4 h-15 items-center">
        {
          user.notifications.length > 0 ?
            <div className="relative w-max h-max place-self-start-center">
              <Button
                content=""
                handleClick={() => {
                  openSideBar(true);
                }}
                myStyles="bg-transparent"
                type="button"
                icon="icon-Hamburger"
                iconPos="none"
              />
              <span className="absolute flex h-[10px] w-[10px] top-2 left-[22px] animate-bounce pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-primary"></span>
              </span>
            </div> :
            <Button
              content=""
              handleClick={() => {
                openSideBar(true);
              }}
              myStyles="bg-transparent place-self-start-center"
              type="button"
              icon="icon-Hamburger"
              iconPos="none"
            />

        }
        <ButtonLink
          to="/home"
          image="/logo.svg"
          iconPos="none"
        />
        <nav className="flex h-35px place-self-end-center w-max">
          <ButtonLink
            to="/write"
            content="Write"
            icon="icon-Edit"
            iconPos="back"
            myStyles="hidden sm:flex"
          />
          {(windowWidth > 643) ?
            <ButtonLink
              content="Search"
              to="/search"
              icon="icon-Search"
              iconPos="back"
              myStyles="searchBtn bg-primary"
            /> : <ButtonLink
              key={Date.now.toString()}
              to="/search"
              icon="icon-Search"
              iconPos="none"
              myStyles="searchBtn bg-primary"
            />}
        </nav>
      </header>
    );
  } else {
    return (
      <header className="sticky bg-black z-50 top-0 grid grid-cols-3 px-[24px] mx-auto gap-4 h-15 items-center">
        <Button
          content=""
          handleClick={() => {
            openSideBar(true);
          }}
          myStyles="place-self-start-center"
          type="button"
          icon="icon-Hamburger"
          iconPos="none"
        />
        <ButtonLink
          to="/home"
          image="/logo.svg"
          iconPos="none"
        />
        <nav className="flex h-35px place-self-end-center w-max">
          {(windowWidth > 643) ?
            <ButtonLink
              content="Search"
              to="/search"
              icon="icon-Search"
              iconPos="back"
              myStyles="searchBtn bg-primary"
            /> : <ButtonLink
              key={Date.now.toString()}
              to="/search"
              icon="icon-Search"
              iconPos="none"
              myStyles="searchBtn bg-primary"
            />}
        </nav>
      </header>
    );
  }
}