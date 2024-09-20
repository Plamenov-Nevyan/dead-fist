import { createContext, useState } from "react";

const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <authContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </authContext.Provider>
  );
};

export { authContext, AuthProvider };
