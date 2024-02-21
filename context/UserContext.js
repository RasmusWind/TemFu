import { createContext, useContext, useState } from "react";
const UserContext = createContext({
  user: undefined,
  setUser: () => {},
  token: undefined,
  setToken: () => {},
});

export function useUserContext() {
  return useContext(UserContext);
}

export function UserDataProvider({ children }) {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser,
        token: token,
        setToken: setToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
