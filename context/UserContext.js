import { createContext, useContext, useState } from "react";
import { session_client } from "../client";
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
  const ws_url = `ws://${session_client.URL}/ws/socket-server/`;
  const ws = new WebSocket(ws_url);

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser,
        token: token,
        setToken: setToken,
        ws: ws,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
