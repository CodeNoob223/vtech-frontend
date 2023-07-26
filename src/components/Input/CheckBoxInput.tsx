import { useState } from "react";

export default function CheckBoxInput({id, name, checked, content, link, href, handleChange, myStyles} : AppCheckBox) {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  
  return (
    <div className={`flex ml-4 w-max h-max translate-y-[5px] ${myStyles}`}>
      <div className="relative w-4 h-4 rounded-[4px] overflow-hidden bg-white mr-1 translate-y-1">
        {isChecked && <img className="absolute top-0 left-0 w-4 h-4" src="images/checked.svg" alt="checked" />}
        <input id={id} name={name} checked={checked} className="absolute top-0 left-0 opacity-0 cursor-pointer" type="checkbox" 
          onChange={
            (e) => {
              handleChange(e);
              setIsChecked(e.target.checked);
            }
          } 
        />
      </div>
      <p className="text-white02">{content} {link && <a className="text-primary" href={href}>{link}</a>}</p>
    </div>
  );

}