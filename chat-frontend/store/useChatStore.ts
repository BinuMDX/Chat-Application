import { create } from 'zustand';

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: string;
  sender?: {
    id: number;
    username: string;
  };
}

interface Chat {
  userId: number;
  username: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface ChatState {
  messages: Message[];
  chats: Chat[];
  activeChat: Chat | null;
  isLoading: boolean;
  
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chat: Chat | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearChatState: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  chats: [],
  activeChat: null,
  isLoading: false,

  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setChats: (chats) => set({ chats }),

  setActiveChat: (chat) => set({ activeChat: chat }),

  setIsLoading: (isLoading) => set({ isLoading }),

  clearChatState: () =>
    set({
      messages: [],
      chats: [],
      activeChat: null,
      isLoading: false,
    }),
}));
