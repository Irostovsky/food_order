import { createContext, useState } from "react";

const UserProgressContext = createContext({
  progress: "", // cart, checkout
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
});

export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState("");

  const userProgressContext = {
    progress: userProgress,
    showCart: () => {
      setUserProgress("cart");
    },
    hideCart: () => setUserProgress(""),
    showCheckout: () => setUserProgress("checkout"),
    hideCheckout: () => setUserProgress(""),
  };

  return (
    <UserProgressContext.Provider value={userProgressContext}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;
