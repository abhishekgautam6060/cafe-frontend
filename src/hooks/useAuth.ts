import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // You can decode token later if needed
      setUser({ token });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  // ✅ ADD THIS FUNCTION
  const signOut = () => {
    localStorage.removeItem("token"); // remove JWT
    setUser(null); // clear user
    window.location.href = "/auth"; // redirect
  };

  return { user, loading, signOut };
}
