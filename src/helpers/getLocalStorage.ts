type tokenOption = "access" | "refresh";

export default async function getToken(option : tokenOption = "access") {
  if (option === "access") {
    const accessToken :string = await JSON.parse(localStorage.getItem("token") as string);
    return accessToken || "";
  }
  else if (option === "refresh") {
    const refreshToken :string = await JSON.parse(localStorage.getItem("refreshToken") as string);
    return refreshToken || "";
  }
}