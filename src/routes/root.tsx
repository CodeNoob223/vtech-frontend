import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Root() {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);

  const location = useLocation();

  return(
    <div className="relative bg-black">
      <Header 
        openSideBar={setIsSideBarOpen}
      />
      <SideBar 
        isOpen={isSideBarOpen}
        setIsOpen={setIsSideBarOpen}
        location={location.pathname}
      />
      <main className="relative bg-black min-h-[100vh] h-auto w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}