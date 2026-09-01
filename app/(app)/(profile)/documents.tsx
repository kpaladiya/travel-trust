import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { getDocuments, submitDocument } from '../../../src/services/profile-tools';
import type { UserDocument } from '../../../src/types/profile-tools';

const statusColors = {
  missing: '#9CA3AF',
  uploaded: '#2563EB',
  under_review: '#F59E0B',
  verified: '#10B981',
};

export default function DocumentsScreen() {
  const router = useRouter();
  const [documents, setDocuments] = React.useState<UserDocument[]>([]);
  const [documentType, setDocumentType] = React.useState('');
  const [documentNumber, setDocumentNumber] = React.useState('');
  const [country, setCountry] = React.useState('');

  const loadDocuments = React.useCallback(() => {
    void getDocuments().then((items) => setDocuments(items));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadDocuments();
      return () => undefined;
    }, [loadDocuments])
  );

  const handleSubmit = async () => {
    if (!documentType.trim() || !documentNumber.trim() || !country.trim()) {
      Alert.alert('Missing details', 'Enter document type, number, and country.');
      return;
    }

    await submitDocument({
      documentType: documentType.trim(),
      documentNumber: documentNumber.trim(),
      country: country.trim(),
    });
    setDocumentType('');
    setDocumentNumber('');
    setCountry('');
    loadDocuments();
    Alert.alert('Document submitted', 'Your document is now pending review.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>My Documents</Text>
        </View>

        <View style={styles.section}>
          {documents.map((document) => (
            <View key={document.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.cardTitle}>{document.documentType}</Text>
                  <Text style={styles.cardMeta}>
                    {document.country} · {document.documentNumber || 'No number yet'}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: `${statusColors[document.status]}18` }]}>
                  <Text style={[styles.badgeText, { color: statusColors[document.status] }]}>
                    {document.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Submit or replace a document</Text>
          <Text style={styles.label}>Document type</Text>
          <TextInput style={styles.input} value={documentType} onChangeText={setDocumentType} placeholder="Passport" />
          <Text style={styles.label}>Document number</Text>
          <TextInput style={styles.input} value={documentNumber} onChangeText={setDocumentNumber} placeholder="P1234567" />
          <Text style={styles.label}>Issuing country</Text>
          <TextInput style={styles.input} value={country} onChangeText={setCountry} placeholder="India" />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Document</Text>
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  cardMeta: { marginTop: 4, fontSize: 12, color: '#6B7280' },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  formSection: { backgroundColor: '#fff', padding: 16, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
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
  submitButton: { marginTop: 20, backgroundColor: '#007AFF', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
