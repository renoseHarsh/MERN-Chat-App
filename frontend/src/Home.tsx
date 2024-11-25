import { useState } from "react";
import { Conversation } from "./api/types";
import Left from "./left/Left";
import Right from "./right/Right";

export default function Home() {
  const [conversation, setConversation] = useState<Conversation>();
  return (
    <>
      <Left setConversation={setConversation} />
      <>{conversation && <Right conversation={conversation} />}</>
    </>
  );
}
