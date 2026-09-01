import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { addPaymentMethod, getPaymentMethods, removePaymentMethod, setDefaultPaymentMethod } from '../../../src/services/profile-tools';
import type { PaymentMethod } from '../../../src/types/profile-tools';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [methods, setMethods] = React.useState<PaymentMethod[]>([]);
  const [brand, setBrand] = React.useState('');
  const [last4, setLast4] = React.useState('');
  const [expiryMonth, setExpiryMonth] = React.useState('');
  const [expiryYear, setExpiryYear] = React.useState('');
  const [holderName, setHolderName] = React.useState('');

  const loadMethods = React.useCallback(() => {
    void getPaymentMethods().then((items) => setMethods(items));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadMethods();
      return () => undefined;
    }, [loadMethods])
  );

  const handleAddMethod = async () => {
    if (!brand.trim() || !holderName.trim() || !/^\d{4}$/.test(last4) || !expiryMonth.trim() || !expiryYear.trim()) {
      Alert.alert('Missing details', 'Enter card brand, holder name, last 4 digits, and expiry.');
      return;
    }

    await addPaymentMethod({
      brand: brand.trim(),
      last4,
      expiryMonth: expiryMonth.trim(),
      expiryYear: expiryYear.trim(),
      holderName: holderName.trim(),
    });

    setBrand('');
    setLast4('');
    setExpiryMonth('');
    setExpiryYear('');
    setHolderName('');
    loadMethods();
    Alert.alert('Payment method added', 'Your payment method is ready to use.');
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    await setDefaultPaymentMethod(paymentMethodId);
    loadMethods();
  };

  const handleRemove = async (paymentMethodId: string) => {
    await removePaymentMethod(paymentMethodId);
    loadMethods();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Payment Methods</Text>
        </View>

        <View style={styles.section}>
          {methods.map((method) => (
            <View key={method.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.cardTitle}>
                    {method.brand} •••• {method.last4}
                  </Text>
                  <Text style={styles.cardMeta}>
                    {method.holderName} · {method.expiryMonth}/{method.expiryYear}
                  </Text>
                </View>
                {method.isDefault ? (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.cardActions}>
                {!method.isDefault && (
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => handleSetDefault(method.id)}>
                    <Text style={styles.secondaryButtonText}>Set Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.secondaryButton} onPress={() => handleRemove(method.id)}>
                  <Text style={styles.secondaryButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Add payment method</Text>
          <Text style={styles.label}>Card brand</Text>
          <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="Visa" />
          <Text style={styles.label}>Cardholder name</Text>
          <TextInput style={styles.input} value={holderName} onChangeText={setHolderName} placeholder="Rajesh Singh" />
          <Text style={styles.label}>Last 4 digits</Text>
          <TextInput style={styles.input} value={last4} onChangeText={setLast4} keyboardType="number-pad" placeholder="4242" />
          <View style={styles.inlineFields}>
            <View style={styles.inlineField}>
              <Text style={styles.label}>Expiry month</Text>
              <TextInput style={styles.input} value={expiryMonth} onChangeText={setExpiryMonth} keyboardType="number-pad" placeholder="12" />
            </View>
            <View style={styles.inlineField}>
              <Text style={styles.label}>Expiry year</Text>
              <TextInput style={styles.input} value={expiryYear} onChangeText={setExpiryYear} keyboardType="number-pad" placeholder="28" />
            </View>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleAddMethod}>
            <Text style={styles.submitButtonText}>Add Method</Text>
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
  defaultBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  defaultBadgeText: { color: '#166534', fontSize: 11, fontWeight: '700' },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: { color: '#374151', fontSize: 13, fontWeight: '700' },
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
  inlineFields: { flexDirection: 'row', gap: 12 },
  inlineField: { flex: 1 },
  submitButton: { marginTop: 20, backgroundColor: '#007AFF', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
