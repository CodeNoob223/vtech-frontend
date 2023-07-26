type Error = {
  error: string | undefined,
  handleClick: React.MouseEventHandler<HTMLImageElement> | undefined
}

export default function ErrorModal({error, handleClick} : Error) : JSX.Element {
  return(
    <div className="absolute rounded-full flex px-4 py-2 top-[-60px] w-full bg-error text-white">
      {error}
      <img 
        onClick={handleClick}
        className="ml-auto" 
        src="/icons/close-icon.svg" 
        alt="close icon"
      />
      
    </div>
  )
}