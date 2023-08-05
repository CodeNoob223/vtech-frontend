import Button from "./Button/Button";
import ButtonLink from "./Button/ButtonLink";
import { RootState } from "../app/store";
import { useAppSelector } from "../app/hook";
import { postRequest } from "../helpers/fetchData";
import { useState } from "react";
import { localhostIP } from "../App";
import { useNavigate } from "react-router-dom";

export default function Header({ openSideBar }: BlogAppHeader): JSX.Element {
  const user: User = useAppSelector((state: RootState) => state.userData);
  const [searchResult, setSearchResult] = useState<{
    isFocus: boolean,
    results: Blog[]
  }>({
    isFocus: false,
    results: []
  });
  const [searchString, setSearchString] = useState<string>("");
  const navigate = useNavigate();
  const searchBlog = async () => {
    const res = await postRequest<Blog[]>(`${localhostIP}/api/blog/search?title=${searchString || ""}&limit=5&skip=0`, "", {
      categories: []
    });
    if (res.success) {
      setSearchResult(prev => {
        return {
          ...prev,
          results: res.data
        }
      });
    }
  }
  if (user._id) {
    return (
      <header className="sticky bg-black z-50 top-0 grid grid-cols-5 px-[24px] mx-auto gap-4 h-15 items-center">
        <section className="flex gap-2 items-center">
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
            myStyles="h-max w-max"
          />
        </section>
        <section className="flex flex-col w-[90%] max-w-[600px] mx-auto col-span-3 relative">
          <input
            name="search"
            autoComplete="off"
            type="text"
            className="block w-full bg-black text-slate-500 focus:text-slate-950 opacity-50 focus:opacity-100 focus:bg-slate-50 focus:border-none border-[3px] border-solid border-slate-500 h-[40px] font-sm rounded-md pl-2 pr-6"
            placeholder="Search for a blog"
            onChange={(e) => {
              setSearchString(e.target.value);
              searchBlog();
            }}
            onFocus={(e) => {
              setSearchResult(prev => { return { ...prev, isFocus: true } });
              setSearchString(e.target.value);
              searchBlog();
            }}
            onBlur={() => setTimeout(() => setSearchResult(prev => { return { ...prev, isFocus: false } }), 300)}
            maxLength={40}
            value={searchString}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/search?title=${searchString}`)
              }
            }}
          />
          <span className="icon-Search absolute right-2 top-[7px] text-2xl text-slate-500 cursor-pointer"></span>
          <div className={`absolute h-max w-full max-h-[120px] lg:max-h-[320px] top-[40px] left-0 rounded-sm overflow-y-scroll z-10 cursor-pointer ${!searchResult.isFocus && "hidden"}`}>
            {searchResult.results.map((result) => {
              return (
                <div key={result._id} className="h-[40px] w-full bg-slate-50 hover:bg-slate-200 pt-2 pl-2">
                  <a href={`/blog/${result._id}`}>
                    {result.title}
                  </a>
                </div>)
            })}
          </div>
        </section>
        <section className="flex gap-2 items-center">
          <div className="ml-auto w-max h-max">
            <ButtonLink
              to="/write"
              content=""
              icon="icon-Edit hover:text-primary"
              iconPos="none"
              myStyles="flex"
            />
          </div>
        </section>
      </header>
    );
  } else {
    return (
      <header className="sticky bg-black z-50 top-0 grid grid-cols-5 px-[24px] mx-auto gap-4 h-15 items-center">
        <section className="flex gap-2 items-center">
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
            myStyles="h-max w-max"
          />
        </section>
        <section className="flex flex-col w-[90%] max-w-[600px] mx-auto col-span-3 relative">
          <input
            name="search"
            autoComplete="off"
            type="text"
            className="block w-full bg-black text-slate-500 focus:text-slate-950 opacity-50 focus:opacity-100 focus:bg-slate-50 focus:border-none border-[3px] border-solid border-slate-500 h-[40px] font-sm rounded-md pl-2 pr-6"
            placeholder="Search for a blog"
            onChange={(e) => {
              setSearchString(e.target.value);
              searchBlog();
            }}
            onFocus={(e) => {
              setSearchResult(prev => { return { ...prev, isFocus: true } });
              setSearchString(e.target.value);
              searchBlog();
            }}
            onBlur={() => setTimeout(() => setSearchResult(prev => { return { ...prev, isFocus: false } }), 300)}
            maxLength={40}
            value={searchString}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/search?title=${searchString}`)
              }
            }}
          />
          <span className="icon-Search absolute right-2 top-[7px] text-2xl text-slate-500 cursor-pointer"></span>
          <div className={`absolute h-max w-full max-h-[120px] lg:max-h-[320px] top-[40px] left-0 rounded-sm overflow-y-scroll z-10 cursor-pointer ${!searchResult.isFocus && "hidden"}`}>
            {searchResult.results.map((result) => {
              return (
                <div key={result._id} className="h-[40px] w-full bg-slate-50 hover:bg-slate-200 pt-2 pl-2">
                  <a href={`/blog/${result._id}`}>
                    {result.title}
                  </a>
                </div>)
            })}
          </div>
        </section>
        <section className="flex gap-2 items-center">
          <div className="hidden sm:block ml-auto w-max h-max">
            <ButtonLink
              to="/login"
              content=""
              icon="icon-Edit hover:text-primary"
              iconPos="none"
              myStyles="flex"
            />
          </div>
          <a href="/login" className="bg-primary-no-gr p-[3px] rounded-md">
            <div className="bg-black hover:bg-primary-no-gr transition-all duration-300 rounded">
              <p className="px-3 py-1 text-primary-no-gr font-bold hover:text-white">
                Sign in
              </p>
            </div>
          </a>
        </section>
      </header>
    );
  }
}