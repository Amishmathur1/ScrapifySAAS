import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getChatCompletion } from '@/lib/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContextType {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await getChatCompletion([
        { role: 'system', content: 'You are a helpful assistant for a workflow automation website. Keep your responses concise and focused on helping users with their workflow tasks.' },
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content }
      ]);

      setMessages(prev => [...prev, { role: 'assistant', content: response || 'Sorry, I could not process your request.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, isOpen, isLoading, sendMessage, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 