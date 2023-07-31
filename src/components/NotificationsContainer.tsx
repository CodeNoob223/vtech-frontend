import { useAppSelector } from "../app/hook"
import MessageBox from "./Notification/MessageBox";

export default function NotificationContainer() : JSX.Element {
  const notifications = useAppSelector(state => state.pageNotification);

  return <div className="fixed z-[100] w-max h-max top-10 right-10 flex flex-col gap-2">
    {notifications.map(notif => {
      return <MessageBox 
        key={notif.id || ""}
        id={notif.id || ""}
        content={notif.message || ""}
        messageType={notif.type}
      />
    })}
  </div>
}