import { useEffect, useRef, useState } from "react";

export default function FileInput({ id, accept, name, myStyles, error, handleChange, inputTitle }: AppFileInput): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [inputError, setInputError] = useState<string>(error as string);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      setInputError(error as string);
    } else {
      setInputError("");
    }
  }, [error]);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return;
    }
    const img = document.createElement('img');
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    img.onload = function handleLoad() {
      handleChange(selectedFile, img.width, img.height, objectUrl);
    };

    img.src = objectUrl;

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile])

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  }

  return (
    <div className={`relative px-4 flex items-center text-white w-max max-w-[400px] mx-auto h-[60px] ${myStyles}`}
      onClick={() => inputRef.current?.click()}
    >
      {inputError && <span className="absolute text-error top-[-20px]">{inputError}</span>}
      <input
        id={id}
        type="file"
        accept={accept}
        className={`custom-file-input w-[280px] text-xs cursor-pointer pointer-events-none`}
        name={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onSelectFile(e);
        }}
        ref={inputRef}
      />
      <span className="absolute font-bold left-[80px] top-1">{inputTitle}</span>
      {selectedFile && <img className="absolute pointer-events-none w-[56px] h-[56px] rounded-md object-cover" src={preview} alt="avatar preview" />}
    </div>
  )
}