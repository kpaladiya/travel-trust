export interface ConversationSummary {
  id: string;
  participantName: string;
  avatar: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderName: string;
  body: string;
  createdAt: string;
  sentByCurrentUser: boolean;
  isRead: boolean;
}
