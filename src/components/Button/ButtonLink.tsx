import { useEffect, useState } from "react";
import { BtnLink } from "../../types/buttontype";

export default function ButtonLink({to, content, icon, image, myStyles, iconPos}: BtnLink) : JSX.Element {
  const [btnClass, setBtnClass] = useState<string>("rounded-full text-white font-bold py-1.5 px-4 w-max h-35px");
  const [btnIcon, setBtnIcon] = useState<string | undefined>(icon);

  useEffect(() => {
    if (content && icon) {
      if (iconPos === "back") {
        setBtnIcon(icon + " ml-1");
        setBtnClass("rounded-full text-white font-bold py-1.5 px-4 w-max h-35px");
      } else if (iconPos === "front") {
        setBtnIcon(icon + " mr-2.5");
        setBtnClass("rounded-full text-white font-bold py-1.5 px-4 w-max h-35px");
      }
    } else if (icon) {
      setBtnClass("rounded-full text-white font-bold py-1.5 px-1.5 w-35px h-35px");
      setBtnIcon(icon);
    } else if (image) {
      setBtnClass("p-0 px-1.5 w-25 h-9")
    }
  },[icon, iconPos, content]);
  return (
    <a href={to} className={image && "place-self-center"}>
      <p className={`${myStyles} ${btnClass} flex`}>
        {image && <img src={image} />}
        {(btnIcon && iconPos === "front" && content) && <span className={`${btnIcon} medium-icon`}></span>}
        {content}
        {(btnIcon && !content) && <span className={`${btnIcon} medium-icon`}></span>}
        {(btnIcon && iconPos === "back" && content) && <span className={`${btnIcon} medium-icon`}></span>}
      </p>
    </a>
  );
}