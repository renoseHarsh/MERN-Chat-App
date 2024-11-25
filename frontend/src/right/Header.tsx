import { Conversation } from "../api/types";

interface HeaderProps {
  conversation: Conversation | undefined;
}

export default function Header({ conversation }: HeaderProps) {
  return (
    <div className="flex h-[13%] min-h-20 items-center bg-slate-900 p-3">
      <div
        className={`avatar ${conversation?.reciever.online ? "online" : "offline"} mr-5`}
      >
        <div className="w-20 rounded-full">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <div className="flex flex-col">
        <h1>{conversation?.reciever.fullName}</h1>
        <span className="text-gray-500 opacity-70">
          {conversation?.reciever.email}
        </span>
      </div>
    </div>
  );
}
