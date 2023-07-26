import { createContext } from "react";

type AppUserContext = {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>> | undefined
}

export const UserContext = createContext<AppUserContext>({ user: null, setUser: undefined });