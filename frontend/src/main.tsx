import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import UserProvider from "./context/UserContext.tsx";
import SocketProvider from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </UserProvider>,
);
