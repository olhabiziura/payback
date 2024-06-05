
import { useState } from "react";

// Define a custom hook to encapsulate the authentication state
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return { isAuthenticated, setIsAuthenticated };
};
