import { useEffect, useState } from "react";
import { buttonProp } from "../../types/buttontype";

export default function TinyButton({ content, type, myStyles, handleClick, icon, iconPos }: buttonProp): JSX.Element {
  const [btnClass, setBtnClass] = useState<string>("box-border flex rounded-full text-white font-medium text-xs px-3 py-1 max-h-6");
  const [btnIcon, setBtnIcon] = useState<string | undefined>(icon);

  useEffect(() => {
    if (content && icon) {
      if (iconPos === "back") {
        setBtnIcon(icon + " ml-1");
        setBtnClass("box-border flex rounded-full text-white font-medium text-xs px-3 py-1 max-h-6");
      } else if (iconPos === "front") {
        setBtnIcon(icon + " mr-2");
        setBtnClass("box-border flex rounded-full text-white font-medium text-xs px-3 py-1 max-h-6");
      }
    } else if (icon) {
      setBtnClass("box-border flex rounded-full text-white font-medium text-xs px-1 py-1 h-6 w-6");
      setBtnIcon(icon);
    }
  }, [icon, iconPos, content]);
  return (
    <button
      className={`${btnClass} ${myStyles || "bg-primary"}`}
      type={type}
      onClick={handleClick}
    >
      {(btnIcon && iconPos === "front" && content) && <span className={`${btnIcon} small-icon`}></span>}
      {content}
      {(btnIcon && !content) && <span className={`${btnIcon} small-icon`}></span>}
      {(btnIcon && iconPos === "back" && content) && <span className={`${btnIcon} small-icon`}></span>}
    </button>
  );
}