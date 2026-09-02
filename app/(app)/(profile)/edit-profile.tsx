import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { FormAction, FormField, ResponsiveForm } from '../../../src/components/forms/ResponsiveForm';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [firstName, setFirstName] = React.useState(user?.firstName ?? '');
  const [lastName, setLastName] = React.useState(user?.lastName ?? '');
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [phone, setPhone] = React.useState(user?.phone ?? '');
  const [city, setCity] = React.useState(user?.city ?? '');

  const handleSave = async () => {
    await updateProfile({
      firstName: firstName.trim() || user?.firstName,
      lastName: lastName.trim() || user?.lastName,
      email: email.trim() || user?.email,
      phone: phone.trim(),
      city: city.trim(),
    });
    Alert.alert('Profile updated', 'Your profile changes have been saved.');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <ResponsiveForm style={styles.form}>
          <FormField label="First name"><TextInput style={styles.input} value={firstName} onChangeText={setFirstName} /></FormField>
          <FormField label="Last name"><TextInput style={styles.input} value={lastName} onChangeText={setLastName} /></FormField>
          <FormField label="Email"><TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" /></FormField>
          <FormField label="Phone"><TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" /></FormField>
          <FormField label="City"><TextInput style={styles.input} value={city} onChangeText={setCity} /></FormField>
          <FormAction><TouchableOpacity style={styles.saveButton} onPress={handleSave}><Text style={styles.saveButtonText}>Save Changes</Text></TouchableOpacity></FormAction>
        </ResponsiveForm>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { marginRight: 10 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  form: { padding: 16 },
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
  saveButton: {
    marginTop: 24,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
