import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getConversations } from '../../../src/services/chat';
import type { ConversationSummary } from '../../../src/types/chat';

export default function ChatScreen() {
  const router = useRouter();
  const [conversations, setConversations] = React.useState<ConversationSummary[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      void getConversations().then((items) => {
        if (active) {
          setConversations(items);
        }
      });

      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
        </View>

        <View style={styles.content}>
          {conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationItem}
              onPress={() => router.push(`/(app)/(chat)/${conversation.id}`)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{conversation.avatar}</Text>
              </View>
              <View style={styles.conversationInfo}>
                <Text style={styles.conversationName}>{conversation.participantName}</Text>
                <Text style={styles.conversationMessage} numberOfLines={1}>
                  {conversation.lastMessage}
                </Text>
              </View>
              <View style={styles.conversationRight}>
                <Text style={styles.timestamp}>
                  {new Date(conversation.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </Text>
                {conversation.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#000' },
  content: { paddingHorizontal: 16, paddingVertical: 12 },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  conversationInfo: { flex: 1 },
  conversationName: { fontSize: 14, fontWeight: '600', color: '#000' },
  conversationMessage: { fontSize: 12, color: '#666', marginTop: 4 },
  conversationRight: { alignItems: 'flex-end' },
  timestamp: { fontSize: 12, color: '#999' },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  unreadText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
