import { Conversation } from "../api/types";
import Header from "./Header";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

interface RightProps {
  conversation: Conversation;
}

export default function Right({ conversation }: RightProps) {
  return (
    <div className="flex flex-[3] flex-col">
      <Header conversation={conversation} />
      <Messages conversationId={conversation.conversationId} />
      <MessageInput conversationId={conversation.conversationId} />
    </div>
  );
}
