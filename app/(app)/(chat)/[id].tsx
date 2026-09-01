import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { getConversationById, getConversationMessages, markConversationRead, sendConversationMessage } from '../../../src/services/chat';
import type { ChatMessage, ConversationSummary } from '../../../src/types/chat';

export default function ChatConversationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [conversation, setConversation] = React.useState<ConversationSummary | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [draft, setDraft] = React.useState('');

  const loadConversation = React.useCallback(() => {
    if (!id) {
      return;
    }

    void Promise.all([getConversationById(id), getConversationMessages(id)]).then(([conversationItem, messageItems]) => {
      setConversation(conversationItem);
      setMessages(messageItems);
    });
  }, [id]);

  useFocusEffect(
    React.useCallback(() => {
      if (!id) {
        return () => undefined;
      }

      void markConversationRead(id).then(() => {
        loadConversation();
      });

      return () => undefined;
    }, [id, loadConversation])
  );

  const handleSend = async () => {
    if (!id || !draft.trim()) {
      return;
    }

    await sendConversationMessage(id, draft.trim());
    setDraft('');
    loadConversation();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{conversation?.participantName ?? 'Conversation'}</Text>
            <Text style={styles.subtitle}>Ride coordination chat</Text>
          </View>
        </View>

        <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sentByCurrentUser ? styles.messageBubbleCurrentUser : styles.messageBubbleOtherUser,
              ]}
            >
              <Text style={[styles.messageText, message.sentByCurrentUser && styles.messageTextCurrentUser]}>
                {message.body}
              </Text>
              <Text style={[styles.messageTime, message.sentByCurrentUser && styles.messageTimeCurrentUser]}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            style={styles.composerInput}
            value={draft}
            onChangeText={setDraft}
            placeholder="Write a message"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { marginRight: 10 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { marginTop: 2, fontSize: 12, color: '#6B7280' },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16, gap: 10 },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageBubbleCurrentUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  messageBubbleOtherUser: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: { fontSize: 14, lineHeight: 20, color: '#111827' },
  messageTextCurrentUser: { color: '#fff' },
  messageTime: { marginTop: 6, fontSize: 11, color: '#6B7280' },
  messageTimeCurrentUser: { color: '#DBEAFE' },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 10,
  },
  composerInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
