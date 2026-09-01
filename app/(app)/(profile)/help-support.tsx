import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { getSupportTickets, submitSupportTicket } from '../../../src/services/profile-tools';
import type { SupportTicket } from '../../../src/types/profile-tools';

const faqs = [
  {
    question: 'How does TravelTrust review riders and travelers?',
    answer: 'Requests are reviewed through consent records, trust checks, and your admin dashboard before being treated as trusted.',
  },
  {
    question: 'How do I request a data export or deletion?',
    answer: 'Use the Compliance Center from your profile to request exports or deletion actions.',
  },
  {
    question: 'What should I do if a booking looks suspicious?',
    answer: 'Open the trust dashboard or admin console and review the profile, trip details, and history before approval.',
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const [tickets, setTickets] = React.useState<SupportTicket[]>([]);
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');

  const loadTickets = React.useCallback(() => {
    void getSupportTickets().then((items) => setTickets(items));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadTickets();
      return () => undefined;
    }, [loadTickets])
  );

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Missing details', 'Enter a subject and message for support.');
      return;
    }

    await submitSupportTicket({
      subject: subject.trim(),
      message: message.trim(),
    });
    setSubject('');
    setMessage('');
    loadTickets();
    Alert.alert('Support request sent', 'Your support ticket has been added.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Help & Support</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.linkCard} onPress={() => router.push('/(app)/(profile)/trust-dashboard')}>
            <Text style={styles.linkTitle}>Open Trust Dashboard</Text>
            <Text style={styles.linkMeta}>Review platform trust and flagged activity.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkCard} onPress={() => router.push('/(app)/(profile)/compliance-center')}>
            <Text style={styles.linkTitle}>Open Compliance Center</Text>
            <Text style={styles.linkMeta}>Manage consent, exports, deletion, and legal documents.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQs</Text>
          {faqs.map((item) => (
            <View key={item.question} style={styles.card}>
              <Text style={styles.cardTitle}>{item.question}</Text>
              <Text style={styles.cardBody}>{item.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Open support tickets</Text>
          {tickets.map((ticket) => (
            <View key={ticket.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{ticket.subject}</Text>
                <Text style={styles.ticketStatus}>{ticket.status.replace('_', ' ')}</Text>
              </View>
              <Text style={styles.cardBody}>{ticket.message}</Text>
            </View>
          ))}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Create support request</Text>
          <Text style={styles.label}>Subject</Text>
          <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="Payment issue" />
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={message}
            onChangeText={setMessage}
            placeholder="Describe the issue and what you need help with."
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Ticket</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  backButton: { marginRight: 10 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  section: { padding: 16, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  linkCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  linkTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  linkMeta: { marginTop: 4, fontSize: 12, color: '#6B7280' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  cardBody: { marginTop: 6, fontSize: 13, lineHeight: 20, color: '#4B5563' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  ticketStatus: { fontSize: 11, fontWeight: '700', color: '#007AFF', textTransform: 'capitalize' },
  formSection: { backgroundColor: '#fff', padding: 16, marginTop: 8 },
  label: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  multilineInput: { minHeight: 96, textAlignVertical: 'top' },
  submitButton: { marginTop: 20, backgroundColor: '#007AFF', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
