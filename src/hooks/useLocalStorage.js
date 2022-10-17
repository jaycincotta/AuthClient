import { useState } from "react";
import AppSettings from "../AppSettings";

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const fullKey = AppSettings.AppName + "." + key;
      const item = window.localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      const denullified = value === null ? initialValue : valueToStore;
      setStoredValue(denullified);
      const fullKey = AppSettings.AppName + "." + key;

      // If value undefined, remove item, otherwise, update it
      if (value === undefined) {
        window.localStorage.removeItem(fullKey);
      } else {
        window.localStorage.setItem(fullKey, JSON.stringify(denullified));
      }
    } catch (e) {
      console.log("ERROR in useLocalStorage.setVaue", e);
    }
  };

  return [storedValue, setValue];
}
