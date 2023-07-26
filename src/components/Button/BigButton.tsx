import { useEffect, useState } from "react";
import { buttonProp } from "../../types/buttontype";


export default function BigButton({ content, type, myStyles, handleClick, icon, iconPos }: buttonProp): JSX.Element {
  const [btnClass, setBtnClass] = useState<string>("box-border flex rounded-full text-white text-xl font-medium px-3.5 py-1.75 max-h-10");
  const [btnIcon, setBtnIcon] = useState<string | undefined>(icon);

  useEffect(() => {
    if (content && icon) {
      if (iconPos === "back") {
        setBtnIcon(icon + " ml-1");
        setBtnClass("box-border flex rounded-full text-white text-xl font-medium px-3.5 py-1.75 max-h-10");
      } else if (iconPos === "front") {
        setBtnIcon(icon + " mr-2.5");
        setBtnClass("box-border flex rounded-full text-white text-xl font-medium px-3.5 py-1.75 max-h-10");
      }
    }
    else if (icon) {
      setBtnClass("box-border flex rounded-full text-white text-xl px-1.5 py-1.75 w-10 h-10");
      setBtnIcon(icon);
    }
  }, [icon, iconPos, content]);
  return (
    <button
      className={`${btnClass} ${myStyles || "bg-primary"}`}
      type={type}
      onClick={handleClick}
    >
      {(btnIcon && iconPos === "front" && content) && <span className={`${btnIcon} medium-icon`}></span>}
      {content}
      {(btnIcon && !content) && <span className={`${btnIcon} medium-icon`}></span>}
      {(btnIcon && iconPos === "back" && content) && <span className={`${btnIcon} medium-icon`}></span>}
    </button>
  );
}