import { BiLogOut } from "react-icons/bi";
import { useUserContext } from "../context/UserContext";
import { logoutUser } from "../api/authApi";

export default function LogoutPanel() {
  const { setUser } = useUserContext();
  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };
  return (
    <div className="flex w-14 flex-col items-center justify-end bg-indigo-950">
      <button className="mb-4" onClick={handleLogout}>
        <BiLogOut className="rounded-full pr-2 text-5xl text-white duration-300 hover:bg-gray-600" />
      </button>
    </div>
  );
}
