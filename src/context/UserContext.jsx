import { createContext, useContext, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { server } from "../main"; // Make sure this is: export const server = "http://localhost:5000";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true); // App-level loading state

  // 🔐 LOGIN FUNCTION
  async function loginUser(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });
      toast.success(data.message);
      localStorage.setItem("verifyToken", data.verifyToken);
      navigate("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // ✅ OTP VERIFICATION FUNCTION
  async function verifyUser(otp, navigate, fetchChats) {
    const verifyToken = localStorage.getItem("verifyToken");
    setBtnLoading(true);

    if (!verifyToken) {
      toast.error("Please provide token");
      setBtnLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        verifyToken,
      });
      toast.success(data.message);
      localStorage.clear();
      localStorage.setItem("token", data.token);
      setUser(data.user);
      fetchChats();
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // ✅ FETCH LOGGED-IN USER
  async function fetchUser() {
    console.log("Fetching user...");
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      console.log("User fetched:", data);
      setIsAuth(true);
      setUser(data);
    } catch (error) {
      console.log("Fetch user failed:", error);
      setIsAuth(false);
    } finally {
      console.log("Setting loading to false");
      setLoading(false); // ✅ This should always run
    }
  }

  const logoutHandler = (navigate) => {
    localStorage.clear();
    toast.success("logged out");
    setIsAuth(false);
    setUser([]);
    navigate("/login");
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        loginUser,
        verifyUser,
        user,
        btnLoading,
        isAuth,
        setIsAuth,
        loading,
        logoutHandler,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

// ✅ Hook for components
export const useUserData = () => useContext(UserContext);