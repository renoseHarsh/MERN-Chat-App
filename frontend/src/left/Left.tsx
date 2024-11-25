import { useEffect, useState } from "react";
import LogoutPanel from "./LogoutPanel";
import Search from "./Search";
import Users from "./User";
import { Conversation, ConversationEmptyId } from "../api/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { fetchUserConversations } from "../api/conversationsApi";
import { getUsersBySearch } from "../api/userApi";
import { useSocketContext } from "../context/SocketContext";

export interface Input {
  value: string;
}

export interface props {
  setConversation: (
    value: React.SetStateAction<Conversation | undefined>,
  ) => void;
}

export default function Left({ setConversation }: props) {
  const [users, setUsers] = useState<ConversationEmptyId[]>([]);
  const { register, handleSubmit, watch } = useForm<Input>();
  const { socket } = useSocketContext();
  const [loading, setLoading] = useState(true);
  const value = watch("value");

  const onSubmit: SubmitHandler<Input> = async (data) => {
    setLoading(true);
    try {
      const response = await getUsersBySearch(data.value);
      if (response.status === 200) setUsers(response.users);
      setLoading(false);
    } catch {
      console.error("Search failed");
    }
  };

  useEffect(() => {
    if (!value) {
      setLoading(true);
      const fetchUsers = async () => {
        const data = await fetchUserConversations();
        setUsers(data.conversations);
        setLoading(false);
      };
      fetchUsers();
    }
  }, [value]);

  useEffect(() => {
    const handleOnlineUser = ({
      conversation: conversation,
      trueOnline,
    }: {
      conversation: Conversation;
      trueOnline: boolean;
    }) => {
      setConversation((prev) => {
        if (!prev) return;
        if (prev.conversationId !== conversation.conversationId) return prev;
        return { ...prev, reciever: { ...prev.reciever, online: trueOnline } };
      });
      let found = false;
      setUsers((prevs) => {
        prevs.map((prev) => {
          if (prev.conversationId === conversation.conversationId) {
            prev.reciever.online = trueOnline;
            found = true;
          }
          return prev;
        });
        return [...prevs];
      });
      if (!found)
        fetchUserConversations().then((data) => setUsers(data.conversations));
    };

    if (socket) socket.on("onlineUser", handleOnlineUser);

    return () => {
      if (socket) socket.off("onlineUser");
    };
  }, [socket]);

  return (
    <div className="flex flex-[1] bg-black text-white">
      <LogoutPanel />
      <div className="text-5 mt-7 flex w-full flex-col items-center">
        <h1 className="text-3xl font-bold">Chats</h1>
        <Search
          register={register}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
        />
        <>
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : (
            <div className="mb-4 mt-4 w-full overflow-y-auto px-2">
              {users.map((conversation, index) => (
                <Users
                  setUser={setUsers}
                  key={index}
                  {...conversation.reciever}
                  conversationId={conversation.conversationId}
                  setConversation={setConversation}
                />
              ))}
            </div>
          )}
        </>
      </div>
    </div>
  );
}
