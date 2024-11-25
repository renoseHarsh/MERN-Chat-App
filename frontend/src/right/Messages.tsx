import { useEffect, useRef, useState } from "react";
import { MessageData } from "../api/types";
import Message from "./Message";
import { fetchMessagesInConversation } from "../api/conversationsApi";
import { useSocketContext } from "../context/SocketContext";

interface MessagesProps {
  conversationId: string;
}

export default function Messages({ conversationId }: MessagesProps) {
  const [messages, setMessages] = useState<MessageData[]>();
  const { socket } = useSocketContext();

  const endMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endMessageRef.current?.scrollIntoView();
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await fetchMessagesInConversation(conversationId);
      setMessages(data.data);
    };
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (data: MessageData) => {
      setMessages([...messages!, data]);
    });
    return () => {
      socket.off("newMessage");
    };
  });

  return (
    <div className="m-2 flex-grow overflow-y-auto px-2">
      {messages &&
        messages.map((message, index) => (
          <Message key={index} end={message.isSender} value={message.content} />
        ))}
      <div ref={endMessageRef}></div>
    </div>
  );
}
