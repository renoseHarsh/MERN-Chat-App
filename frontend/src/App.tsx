import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useUserContext } from "./context/UserContext";
import Home from "./Home";

export default function App() {
  const { user } = useUserContext();

  const router = createBrowserRouter([
    {
      path: "/",
      element: user ? <Home /> : <Navigate to="/login" replace />,
    },
    {
      path: "/signup",
      element: !user ? <SignUpPage /> : <Navigate to="/" replace />,
    },
    {
      path: "/login",
      element: !user ? <LoginPage /> : <Navigate to="/" replace />,
    },
  ]);

  return (
    <div className="flex h-screen w-screen bg-indigo-950">
      <RouterProvider router={router} />
    </div>
  );
}
