import { useState } from "react";
import DataStore from "../utils/DataStore";

export const useLocalStorage = (keyName, defaultValue) => {
    const { getItem, setItem, removeItem } = DataStore();
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = getItem(keyName);
      if (value) {
        return value;
      } else {
        setItem(keyName, defaultValue);
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue) => {
    try {
      setItem(keyName, newValue);
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };
  
  const removeValue = () => {
    try {
      removeItem(keyName);
    } catch (err) {
      console.log(err);
    }
  };
  return [storedValue, setValue, removeValue];
};