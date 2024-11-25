import { createConversation } from "../api/conversationsApi";
import { Conversation, ConversationEmptyId } from "../api/types";

export interface UserProps {
  fullName: string;
  email: string;
  online?: boolean;
  conversationId?: string;
  setConversation: (
    value: React.SetStateAction<Conversation | undefined>,
  ) => void;
  setUser: (value: React.SetStateAction<ConversationEmptyId[]>) => void;
}

export default function Users({
  fullName,
  email,
  online,
  conversationId,
  setConversation,
  setUser,
}: UserProps) {
  const onClick = async () => {
    if (!conversationId) {
      const { id } = await createConversation(email);
      conversationId = id;
      setUser((prev) => {
        prev.map((user) => {
          if (user.reciever.email === email) {
            return { ...user, conversationId: id };
          }
        });
        return [...prev];
      });
    }
    setConversation({ conversationId, reciever: { fullName, email, online } });
  };
  return (
    <>
      <hr className="w-full" />
      <div
        className="my-4 flex w-full cursor-pointer self-start rounded-lg px-4 py-1 text-white hover:bg-indigo-600 hover:transition-colors hover:duration-300 active:scale-95 active:bg-indigo-700 active:transition-transform active:duration-75"
        onClick={onClick}
      >
        <div
          className={`avatar ${online ? "online" : "offline"} mr-4 select-none`}
        >
          <div className="w-16 rounded-full">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
        <div className="flex max-w-[180px] flex-col truncate text-ellipsis">
          <p>{fullName}</p>
          <p className="text-gray-500 opacity-70">{email}</p>
        </div>
      </div>
    </>
  );
}
