import React, { useEffect, useState } from "react";
import { buttonProp } from "../../types/buttontype";


export default function Button( {content, type, myStyles, handleClick, icon, iconPos} : buttonProp ) : JSX.Element {
  const [btnClass, setBtnClass] = useState<string>("box-border flex text-white text-base font-medium py-1.5 px-4 h-35px");
  const [btnIcon, setBtnIcon] = useState<string | undefined>(icon);
  useEffect(() => {
    if (content && icon) {
      if (iconPos === "back") {
        setBtnIcon(icon + " ml-1");
        setBtnClass("box-border flex text-white text-base font-medium py-1.5 px-4 h-35px");
      } else if (iconPos === "front") {
        setBtnIcon(icon + " mr-2.5");
        setBtnClass("box-border flex text-white text-base font-medium py-1.5 px-4 h-35px");
      }
    } else if (icon) {
      setBtnClass("box-border flex text-white text-base font-medium py-1.5 px-1.25 h-35px w-35px");
      setBtnIcon(icon);
    }
  },[icon, iconPos, content]);
  return(
    <button 
      className={`rounded-full select-none ${myStyles || "bg-primary"} ${btnClass}`} 
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