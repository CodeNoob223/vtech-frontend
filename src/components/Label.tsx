type AppLabel = {
  id: string | undefined,
  forName: string | undefined,
  placeholder: string | undefined,
  content: string | undefined,
  myStyles: string | undefined
}

export default function Label({id, forName, placeholder, content, myStyles} : AppLabel) : JSX.Element {
  return(
    <label
      id={id} 
      className={`block bold mg-bottom3 mg-top3 ${myStyles}`} 
      htmlFor={forName}
      placeholder={placeholder}  
    >
      {content}
    </label>
  )
}