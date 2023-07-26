import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  type errorObject = {
    statusText: string,
    message: string
  };
  const error:errorObject = useRouteError() as errorObject;
  console.error(error);

  return (
    <div className="w-screen h-screen bg-black">
      <div id="error-page" className="center text-white">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}