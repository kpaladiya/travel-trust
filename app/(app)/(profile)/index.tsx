import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { demoUserProfile } from '../../../src/data/demo-rides';
import { userExperienceCopy } from '../../../src/types/user-mode';
import { canAccessAdminConsole } from '../../../src/services/admin-access';

export default function ProfileScreen() {
  const { user, signOut, experienceMode, setExperienceMode } = useAuth();
  const router = useRouter();

  const performLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (globalThis.confirm('Are you sure you want to sign out?')) {
        void performLogout();
      }
      return;
    }

    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Sign Out',
        onPress: () => void performLogout(),
      },
    ]);
  };

  const profile = user || demoUserProfile;
  const modeCopy = userExperienceCopy[experienceMode];
  const canManageAdminConsole = canAccessAdminConsole(user?.email);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileImageText}>
              {profile.firstName[0]}
              {profile.lastName[0]}
            </Text>
          </View>
          <Text style={styles.userName}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>{profile.rating}</Text>
            <Text style={styles.reviewsText}>({profile.reviews} reviews)</Text>
          </View>
          <TouchableOpacity style={styles.badgeContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
            <Text style={styles.badgeText}>Verified</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{demoUserProfile.rides.completed}</Text>
            <Text style={styles.statLabel}>Completed Rides</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {demoUserProfile.rides.upcoming}
            </Text>
            <Text style={styles.statLabel}>Upcoming Rides</Text>
          </View>
        </View>

        <View style={styles.modeCard}>
          <Text style={styles.modeTitle}>Current app mode</Text>
          <Text style={styles.modeDescription}>{modeCopy.description}</Text>
          <View style={styles.modeSwitcher}>
            {(['creator', 'finder'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.modeButton, experienceMode === mode && styles.modeButtonActive]}
                onPress={() => void setExperienceMode(mode)}
              >
                <Text style={[styles.modeButtonText, experienceMode === mode && styles.modeButtonTextActive]}>
                  {userExperienceCopy[mode].shortLabel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(app)/(profile)/edit-profile')}>
            <Ionicons name="person-outline" size={20} color="#007AFF" />
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(app)/(profile)/documents')}>
            <Ionicons name="document-text-outline" size={20} color="#007AFF" />
            <Text style={styles.menuItemText}>My Documents</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(app)/(profile)/payment-methods')}>
            <Ionicons name="wallet-outline" size={20} color="#007AFF" />
            <Text style={styles.menuItemText}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(app)/(profile)/compliance-center')}
          >
            <Ionicons name="shield-outline" size={20} color="#007AFF" />
            <Text style={styles.menuItemText}>Compliance Center</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(app)/(profile)/trust-dashboard')}
          >
            <Ionicons name="analytics-outline" size={20} color="#007AFF" />
            <Text style={styles.menuItemText}>Trust Dashboard</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          {canManageAdminConsole ? (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/(app)/(profile)/admin-console')}
            >
              <Ionicons name="speedometer-outline" size={20} color="#007AFF" />
              <Text style={styles.menuItemText}>Admin Console</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(app)/(profile)/help-support')}>
            <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>TravelTrust v1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2024. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImageText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  ratingSection: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  reviewsText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#999',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#007AFF',
  },
  statsContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  modeCard: {
    backgroundColor: '#fff',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  modeDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#4B5563',
  },
  modeSwitcher: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemDanger: {
    marginTop: 8,
  },
  menuItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  menuItemTextDanger: {
    color: '#FF3B30',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  footerSubtext: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 4,
  },
});
