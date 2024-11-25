import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUserContext } from "./UserContext";

interface SocketContextType {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

type SocketProviderProps = {
  children: React.ReactNode;
};

const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUserContext();
  useEffect(() => {
    if (user) {
      const socket = io(import.meta.env.MODE == "development" ? "http://0.0.0.0:5002/api" : "/", {
        query: {
          userId: user.id,
        },
      });
      setSocket(socket);
      return () => {
        socket.close();
      };
    } else {
      setSocket(null);
    }
  }, [user]);
  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
