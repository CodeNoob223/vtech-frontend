import Button from "./Button/Button";
import ButtonLink from "./Button/ButtonLink";
import { RootState } from "../app/store";
import { useAppSelector } from "../app/hook";

export default function Header({ openSideBar }: BlogAppHeader): JSX.Element {
  const user: User = useAppSelector((state: RootState) => state.userData);

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
        <nav className="flex gap-3 h-35px place-self-end-center w-max">
          <ButtonLink
            to="/write"
            content=""
            icon="icon-Edit hover:text-primary"
            iconPos="none"
            myStyles="hidden sm:flex"
          />
          <ButtonLink
            key={Date.now.toString()}
            to="/search"
            icon="icon-Search hover:text-primary"
            iconPos="none"
            myStyles="bg-transparent"
          />
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
        <nav className="flex h-35px place-self-end-center w-max items-center">
          <ButtonLink
            to="/login"
            content=""
            icon="icon-Edit hover:text-primary"
            iconPos="none"
            myStyles="hidden sm:flex"
          />
          <ButtonLink
            key={Date.now.toString()}
            to="/search"
            icon="icon-Search hover:text-primary"
            iconPos="none"
            myStyles="bg-transparent"
          />
          <a href="/login" className="text-primary font-bold ml-2 sm:block hidden">Sign in</a>
        </nav>
      </header>
    );
  }
}