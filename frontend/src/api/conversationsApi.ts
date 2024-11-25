import { apiClient } from "./apiClient";
import { ApiClientParams, Conversation, MessageData } from "./types";

const conversationsApi = "/conversations";

export const fetchUserConversations = async () => {
  const options: ApiClientParams<unknown> = {
    url: `${conversationsApi}`,
    method: "GET",
  };
  return await apiClient<unknown, { conversations: Conversation[] }>(options);
};

export const createConversation = async (email: string) => {
  const options: ApiClientParams<{ email: string }> = {
    url: `${conversationsApi}`,
    method: "POST",
    data: { email },
  };
  return await apiClient<{ email: string }, { id: string }>(options);
};

export const sendMessage = async (conversationId: string, content: string) => {
  const options: ApiClientParams<{ content: string }> = {
    url: `${conversationsApi}/${conversationId}/messages`,
    method: "POST",
    data: { content },
  };
  return await apiClient<{ content: string }, unknown>(options);
};

export const fetchMessagesInConversation = async (conversationId: string) => {
  const options: ApiClientParams<unknown> = {
    url: `${conversationsApi}/${conversationId}/messages`,
    method: "GET",
  };
  return await apiClient<unknown, { data: MessageData[] }>(options);
};
