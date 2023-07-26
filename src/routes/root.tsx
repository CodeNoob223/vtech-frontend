import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import MessageBox from "../components/Notification/MessageBox";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { closeNotification } from "../features/pageNotification/pageNotificationSlice";
import Footer from "../components/Footer";

export default function Root() {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const pageNotification = useAppSelector(state => state.pageNotification);
  const dispatch = useAppDispatch();

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
      {pageNotification.show && 
      <MessageBox 
        content={pageNotification.message as string} 
        messageType={pageNotification.type}
        onClose={() => dispatch(closeNotification())} 
      />}
      <main className="relative bg-black min-h-[100vh] h-auto w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}