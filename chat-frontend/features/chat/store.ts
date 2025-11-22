import { create } from "zustand";

interface Message {
  id: number;
  content: string;
  senderId: number;
  conversationId: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  participants: {
    userId: number;
    isSelf: boolean;
    user: {
      id: number;
      username: string;
    };
  }[];
  lastMessage?: Message;
  messages?: Message[];
}

interface ChatState {
  messages: Message[];
  chats: Conversation[];
  activeChat: string | null;
  isLoading: boolean;

  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, msg: Message) => void;
  setChats: (chats: Conversation[]) => void;
  setActiveChat: (id: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearChatState: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  chats: [],
  activeChat: null,
  isLoading: false,

  setMessages: (conversationId, messages) =>
    set((s) => {
      const updatedChats = s.chats.map((chat) =>
        chat.id === conversationId ? { ...chat, messages } : chat
      );
      return { chats: updatedChats, messages };
    }),

  addMessage: (conversationId, msg) =>
    set((s) => ({
      chats: s.chats.map((chat) =>
        chat.id === conversationId
          ? {
              ...chat,
              messages: [...(chat.messages ?? []), msg],
              lastMessage: msg,
            }
          : chat
      ),
    })),

  setChats: (chats) => set({ chats }),

  setActiveChat: (id) => set({ activeChat: id }),

  setIsLoading: (isLoading) => set({ isLoading }),

  clearChatState: () =>
    set({
      messages: [],
      chats: [],
      activeChat: null,
      isLoading: false,
    }),
}));
