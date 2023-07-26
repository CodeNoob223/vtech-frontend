import React, { useEffect, useState } from "react";
import { buttonProp } from "../../types/buttontype";


export default function SmallButton( {content, type, myStyles, handleClick, icon, iconPos} : buttonProp ) : JSX.Element {
  const [btnClass, setBtnClass] = useState<string>("box-border flex rounded-full text-white text-base px-3.5 py-1 max-h-8");
  const [btnIcon, setBtnIcon] = useState<string | undefined>(icon);

  useEffect(() => {
    if (icon && content) {
      if (iconPos === "back") {
        setBtnIcon(icon + " ml-1");
        setBtnClass("box-border flex rounded-full text-white text-base px-3.5 py-1 max-h-8");
      } else if (iconPos === "front") {
        setBtnIcon(icon + " mr-1");
        setBtnClass("box-border flex rounded-full text-white text-base px-3.5 py-1 max-h-8");
      }
    } else if (icon) {
      setBtnClass("box-border flex rounded-full text-white text-base px-1.5 py-1 h-8 w-8");
      setBtnIcon(icon);
    }
  },[icon, iconPos, content]);
  return(
    <button 
      className={`${btnClass} ${myStyles || "bg-primary"}`} 
      type={type}
      onClick={handleClick}
    >
      {(btnIcon && iconPos === "front" && content) && <span className={`${btnIcon}`}></span>}
      {content}
      {(btnIcon && !content) && <span className={`${btnIcon}`}></span>}
      {(btnIcon && iconPos === "back" && content) && <span className={`${btnIcon}`}></span>}
    </button>
  );
}