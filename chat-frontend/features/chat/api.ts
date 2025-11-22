import api from "@/lib/axios";

// Message types
interface Message {
  id: number;
  text: string;
  senderId: number;
  conversationId: string;
  sender: {
    id: number;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: string;
  participants: Array<{
    id: number;
    userId: number;
    conversationId: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
  }>;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

// Create a new conversation
export async function createConversation(participantIds: number[]): Promise<Conversation> {
  const res = await api.post("/chat/conversations", { participantIds });
  return res.data;
}

// Get all conversations for the current user
export async function getConversations(): Promise<Conversation[]> {
  const res = await api.get("/chat/conversations");
  return res.data;
}

// Get messages from a specific conversation
export async function getMessages(conversationId: string): Promise<Message[]> {
  const res = await api.get(`/chat/messages/${conversationId}`);
  return res.data;
}

export async function getUsers(){
  const res = await api.get("/user");
  return res.data;
}