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
                <div className="w-16 rounded-full overflow-hidden bg-base-200">
                    <img
                        src="../../avatar.png"
                        alt="Generic User Avatar"
                        className="w-full h-full object-cover"
                    />
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
