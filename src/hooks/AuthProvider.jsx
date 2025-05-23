import { createContext, useContext, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken, removeValue] = useLocalStorage("token");

  // call this function when you want to authenticate the user
  const setAuthenticateUser = (data) => {
    setToken(data);
    console.log("setAuthenticateUser", data)
  };

  // call this function to sign out logged in user
  const removeToken = () => {
    setToken(null);
    removeValue();
    console.log("removeToken")
  };
  const value = useMemo(
    () => ({
        token,
        setAuthenticateUser,
        removeToken,
    }),
    [token]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};