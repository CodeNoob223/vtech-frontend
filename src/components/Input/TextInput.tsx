import { useEffect, useState } from "react"

export default function TextInput({id, type, name, placeholder, value, myStyles, error, handleChange, toggleType} : AppTextInput) : JSX.Element {
  const [focus, setFocus] = useState<string>(`${error ? "bg-error" : "bg-secondary"}`);
  const [inputError, setInputError] = useState<string>(error as string);
  const [inputType, setInputType] = useState<string>(type);

  useEffect(() => {
    if (error) {
      setInputError(error as string);
    } else {
      setInputError("");
    }
  }, [error]);

  const toggleVisible = () => {
    setInputType(inputType === "text" ? "password" : "text");
  }

  return(
    <div className={`relative text-white border-gradient w-[80vw] sm:w-[400px] h-[40px] rounded-md ${focus} ${myStyles}`}>
      <input
        id={id}
        type={inputType} 
        className={`bg-black px-4 py-2`} 
        name={name}
        placeholder={placeholder}
        value={value} 
        onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
          handleChange(e);
        }}
        aria-autocomplete="list"
        autoComplete={inputType == "password" ? "new-password" : "on"}
        onFocus={() => {setFocus("bg-primary")}}
        onBlur={(e) => {if (e.target.value == "") setFocus("bg-secondary")}}
      />
      {(focus != "bg-secondary") && <span className="absolute left-4 top-[-10px] px-1.5 bg-black">
        <p className={`${focus == "bg-primary" ? "text-primary" : "text-error"} font-bold text-[14px]`}>
          {placeholder}
        </p>
      </span>}
      {toggleType && 
        <span 
          className={`absolute medium-icon right-[16px] top-[8px] cursor-pointer ${(inputType == "password") ? "icon-Visibility text-secondary" : "icon-Visibility-off text-primary"}`}
          onClick={() => {toggleVisible()}}
        ></span>}
      {inputError && <span className="text-error absolute left-4 top-10 font-attribute">{inputError}</span>}
    </div>
  )
}