import { create } from "zustand";

interface Message {
  id: number;
  content: string;
  senderId: number;
  conversationId: string;
  createdAt: string;
}

interface Participant {
  userId: number;
  isSelf: boolean;
  user: {
    id: number;
    username: string;
  };
}

interface Conversation {
  id: string;
  participants: Participant[];
  lastMessage?: Message;
  messages: Message[];
}

interface ChatState {
  chats: Conversation[];
  activeChat: Conversation | null;
  isLoading: boolean;

  setChats: (chats: Conversation[]) => void;
  setActiveChat: (conversation: Conversation | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (msg: Message) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearChatState: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChat: null,
  isLoading: false,

  setChats: (chats) => set({ chats }),

  setActiveChat: (conversation) => set({ activeChat: conversation }),

  setMessages: (conversationId, messages) =>
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === conversationId ? { ...c, messages } : c
      ),
      activeChat:
        s.activeChat?.id === conversationId
          ? { ...s.activeChat, messages }
          : s.activeChat,
    })),

  addMessage: (msg) =>
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === msg.conversationId
          ? {
              ...c,
              messages: [...c.messages, msg],
              lastMessage: msg,
            }
          : c
      ),
      activeChat:
        s.activeChat?.id === msg.conversationId
          ? {
              ...s.activeChat,
              messages: [...s.activeChat.messages, msg],
              lastMessage: msg,
            }
          : s.activeChat,
    })),

  setIsLoading: (isLoading) => set({ isLoading }),

  clearChatState: () =>
    set({
      chats: [],
      activeChat: null,
      isLoading: false,
    }),
}));
