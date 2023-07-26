import { useEffect, useState } from "react";
import { BtnLink } from "../../types/buttontype";

export default function BigButtonLink({to, content, icon, image, myStyles, iconPos}: BtnLink) : JSX.Element {
  const [btnClass, setBtnClass] = useState<string>("text-white02 py-1 w-max");
  const [btnIcon, setBtnIcon] = useState<string | undefined>(icon);

  useEffect(() => {
    if (content && icon) {
      if (iconPos === "back") {
        setBtnIcon(icon + " ml-1");
      } else if (iconPos === "front") {
        setBtnIcon(icon + " mr-2.5");
      }
    } else if (icon) {
      setBtnClass("text-white py-1 px-1.5");
      setBtnIcon(icon);
    } else if (image) {
      setBtnClass("p-0 px-1.5 w-25 h-11")
    }
  },[icon]);
  return (
    <a href={to} target="_blank" className={image && "place-self-center"}>
      <div className={`border-[3px] border-white02 rounded-md box-border h-10 ${myStyles || "bg-transparent"}`}>
        <p className={`flex w-max mx-auto ${btnClass}`}>
          {image && <img src={image} />}
          {(btnIcon && iconPos === "front" && content) && <span className={`small2-icon ${btnIcon}`}></span>}
          {content}
          {(btnIcon && !content) && <span className={`small2-icon ${btnIcon}`}></span>}
          {(btnIcon && iconPos === "back" && content) && <span className={`small2-icon ${btnIcon}`}></span>}
        </p>
      </div>
    </a>
  );
}