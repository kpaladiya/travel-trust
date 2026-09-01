import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ChatMessage, ConversationSummary } from '../types/chat';

const CHAT_STORAGE_KEY = 'chat_state';

interface ChatState {
  conversations: ConversationSummary[];
  messages: ChatMessage[];
}

const defaultState: ChatState = {
  conversations: [
    {
      id: 'conv_john',
      participantName: 'John Sharma',
      avatar: 'JS',
      lastMessage: 'My car is silver Mercedes. License plate: FR-123-ABC',
      updatedAt: '2024-04-20T10:40:00.000Z',
      unreadCount: 1,
    },
    {
      id: 'conv_priya',
      participantName: 'Priya Patel',
      avatar: 'PP',
      lastMessage: 'Please complete the payment before departure.',
      updatedAt: '2024-04-19T18:15:00.000Z',
      unreadCount: 2,
    },
    {
      id: 'conv_amit',
      participantName: 'Amit Kumar',
      avatar: 'AK',
      lastMessage: 'Can you confirm the pickup time?',
      updatedAt: '2024-04-18T14:10:00.000Z',
      unreadCount: 0,
    },
  ],
  messages: [
    {
      id: 'msg_john_1',
      conversationId: 'conv_john',
      senderName: 'John Sharma',
      body: 'Hi! I will pick you up at the airport. See you soon!',
      createdAt: '2024-04-20T10:30:00.000Z',
      sentByCurrentUser: false,
      isRead: true,
    },
    {
      id: 'msg_john_2',
      conversationId: 'conv_john',
      senderName: 'You',
      body: 'Great! Thanks for the confirmation.',
      createdAt: '2024-04-20T10:35:00.000Z',
      sentByCurrentUser: true,
      isRead: true,
    },
    {
      id: 'msg_john_3',
      conversationId: 'conv_john',
      senderName: 'John Sharma',
      body: 'My car is silver Mercedes. License plate: FR-123-ABC',
      createdAt: '2024-04-20T10:40:00.000Z',
      sentByCurrentUser: false,
      isRead: false,
    },
    {
      id: 'msg_priya_1',
      conversationId: 'conv_priya',
      senderName: 'Priya Patel',
      body: 'Thanks for choosing my ride.',
      createdAt: '2024-04-19T17:45:00.000Z',
      sentByCurrentUser: false,
      isRead: false,
    },
    {
      id: 'msg_priya_2',
      conversationId: 'conv_priya',
      senderName: 'Priya Patel',
      body: 'Please complete the payment before departure.',
      createdAt: '2024-04-19T18:15:00.000Z',
      sentByCurrentUser: false,
      isRead: false,
    },
    {
      id: 'msg_amit_1',
      conversationId: 'conv_amit',
      senderName: 'Amit Kumar',
      body: 'Can you confirm the pickup time?',
      createdAt: '2024-04-18T14:10:00.000Z',
      sentByCurrentUser: false,
      isRead: true,
    },
  ],
};

async function readState(): Promise<ChatState> {
  const raw = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
  if (!raw) {
    return defaultState;
  }

  try {
    return JSON.parse(raw) as ChatState;
  } catch (error) {
    console.error('Failed to parse chat state:', error);
    return defaultState;
  }
}

async function writeState(state: ChatState) {
  await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state));
}

export async function getConversations(): Promise<ConversationSummary[]> {
  const state = await readState();
  return [...state.conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getConversationById(conversationId: string): Promise<ConversationSummary | null> {
  const state = await readState();
  return state.conversations.find((item) => item.id === conversationId) ?? null;
}

export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  const state = await readState();
  return state.messages
    .filter((message) => message.conversationId === conversationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function markConversationRead(conversationId: string) {
  const state = await readState();
  const nextState: ChatState = {
    conversations: state.conversations.map((conversation) =>
      conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
    ),
    messages: state.messages.map((message) =>
      message.conversationId === conversationId ? { ...message, isRead: true } : message
    ),
  };
  await writeState(nextState);
}

export async function sendConversationMessage(conversationId: string, body: string): Promise<ChatMessage> {
  const state = await readState();
  const timestamp = new Date().toISOString();
  const message: ChatMessage = {
    id: `msg_${Date.now()}`,
    conversationId,
    senderName: 'You',
    body,
    createdAt: timestamp,
    sentByCurrentUser: true,
    isRead: true,
  };

  const existingConversation = state.conversations.find((conversation) => conversation.id === conversationId);
  if (!existingConversation) {
    throw new Error('Conversation not found');
  }

  const nextState: ChatState = {
    conversations: state.conversations.map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, lastMessage: body, updatedAt: timestamp, unreadCount: 0 }
        : conversation
    ),
    messages: [...state.messages, message],
  };

  await writeState(nextState);
  return message;
}

export async function getOrCreateConversation(participantName: string): Promise<ConversationSummary> {
  const state = await readState();
  const existingConversation = state.conversations.find((conversation) => conversation.participantName === participantName);
  if (existingConversation) {
    return existingConversation;
  }

  const avatar = participantName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? 'U')
    .join('');

  const timestamp = new Date().toISOString();
  const conversation: ConversationSummary = {
    id: `conv_${Date.now()}`,
    participantName,
    avatar: avatar || 'U',
    lastMessage: 'Conversation started.',
    updatedAt: timestamp,
    unreadCount: 0,
  };

  const nextState: ChatState = {
    conversations: [conversation, ...state.conversations],
    messages: [
      ...state.messages,
      {
        id: `msg_${Date.now()}_welcome`,
        conversationId: conversation.id,
        senderName: participantName,
        body: 'Hi! You can message me here about the ride.',
        createdAt: timestamp,
        sentByCurrentUser: false,
        isRead: true,
      },
    ],
  };

  await writeState(nextState);
  return conversation;
}
