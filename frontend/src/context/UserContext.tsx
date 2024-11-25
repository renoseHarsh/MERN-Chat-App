import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserDetails } from "../api/userApi";

import { UserData } from "../api/types";

interface UserContextType {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

type UserProviderProps = {
  children: ReactNode;
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUser = async () => {
      const { status, data } = await getUserDetails();
      setLoading(false);
      if (status == 200) {
        setUser(data);
      }
    };
    getUser();
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex h-screen w-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <UserContext.Provider value={{ user, setUser }}>
          {children}
        </UserContext.Provider>
      )}
    </>
  );
};

export default UserProvider;
