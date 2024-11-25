export interface ApiClientParams<T> {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: T;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface ApiResponse {
  message: string;
  status: number;
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
}

export interface User {
  fullName: string;
  email: string;
  online?: boolean;
}

export interface Conversation {
  conversationId: string;
  reciever: User;
}

export interface Conversations {
  conversations: Conversation[];
}

export interface ConversationEmptyId {
  conversationId?: string;
  reciever: User;
}

export interface UserSearchData {
  users: ConversationEmptyId[];
}

export interface MessageData {
  isSender: boolean;
  content: string;
}
